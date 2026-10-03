import type { Platform } from '../../types/playlist'
import { PLATFORM_NAME, searchUrl } from '../../types/playlist'
import styles from './TrackRow.module.css'

type Props = {
  number: string
  title: string
  artist: string
  url?: string
  platform: Platform
  highlighted: boolean
}

export function TrackRow({ number, title, artist, url, platform, highlighted }: Props) {
  const name = PLATFORM_NAME[platform] ?? PLATFORM_NAME.spotify
  const href = url || searchUrl(platform, title, artist)

  return (
    <div className={highlighted ? `${styles.root} ${styles.highlighted}` : styles.root}>
      <span className={styles.number}>{number}</span>

      <div className={styles.texts}>
        <span className={styles.title}>
          {title}
          {highlighted ? <span className="srOnly"> (faixa nova)</span> : null}
        </span>
        <span className={styles.artist}>{artist}</span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ouvir ${title}, de ${artist}, no ${name} (abre em nova aba)`}
        className={styles.link}
      >
        {`Ouvir no ${name}`}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className={styles.arrow}
        >
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </a>
    </div>
  )
}
