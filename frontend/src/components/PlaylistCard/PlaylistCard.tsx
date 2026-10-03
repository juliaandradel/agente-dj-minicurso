import { useState } from 'react'
import type { Platform, Playlist } from '../../types/playlist'
import { trackUrl } from '../../types/playlist'
import { HappyRobot } from '../HappyRobot'
import { TrackRow } from '../TrackRow'
import styles from './PlaylistCard.module.css'

type Props = {
  playlist: Playlist
  platform: Platform
  collapsedCount?: number
  showMascot?: boolean
}

export function PlaylistCard({
  playlist,
  platform,
  collapsedCount = 5,
  showMascot = true,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const tracks = playlist.tracks ?? []
  const n = tracks.length
  const canExpand = n > collapsedCount
  const visible = expanded || !canExpand ? tracks : tracks.slice(0, collapsedCount)
  const highlights = playlist.highlights ?? []
  const word = n === 1 ? 'música' : 'músicas'

  return (
    <div className={styles.outer} style={{ paddingBottom: showMascot ? 32 : 0 }}>
      <section aria-label={`Playlist ${playlist.title}`} className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>{playlist.title}</h2>
          <p className={styles.meta}>{playlist.meta || `${n} ${word}`}</p>
        </header>

        <ol className={styles.list}>
          {visible.map((track, i) => (
            <li key={`${track.title}-${track.artist}-${i}`} className={styles.item}>
              <TrackRow
                number={String(i + 1).padStart(2, '0')}
                title={track.title}
                artist={track.artist}
                url={trackUrl(track, platform)}
                platform={platform}
                highlighted={highlights.includes(i)}
              />
            </li>
          ))}
        </ol>

        <footer
          className={styles.footer}
          style={{ padding: showMascot ? '14px 108px 14px 14px' : '6px 14px 8px' }}
        >
          <span className={styles.shown}>{`Mostrando ${visible.length} de ${n} ${word}`}</span>

          {canExpand ? (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Recolher playlist' : 'Expandir playlist'}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                className={styles.chevron}
                style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          ) : null}
        </footer>

        {showMascot ? (
          <div aria-hidden="true" className={styles.mascot}>
            <HappyRobot size={104} />
          </div>
        ) : null}
      </section>
    </div>
  )
}
