import styles from './UserMessage.module.css'

type Props = {
  text: string
}

export function UserMessage({ text }: Props) {
  return (
    <div className={styles.root}>
      <p className={styles.bubble}>
        <span className="srOnly">Você: </span>
        {text}
      </p>
    </div>
  )
}
