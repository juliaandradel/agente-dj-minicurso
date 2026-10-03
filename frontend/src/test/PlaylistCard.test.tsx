import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PlaylistCard } from '../components/PlaylistCard'
import type { Playlist } from '../types/playlist'

const OITO: Playlist = {
  title: 'Na estrada com as amigas',
  tracks: [
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'Dancing Queen', artist: 'ABBA' },
    { title: 'September', artist: 'Earth, Wind & Fire' },
    { title: 'Walking on Sunshine', artist: 'Katrina & The Waves' },
    { title: 'Can’t Stop the Feeling!', artist: 'Justin Timberlake' },
    { title: 'Shake It Off', artist: 'Taylor Swift' },
    { title: 'Good as Hell', artist: 'Lizzo' },
    { title: 'Mr. Blue Sky', artist: 'Electric Light Orchestra' },
  ],
  highlights: [],
}

describe('PlaylistCard', () => {
  it('mostra 5 faixas e expande para todas', async () => {
    const user = userEvent.setup()
    render(<PlaylistCard playlist={OITO} platform="spotify" />)

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText('Mostrando 5 de 8 músicas')).toBeInTheDocument()

    const botao = screen.getByRole('button', { name: /Expandir playlist/ })
    expect(botao).toHaveAttribute('aria-expanded', 'false')

    await user.click(botao)

    expect(screen.getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getByText('Mostrando 8 de 8 músicas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Recolher playlist/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('não oferece expandir quando cabe tudo', () => {
    render(
      <PlaylistCard playlist={{ ...OITO, tracks: OITO.tracks.slice(0, 3) }} platform="spotify" />,
    )

    expect(screen.queryByRole('button', { name: /Expandir playlist/ })).not.toBeInTheDocument()
    expect(screen.getByText('Mostrando 3 de 3 músicas')).toBeInTheDocument()
  })

  it('usa o singular com uma faixa só', () => {
    render(
      <PlaylistCard playlist={{ ...OITO, tracks: OITO.tracks.slice(0, 1) }} platform="spotify" />,
    )

    expect(screen.getByText('1 música')).toBeInTheDocument()
    expect(screen.getByText('Mostrando 1 de 1 música')).toBeInTheDocument()
  })

  it('marca a faixa trocada para quem usa leitor de tela', () => {
    render(<PlaylistCard playlist={{ ...OITO, highlights: [1] }} platform="spotify" />)

    const destacada = screen.getByText('Dancing Queen')
    expect(destacada.textContent).toContain('(faixa nova)')
    expect(screen.getByText('Levitating').textContent).not.toContain('(faixa nova)')
  })

  it('cai na busca da plataforma quando a faixa não tem link', () => {
    render(<PlaylistCard playlist={OITO} platform="deezer" />)

    const link = screen.getByRole('link', {
      name: 'Ouvir Levitating, de Dua Lipa, no Deezer (abre em nova aba)',
    })
    expect(link).toHaveAttribute(
      'href',
      'https://www.deezer.com/br/search/' + encodeURIComponent('Levitating Dua Lipa'),
    )
    expect(link).toHaveTextContent('Ouvir no Deezer')
  })

  it('usa o link da plataforma quando ele vem da API', () => {
    const comLink: Playlist = {
      ...OITO,
      tracks: [
        {
          title: 'Levitating',
          artist: 'Dua Lipa',
          links: { spotify: 'https://open.spotify.com/track/abc' },
        },
      ],
    }
    render(<PlaylistCard playlist={comLink} platform="spotify" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://open.spotify.com/track/abc')
  })
})
