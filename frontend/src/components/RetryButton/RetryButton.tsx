import styles from './RetryButton.module.css'

type Props = {
  onRetry: () => void
}

export function RetryButton({ onRetry }: Props) {
  return (
    <button type="button" className={styles.button} onClick={onRetry}>
      Ocorreu um erro, tente novamente
    </button>
  )
}
