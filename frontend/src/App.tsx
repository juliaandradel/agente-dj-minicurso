import { useEffect, useRef } from 'react'
import styles from './App.module.css'
import { PLATFORM } from './api/client'
import { AgentMessage } from './components/AgentMessage'
import { BlobBackground } from './components/BlobBackground'
import { ErrorCard } from './components/ErrorCard'
import { Header } from './components/Header'
import { LoadingState } from './components/LoadingState'
import { PromptInput } from './components/PromptInput'
import { UserMessage } from './components/UserMessage'
import { WelcomeHero } from './components/WelcomeHero'
import { useChat } from './hooks/useChat'

function App() {
  const { messages, draft, busy, setDraft, submit, retry, reset } = useChat()
  const scroller = useRef<HTMLElement>(null)
  const count = messages.length

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const timer = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }, 60)
    return () => clearTimeout(timer)
  }, [count])

  return (
    <div className={styles.root}>
      <BlobBackground size={600} />

      <div className={styles.headerSlot}>
        <Header onNewPlaylist={reset} />
      </div>

      {count === 0 ? (
        <main className={styles.homeMain}>
          <div className={styles.homeInner}>
            <WelcomeHero value={draft} onChange={setDraft} onSubmit={submit} />
          </div>
        </main>
      ) : (
        <>
          <main ref={scroller} aria-live="polite" className={styles.chatMain}>
            <div className={styles.thread}>
              {messages.map((message) => {
                if (message.role === 'user') {
                  return <UserMessage key={message.id} text={message.text ?? ''} />
                }
                if (message.role === 'loading') {
                  return <LoadingState key={message.id} />
                }
                if (message.role === 'agent') {
                  return (
                    <AgentMessage
                      key={message.id}
                      text={message.text ?? ''}
                      playlist={message.playlist}
                      platform={PLATFORM}
                    />
                  )
                }
                return (
                  <div key={message.id} className={styles.errorSlot}>
                    <div className={styles.errorInner}>
                      <ErrorCard detail={message.detail} onRetry={retry} />
                    </div>
                  </div>
                )
              })}
            </div>
          </main>

          <div className={styles.dock}>
            <PromptInput
              variant="docked"
              value={draft}
              onChange={setDraft}
              onSubmit={submit}
              disabled={busy}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
