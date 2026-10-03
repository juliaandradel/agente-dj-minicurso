import { useEffect, useRef } from 'react'
import bolha3d from '../../assets/bolha-3d.png'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './BlobBackground.module.css'

type Props = {
  size?: number
}

export function BlobBackground({ size = 600 }: Props) {
  const blob = useRef<HTMLImageElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = blob.current
    if (!el || reduced || typeof el.animate !== 'function') return
    // movimento lento: só translada para cima/esquerda e cresce a partir do canto,
    // assim as bordas cortadas da imagem nunca aparecem
    const animation = el.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)' },
        { transform: 'translate(-14px, -18px) scale(1.035)' },
        { transform: 'translate(8px, -6px) scale(1.015)' },
        { transform: 'translate(0px, 0px) scale(1)' },
      ],
      { duration: 18000, iterations: Infinity, easing: 'ease-in-out' },
    )
    return () => animation.cancel()
  }, [reduced])

  return (
    <div aria-hidden="true" className={styles.root}>
      <img
        ref={blob}
        src={bolha3d}
        alt=""
        decoding="async"
        className={styles.blob}
        style={{ width: size }}
      />
    </div>
  )
}
