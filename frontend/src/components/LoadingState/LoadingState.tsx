import { useEffect, useRef } from 'react'
import vinil from '../../assets/vinil.png'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './LoadingState.module.css'

export function LoadingState() {
  const disc = useRef<HTMLImageElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = disc.current
    if (!el || typeof el.animate !== 'function') return
    // 33⅓ rpm ≈ 1,8 s por volta. Com movimento reduzido ainda gira,
    // porque o giro é o feedback de carregamento, mas devagar.
    const animation = el.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
      { duration: reduced ? 6000 : 1800, iterations: Infinity, easing: 'linear' },
    )
    return () => animation.cancel()
  }, [reduced])

  return (
    <div role="status" className={styles.root}>
      <img ref={disc} src={vinil} alt="" className={styles.disc} />
      <p className={styles.text}>Encontrando o som perfeito para você…</p>
    </div>
  )
}
