import { useCallback, useEffect, useRef, useState } from 'react'
import { AgentError, requestPlaylist } from '../api/client'
import type { AgentReply, ChatMessage, HistoryEntry, Playlist } from '../types/playlist'

/** Índices das faixas que mudaram, quando a resposta não traz `highlights`. */
function diffHighlights(next: Playlist, previous: Playlist | null): number[] {
  if (!previous) return []
  const key = (t: { title: string; artist: string }) => t.title + '\u0000' + t.artist
  const before = previous.tracks.map(key)
  return next.tracks.reduce<number[]>((acc, track, i) => {
    if (before[i] !== key(track)) acc.push(i)
    return acc
  }, [])
}

function metaFor(tracks: unknown[], adjusted: boolean): string {
  const word = tracks.length === 1 ? 'música' : 'músicas'
  return tracks.length + ' ' + word + (adjusted ? ' · seleção atualizada' : '')
}

export type UseChat = {
  messages: ChatMessage[]
  draft: string
  busy: boolean
  setDraft: (value: string) => void
  submit: (text?: string) => void
  retry: () => void
  reset: () => void
}

export function useChat(): UseChat {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  const pending = useRef<string | null>(null)
  const current = useRef<Playlist | null>(null)
  const history = useRef<HistoryEntry[]>([])
  const abort = useRef<AbortController | null>(null)
  const seq = useRef(0)

  const nid = () => 'm' + ++seq.current

  useEffect(() => () => abort.current?.abort(), [])

  const run = useCallback((text: string) => {
    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    requestPlaylist(text, history.current.slice(), current.current, controller.signal).then(
      (result: AgentReply) => {
        if (controller.signal.aborted) return
        const adjusted = current.current !== null
        const playlist: Playlist = {
          ...result.playlist,
          highlights: result.playlist.highlights ?? diffHighlights(result.playlist, current.current),
          meta: result.playlist.meta ?? metaFor(result.playlist.tracks, adjusted),
        }
        current.current = playlist
        history.current = history.current.concat({ role: 'agent', text: result.reply })
        setMessages((prev) =>
          prev
            .filter((m) => m.role !== 'loading')
            .concat({ id: nid(), role: 'agent', text: result.reply, playlist }),
        )
        setBusy(false)
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        const detail = error instanceof AgentError ? error.detail : undefined
        setMessages((prev) =>
          prev.filter((m) => m.role !== 'loading').concat({ id: nid(), role: 'error', detail }),
        )
        setBusy(false)
        // o pedido volta para o campo: nada se perde
        setDraft(text)
      },
    )
  }, [])

  const submit = useCallback(
    (value?: string) => {
      const text = String(typeof value === 'string' ? value : draft).trim()
      if (!text || busy) return
      history.current = history.current.concat({ role: 'user', text })
      setMessages((prev) =>
        prev
          .filter((m) => m.role !== 'error')
          .concat([{ id: nid(), role: 'user', text }, { id: nid(), role: 'loading' }]),
      )
      setDraft('')
      setBusy(true)
      pending.current = text
      run(text)
    },
    [busy, draft, run],
  )

  const retry = useCallback(() => {
    const text = pending.current
    if (!text || busy) return
    setMessages((prev) => prev.filter((m) => m.role !== 'error').concat({ id: nid(), role: 'loading' }))
    setDraft('')
    setBusy(true)
    run(text)
  }, [busy, run])

  const reset = useCallback(() => {
    abort.current?.abort()
    abort.current = null
    pending.current = null
    current.current = null
    history.current = []
    setMessages([])
    setDraft('')
    setBusy(false)
  }, [])

  return { messages, draft, busy, setDraft, submit, retry, reset }
}
