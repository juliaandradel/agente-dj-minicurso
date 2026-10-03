import type { AgentReply, Playlist, Track } from '../types/playlist'

/**
 * Agente falso do protótipo (`design-handoff/reference/App.dc.html`).
 * Serve para o minicurso rodar sem backend e para os testes.
 */

const MOCK_DELAY = 1800

function t(title: string, artist: string): Track {
  return { title, artist }
}

type Seed = { match: RegExp; title: string; intro: string; tracks: Track[] }

export function seeds(): Seed[] {
  return [
    {
      match: /viag|estrad|amig|road/i,
      title: 'Na estrada com as amigas',
      intro: 'Uma seleção animada para acompanhar vocês na estrada.',
      tracks: [
        t('Levitating', 'Dua Lipa'),
        t('Dancing Queen', 'ABBA'),
        t('September', 'Earth, Wind & Fire'),
        t('Walking on Sunshine', 'Katrina & The Waves'),
        t('Can’t Stop the Feeling!', 'Justin Timberlake'),
        t('Shake It Off', 'Taylor Swift'),
        t('Good as Hell', 'Lizzo'),
        t('Mr. Blue Sky', 'Electric Light Orchestra'),
      ],
    },
    {
      match: /foc|estud|concentr|trabalh/i,
      title: 'Foco total',
      intro: 'Uma seleção tranquila, sem distrações, para você se concentrar.',
      tracks: [
        t('Weightless', 'Marconi Union'),
        t('Intro', 'The xx'),
        t('Teardrop', 'Massive Attack'),
        t('Nuvole Bianche', 'Ludovico Einaudi'),
        t('Holocene', 'Bon Iver'),
        t('Avril 14th', 'Aphex Twin'),
      ],
    },
    {
      match: /brasil/i,
      title: 'Brasil no fone',
      intro: 'Uma seleção com o melhor da música brasileira.',
      tracks: [
        t('Mas Que Nada', 'Jorge Ben Jor'),
        t('Ainda Bem', 'Marisa Monte'),
        t('O Sol', 'Vitor Kley'),
        t('Velha Infância', 'Tribalistas'),
        t('Anunciação', 'Alceu Valença'),
        t('Garota de Ipanema', 'Tom Jobim'),
        t('Tempo Perdido', 'Legião Urbana'),
      ],
    },
    {
      match: /dan[cç]|pista|festa|balad/i,
      title: 'Pista liberada',
      intro: 'Uma seleção para não parar de dançar.',
      tracks: [
        t('Don’t Start Now', 'Dua Lipa'),
        t('Uptown Funk', 'Mark Ronson, Bruno Mars'),
        t('One More Time', 'Daft Punk'),
        t('Hung Up', 'Madonna'),
        t('I Wanna Dance with Somebody', 'Whitney Houston'),
        t('Get Lucky', 'Daft Punk, Pharrell Williams'),
        t('Dancing Queen', 'ABBA'),
        t('Levitating', 'Dua Lipa'),
        t('Shut Up and Dance', 'WALK THE MOON'),
        t('September', 'Earth, Wind & Fire'),
      ],
    },
    {
      match: /feliz|alegr|mood|humor/i,
      title: 'Mood feliz',
      intro: 'Uma seleção leve para combinar com o seu dia.',
      tracks: [
        t('Happy', 'Pharrell Williams'),
        t('Here Comes the Sun', 'The Beatles'),
        t('Walking on Sunshine', 'Katrina & The Waves'),
        t('Good as Hell', 'Lizzo'),
        t('Can’t Stop the Feeling!', 'Justin Timberlake'),
        t('Mr. Blue Sky', 'Electric Light Orchestra'),
      ],
    },
  ]
}

