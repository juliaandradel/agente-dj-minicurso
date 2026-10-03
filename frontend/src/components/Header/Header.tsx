import { Logo } from '../Logo'
import styles from './Header.module.css'

type Props = {
  onNewPlaylist: () => void
}

export function Header({ onNewPlaylist }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo />
        <span aria-hidden="true" className={styles.divider} />
        <span className={styles.name}>
          <span className={styles.dj}>Dj</span> <span className={styles.agent}>Agent</span>
        </span>
      </div>

      <button type="button" className={styles.newButton} onClick={onNewPlaylist}>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className={styles.plus}
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Nova Playlist
      </button>
    </header>
  )
}
