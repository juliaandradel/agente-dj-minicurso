import styles from './Logo.module.css'

const SPARK_PATH = 'M12 1c.7 6.2 4.8 10.3 11 11-6.2.7-10.3 4.8-11 11-.7-6.2-4.8-10.3-11-11C7.2 11.3 11.3 7.2 12 1Z'

function Spark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ff6419" aria-hidden="true">
      <path d={SPARK_PATH} />
    </svg>
  )
}

export function Logo() {
  return (
    <div role="img" aria-label="<div>a" className={styles.root}>
      <Spark />
      <span aria-hidden="true" className={styles.text}>
        <span className={styles.div}>&lt;div&gt;</span>
        <span className={styles.a}>a</span>
      </span>
      <Spark />
    </div>
  )
}