export function pools(): Record<'br' | 'dance' | 'calm' | 'mix', Track[]> {
  return {
    br: [
      t('O Sol', 'Vitor Kley'),
      t('Ainda Bem', 'Marisa Monte'),
      t('Velha Infância', 'Tribalistas'),
      t('País Tropical', 'Jorge Ben Jor'),
      t('Anunciação', 'Alceu Valença'),
      t('Mas Que Nada', 'Jorge Ben Jor'),
    ],
    dance: [
      t('Don’t Start Now', 'Dua Lipa'),
      t('Uptown Funk', 'Mark Ronson, Bruno Mars'),
      t('One More Time', 'Daft Punk'),
      t('Hung Up', 'Madonna'),
      t('Get Lucky', 'Daft Punk, Pharrell Williams'),
    ],
    calm: [
      t('Holocene', 'Bon Iver'),
      t('Teardrop', 'Massive Attack'),
      t('Nuvole Bianche', 'Ludovico Einaudi'),
      t('Intro', 'The xx'),
    ],
    mix: [
      t('Happy', 'Pharrell Williams'),
      t('Here Comes the Sun', 'The Beatles'),
      t('Good as Hell', 'Lizzo'),
      t('Shake It Off', 'Taylor Swift'),
      t('Mr. Blue Sky', 'Electric Light Orchestra'),
    ],
  }
}

export function createPlaylist(text: string): AgentReply {
  const list = seeds()
  const seed =
    list.find((s) => s.match.test(text)) ||
    { ...list[0], title: 'Sua seleção de hoje', intro: 'Montei uma seleção a partir do seu pedido.' }
  const tracks = seed.tracks.slice()
  return {
    reply: seed.intro,
    playlist: { title: seed.title, meta: tracks.length + ' músicas', tracks, highlights: [] },
  }
}

export function adjustPlaylist(text: string, cur: Playlist): AgentReply {
  const ords = ['primeir', 'segund', 'terceir', 'quart', 'quint', 'sext', 's[eé]tim', 'oitav', 'non', 'd[eé]cim']
  const words = ['primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima']
  const p = pools()
  const key: keyof typeof p = /brasil/i.test(text)
    ? 'br'
    : /dan[cç]|anima|energ|agit/i.test(text)
      ? 'dance'
      : /calm|tranq|relax|foc/i.test(text)
        ? 'calm'
        : 'mix'
  const tracks = cur.tracks.slice()
  const has = (x: Track) => tracks.some((y) => y.title === x.title)
  const pick = () => p[key].find((x) => !has(x)) || p.mix.find((x) => !has(x))

  let idx = -1
  ords.forEach((o, i) => {
    if (idx < 0 && new RegExp(o, 'i').test(text)) idx = i
  })
  const num = text.match(/\b(\d{1,2})\b/)
  if (idx < 0 && num) idx = parseInt(num[1], 10) - 1

  let reply: string
  let highlights: number[]

  if (/adicion|acrescent|inclu|mais (duas|2|uma|1)\b/i.test(text)) {
    const a = pick()
    if (a) tracks.push(a)
    const b = pick()
    if (b) tracks.push(b)
    highlights = [tracks.length - 2, tracks.length - 1]
    reply = 'Adicionei duas faixas ao final da seleção.'
  } else if (idx >= 0 && idx < tracks.length) {
    const t2 = pick()
    if (t2) tracks[idx] = t2
    highlights = [idx]
    reply = 'Troquei a ' + words[idx] + ' faixa e mantive as outras.'
  } else {
    const targets = [2, 4].filter((i) => i < tracks.length)
    targets.forEach((i) => {
      const t2 = pick()
      if (t2) tracks[i] = t2
    })
    highlights = targets
    reply =
      key === 'dance'
        ? 'Deixei mais dançante: troquei duas faixas e mantive as outras.'
        : key === 'br'
          ? 'Coloquei mais brasilidade: troquei duas faixas e mantive as outras.'
          : key === 'calm'
            ? 'Deixei mais tranquila: troquei duas faixas e mantive as outras.'
            : 'Ajustei duas faixas a partir do seu pedido e mantive as outras.'
  }

  return {
    reply,
    playlist: { title: cur.title, meta: tracks.length + ' músicas · seleção atualizada', tracks, highlights },
  }
}

/** Mesma assinatura de `requestPlaylist`, com o atraso de 1800 ms do protótipo. */
export function mockRequestPlaylist(
  message: string,
  currentPlaylist: Playlist | null,
  signal?: AbortSignal,
  delay: number = MOCK_DELAY,
): Promise<AgentReply> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve(currentPlaylist ? adjustPlaylist(message, currentPlaylist) : createPlaylist(message))
    }, delay)
    function onAbort() {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
