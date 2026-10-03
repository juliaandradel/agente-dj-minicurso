import type { KeyboardEvent } from 'react'
import styles from './PromptInput.module.css'

type Props = {
  variant: 'hero' | 'docked'
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
  disabled?: boolean
}

function Arrow({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={styles.arrow}
    >
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  )
}

export function PromptInput({ variant, value, onChange, onSubmit, disabled = false }: Props) {
  const empty = !value.trim()
  const opacity = disabled || empty ? 0.6 : 1

  const send = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSubmit(text)
  }

  // Enter envia, sem depender do submit nativo do form.
  // Shift+Enter e composição de IME também seguram o preventDefault, senão o
  // navegador faz o envio implícito do form e acaba enviando mesmo assim.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (event.shiftKey || event.nativeEvent.isComposing) return
    send()
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <label className={styles.label}>
        <span className="srOnly">Descreva a vibe da sua playlist</span>
        <input
          type="text"
          enterKeyHint="send"
          className={styles.input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="qual a vibe para começar?"
        />
      </label>

      {variant === 'hero' ? (
        <button
          type="button"
          className={styles.heroButton}
          style={{ opacity }}
          onClick={send}
          disabled={disabled}
        >
          Montar playlist
          <Arrow size={20} />
        </button>
      ) : (
        <button
          type="button"
          className={styles.dockedButton}
          style={{ opacity }}
          onClick={send}
          disabled={disabled}
          aria-label="Enviar mensagem"
        >
          <Arrow size={24} />
        </button>
      )}
    </form>
  )
}
