import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Mascot } from '../../components/Mascot/Mascot'
import { CoinPill } from '../../components/CoinPill/CoinPill'
import { XPPill } from '../../components/XPPill/XPPill'
import { MuteButton } from '../../components/MuteButton/MuteButton'
import { getGreeting } from '../../utils/greetings'
import { TOPICS } from '../../data/topics'
import { GAME_CONSTANTS } from '../../constants/game'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { state, dispatch } = useGame()
  const greeting = getGreeting(state.childName)
  const childInitial = state.childName.trim()
    ? state.childName.trim().charAt(0).toUpperCase()
    : '✨'

  // Build wonder prompt pool from non-hidden topics
  const wonderPool: string[] = []
  TOPICS.forEach((tp) => {
    if (state.hiddenTopics[tp.key]) return
    tp.questions.forEach((qq) => {
      if (qq.talk) wonderPool.push('Talk together: ' + qq.talk)
    })
    if (tp.summaryPrompt) wonderPool.push(tp.summaryPrompt)
  })
  const wonderPrompt =
    wonderPool.length > 0
      ? wonderPool[state.wonderIdx % wonderPool.length]
      : 'What is something you have always wondered about?'

  const level = Math.floor(state.xp / GAME_CONSTANTS.LEVEL_XP) + 1

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}>
            <Mascot
              variant={state.avatarVariant}
              mood="happy"
              size={52}
            />
          </div>
          <div>
            <div className={styles.greeting}>{greeting}</div>
            <div className={styles.subtitle}>Ready to explore?</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MuteButton
            muted={state.muted}
            onToggle={() => {
              if (window.FTSound) window.FTSound.setMuted(!state.muted)
              dispatch({ type: 'TOGGLE_MUTE' })
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <XPPill
              xp={state.xp}
              bump={state.pulseCoins}
              reduceMotion={state.reduceMotion}
            />
            <CoinPill
              coins={state.coins}
              bump={state.pulseCoins}
              reduceMotion={state.reduceMotion}
            />
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.speechBubble}>What should we discover today?</div>
        <div className={styles.heroMascot}>
          <Mascot
            variant={state.avatarVariant}
            mood="happy"
            size={150}
          />
        </div>
        <motion.button
          className={styles.ctaButton}
          onClick={() => {
            if (window.FTSound) window.FTSound.tap()
            dispatch({ type: 'GO_TOPICS' })
          }}
          whileTap={{ y: 4 }}
        >
          Let's play!
        </motion.button>
      </div>

      {/* Wonder Together */}
      <div className={styles.wonderCard}>
        <div className={styles.wonderHeader}>
          <span className={styles.wonderDot} />
          <span className={styles.wonderLabel}>Wonder together</span>
        </div>
        <div className={styles.wonderPrompt}>{wonderPrompt}</div>
        <div className={styles.wonderFooter}>
          Talk about it together — there are no wrong answers.
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        © 2026 Carlo Rosales Montoya. All rights reserved.
      </div>
    </motion.div>
  )
}
