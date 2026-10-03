import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import type { AgentReply, Playlist } from '../types/playlist'

const requestPlaylist = vi.fn()

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof import('../api/client')>('../api/client')
  return {
    ...actual,
    PLATFORM: 'spotify' as const,
    requestPlaylist: (...args: unknown[]) => requestPlaylist(...args),
  }
})

function playlist(title = 'Mood feliz'): Playlist {
  return {
    title,
    tracks: [
      { title: 'Happy', artist: 'Pharrell Williams' },
      { title: 'Here Comes the Sun', artist: 'The Beatles' },
    ],
  }
}

function reply(text = 'Uma seleção leve para combinar com o seu dia.'): AgentReply {
  return { reply: text, playlist: playlist() }
}

beforeEach(() => {
  requestPlaylist.mockReset()
  requestPlaylist.mockResolvedValue(reply())
})

afterEach(() => {
  vi.restoreAllMocks()
})

const campo = () => screen.getByRole('textbox', { name: 'Descreva a vibe da sua playlist' })

describe('envio', () => {
  it('Enter envia o pedido', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(campo(), 'quero dançar{Enter}')

    await waitFor(() => expect(requestPlaylist).toHaveBeenCalledTimes(1))
    expect(requestPlaylist.mock.calls[0][0]).toBe('quero dançar')
    expect(await screen.findByText('quero dançar')).toBeInTheDocument()
  })

  it('Shift+Enter não envia', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(campo(), 'quero dançar')
    await user.keyboard('{Shift>}{Enter}{/Shift}')

    expect(requestPlaylist).not.toHaveBeenCalled()
    expect(campo()).toHaveValue('quero dançar')
  })

  it('clicar numa sugestão envia o texto dela', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'músicas brasileiras' }))

    await waitFor(() => expect(requestPlaylist).toHaveBeenCalledTimes(1))
    expect(requestPlaylist.mock.calls[0][0]).toBe('músicas brasileiras')
  })
})

describe('erro', () => {
  it('devolve o pedido ao campo', async () => {
    const user = userEvent.setup()
    requestPlaylist.mockRejectedValue(new Error('falhou'))
    render(<App />)

    await user.type(campo(), 'quero dançar{Enter}')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await waitFor(() => expect(campo()).toHaveValue('quero dançar'))
  })

  it('o botão de tentar de novo reenvia o mesmo pedido', async () => {
    const user = userEvent.setup()
    requestPlaylist.mockRejectedValueOnce(new Error('falhou')).mockResolvedValue(reply())
    render(<App />)

    await user.type(campo(), 'quero dançar{Enter}')
    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: 'Ocorreu um erro, tente novamente' }))

    await waitFor(() => expect(requestPlaylist).toHaveBeenCalledTimes(2))
    expect(requestPlaylist.mock.calls[1][0]).toBe('quero dançar')
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })
})

describe('Nova Playlist', () => {
  it('limpa a conversa e volta ao início', async () => {
    const user = userEvent.setup()
    render(<App />)

    // frase que não coincide com nenhum chip de sugestão
    await user.type(campo(), 'algo para o fim da tarde{Enter}')
    expect(await screen.findByRole('heading', { name: 'Mood feliz' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Nova Playlist' }))

    expect(screen.queryByText('algo para o fim da tarde')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Vamos criar a sua playlist de hoje?' }),
    ).toBeInTheDocument()
    expect(campo()).toHaveValue('')
  })
})

describe('faixa trocada', () => {
  it('fica destacada quando o backend não manda highlights', async () => {
    const user = userEvent.setup()
    requestPlaylist
      .mockResolvedValueOnce(reply())
      .mockResolvedValueOnce({
        reply: 'Troquei a segunda faixa e mantive as outras.',
        playlist: {
          title: 'Mood feliz',
          tracks: [
            { title: 'Happy', artist: 'Pharrell Williams' },
            { title: 'Velha Infância', artist: 'Tribalistas' },
          ],
        },
      })
    render(<App />)

    await user.type(campo(), 'quero dançar{Enter}')
    await screen.findByRole('heading', { name: 'Mood feliz' })

    await user.type(campo(), 'troque a segunda por uma brasileira{Enter}')
    await screen.findByText('Velha Infância')

    // o índice que mudou foi calculado comparando título + artista
    const cards = screen.getAllByRole('region', { name: 'Playlist Mood feliz' })
    const ajustada = within(cards[cards.length - 1])
    expect(ajustada.getByText(/Velha Infância/).textContent).toContain('(faixa nova)')
    expect(ajustada.getByText(/Happy/).textContent).not.toContain('(faixa nova)')
  })
})
