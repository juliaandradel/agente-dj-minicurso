import roboFeliz from '../../assets/robo-feliz.png'
import styles from './HappyRobot.module.css'

type Props = {
  size?: number
}

export function HappyRobot({ size = 104 }: Props) {
  return (
    <div className={styles.root} style={{ width: size }}>
      <img src={roboFeliz} alt="" className={styles.image} />
    </div>
  )
}
