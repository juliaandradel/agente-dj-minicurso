import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia?.(QUERY)
  if (!mq) return () => {}
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return !!window.matchMedia?.(QUERY).matches
}

/** Lê `prefers-reduced-motion` e reage a mudanças da preferência. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
