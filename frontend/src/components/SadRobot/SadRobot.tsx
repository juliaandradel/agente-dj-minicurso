import roboTriste from '../../assets/robo-triste.png'
import styles from './SadRobot.module.css'

type Props = {
  size?: number
}

export function SadRobot({ size = 300 }: Props) {
  return (
    <div className={styles.root} style={{ width: size }}>
      <img
        src={roboTriste}
        alt="Robô de fones de ouvido, triste e de braços cruzados"
        className={styles.image}
      />
    </div>
  )
}
