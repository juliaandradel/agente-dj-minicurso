import { ErrorMessage } from '../ErrorMessage'
import { RetryButton } from '../RetryButton'
import { SadRobot } from '../SadRobot'
import styles from './ErrorCard.module.css'

type Props = {
  detail?: string
  onRetry: () => void
}

export function ErrorCard({ detail, onRetry }: Props) {
  return (
    <section role="alert" className={styles.card}>
      <SadRobot size={300} />
      <div className={styles.column}>
        <ErrorMessage detail={detail} />
        <RetryButton onRetry={onRetry} />
      </div>
    </section>
  )
}
