import vinil from '../../assets/vinil.png'
import type { Platform, Playlist } from '../../types/playlist'
import { PlaylistCard } from '../PlaylistCard'
import styles from './AgentMessage.module.css'

type Props = {
  text: string
  playlist?: Playlist | null
  platform: Platform
}

export function AgentMessage({ text, playlist, platform }: Props) {
  return (
    <article className={styles.root}>
      <div className={styles.line}>
        <img src={vinil} alt="" className={styles.disc} />
        <p className={styles.text}>
          <span className="srOnly">Dj Agent: </span>
          {text}
        </p>
      </div>

      {playlist ? (
        <div className={styles.cardSlot}>
          <PlaylistCard playlist={playlist} platform={platform} />
        </div>
      ) : null}
    </article>
  )
}
