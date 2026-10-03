import type { AgentReply, HistoryEntry, Platform, Playlist, Track } from '../types/playlist'
import { mockRequestPlaylist } from './mockAgent'

const TIMEOUT_MS = 30000

const API_URL = (import.meta.env.VITE_API_URL ?? '') as string

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'

export const PLATFORM: Platform = (() => {
  const raw = String(import.meta.env.VITE_PLATFORM ?? 'spotify')
  return raw === 'apple' || raw === 'deezer' ? raw : 'spotify'
})()

/** Erro de qualquer etapa da chamada. `detail` vai para o cartão de erro. */
export class AgentError extends Error {
  detail?: string
  constructor(message: string, detail?: string) {
    super(message)
    this.name = 'AgentError'
    this.detail = detail
  }
}

function isTrack(value: unknown): value is Track {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return typeof t.title === 'string' && typeof t.artist === 'string'
}

/** Confere a forma da resposta: um JSON válido mas fora do contrato também é erro. */
function parseReply(data: unknown): AgentReply {
  if (typeof data !== 'object' || data === null) {
    throw new AgentError('Resposta fora do contrato')
  }
  const body = data as Record<string, unknown>
  const playlist = body.playlist as Record<string, unknown> | undefined
  if (typeof body.reply !== 'string' || !playlist || typeof playlist.title !== 'string') {
    throw new AgentError('Resposta fora do contrato')
  }
  if (!Array.isArray(playlist.tracks) || !playlist.tracks.every(isTrack)) {
    throw new AgentError('Resposta fora do contrato')
  }
  const highlights = Array.isArray(playlist.highlights)
    ? playlist.highlights.filter((n): n is number => typeof n === 'number')
    : undefined
  return {
    reply: body.reply,
    playlist: {
      title: playlist.title,
      tracks: playlist.tracks as Track[],
      highlights,
    },
  }
}

/**
 * Uma rodada do agente. Em modo mock não toca a rede.
 * Erros de rede, HTTP fora de 2xx, JSON inválido e o timeout de 30 s
 * viram `AgentError`; o `AbortError` do cancelamento passa direto.
 */
export async function requestPlaylist(
  message: string,
  history: HistoryEntry[],
  currentPlaylist: Playlist | null,
  signal?: AbortSignal,
): Promise<AgentReply> {
  if (USE_MOCK) {
    return mockRequestPlaylist(message, currentPlaylist, signal)
  }

  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  const onOuterAbort = () => timeout.abort()
  signal?.addEventListener('abort', onOuterAbort, { once: true })

  try {
    const response = await fetch(API_URL + '/api/playlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        current_playlist: currentPlaylist,
      }),
      signal: timeout.signal,
    })

    if (!response.ok) {
      let detail: string | undefined
      try {
        const body = (await response.json()) as { detail?: unknown }
        if (typeof body?.detail === 'string') detail = body.detail
      } catch {
        // corpo sem JSON: o status já basta
      }
      throw new AgentError('HTTP ' + response.status, detail)
    }

    let data: unknown
    try {
      data = await response.json()
    } catch {
      throw new AgentError('Resposta não é JSON')
    }
    return parseReply(data)
  } catch (error) {
    // Cancelamento pedido por quem chamou ("Nova Playlist") sobe como está.
    if (signal?.aborted) throw error
    if (error instanceof AgentError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AgentError('Tempo esgotado', 'A resposta demorou mais de 30 segundos.')
    }
    throw new AgentError('Falha de rede')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onOuterAbort)
  }
}
