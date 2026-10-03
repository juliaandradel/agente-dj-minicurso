import styles from './ErrorMessage.module.css'

type Props = {
  detail?: string
}

export function ErrorMessage({ detail }: Props) {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Não consegui montar sua playlist agora.</h2>
      <p className={styles.lead}>Seu pedido foi mantido.</p>
      {detail ? <p className={styles.detail}>{detail}</p> : null}
    </div>
  )
}
