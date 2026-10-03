import styles from './SuggestionChip.module.css'

type Props = {
  label: string
  onPick: (label: string) => void
}

export function SuggestionChip({ label, onPick }: Props) {
  return (
    <button type="button" className={styles.chip} onClick={() => onPick(label)}>
      {label}
    </button>
  )
}
