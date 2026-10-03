export type Platform = 'spotify' | 'apple' | 'deezer'

export type TrackLinks = {
  spotify?: string
  apple_music?: string
  deezer?: string
}

export type Track = {
  title: string
  artist: string
  links?: TrackLinks
}

export type Playlist = {
  title: string
  tracks: Track[]
  highlights?: number[]
  meta?: string
}

export type ChatRole = 'user' | 'loading' | 'agent' | 'error'

export type ChatMessage = {
  id: string
  role: ChatRole
  text?: string
  playlist?: Playlist | null
  detail?: string
}

/** Resposta do agente, do backend ou do mock. */
export type AgentReply = {
  reply: string
  playlist: Playlist
}

/** Uma troca anterior, enviada ao backend como contexto. */
export type HistoryEntry = {
  role: 'user' | 'agent'
  text: string
}

/** Chave de `links` correspondente a cada plataforma. */
export const LINK_KEY: Record<Platform, keyof TrackLinks> = {
  spotify: 'spotify',
  apple: 'apple_music',
  deezer: 'deezer',
}

export const PLATFORM_NAME: Record<Platform, string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  deezer: 'Deezer',
}

/** Busca na plataforma, usada quando a faixa não vem com link. */
export function searchUrl(platform: Platform, title: string, artist: string): string {
  const q = encodeURIComponent(title + ' ' + artist)
  if (platform === 'apple') return 'https://music.apple.com/br/search?term=' + q
  if (platform === 'deezer') return 'https://www.deezer.com/br/search/' + q
  return 'https://open.spotify.com/search/' + q
}

/** Link da faixa na plataforma escolhida, ou a busca quando não houver. */
export function trackUrl(track: Track, platform: Platform): string {
  return track.links?.[LINK_KEY[platform]] || searchUrl(platform, track.title, track.artist)
}
