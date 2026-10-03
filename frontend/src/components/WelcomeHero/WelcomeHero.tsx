import { HeroTitle } from '../HeroTitle'
import { PromptInput } from '../PromptInput'
import { SuggestionList } from '../SuggestionList'
import styles from './WelcomeHero.module.css'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
}

export function WelcomeHero({ value, onChange, onSubmit }: Props) {
  return (
    <section className={styles.root}>
      <HeroTitle />
      <div className={styles.controls}>
        <SuggestionList onPick={onSubmit} />
        <PromptInput variant="hero" value={value} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </section>
  )
}
