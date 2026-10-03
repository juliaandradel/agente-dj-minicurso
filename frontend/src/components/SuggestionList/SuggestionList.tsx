import { SuggestionChip } from '../SuggestionChip'
import styles from './SuggestionList.module.css'

const PADRAO = ['hoje tô no mood feliz', 'quero dançar', 'músicas brasileiras', 'preciso focar']

type Props = {
  suggestions?: string[]
  onPick: (label: string) => void
}

export function SuggestionList({ suggestions = PADRAO, onPick }: Props) {
  return (
    <ul aria-label="Sugestões de pedido" className={styles.list}>
      {suggestions.map((label) => (
        <li key={label}>
          <SuggestionChip label={label} onPick={onPick} />
        </li>
      ))}
    </ul>
  )
}
