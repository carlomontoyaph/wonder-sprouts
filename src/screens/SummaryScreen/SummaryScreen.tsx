import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Mascot } from '../../components/Mascot/Mascot'
import { ProgressRing } from '../../components/ProgressRing/ProgressRing'
import { GAME_CONSTANTS } from '../../constants/game'
import { getTopicByKey } from '../../data/topics'
import styles from './SummaryScreen.module.css'

export function SummaryScreen() {
  const { state, dispatch } = useGame()
  const total = GAME_CONSTANTS.QUESTIONS_PER_TOPIC
  const isPerfect = state.correctCount === total

  const handlePlayAgain = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'PLAY_AGAIN' })
  }

  const handleTryAnother = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'GO_TOPICS' })
  }

  const handleGoHome = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'GO_HOME' })
  }

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={styles.screen}
    >
      {/* Perfect score: 3 mascots */}
      {isPerfect && (
        <div className={styles.perfectMascots}>
          <div className={styles.sideMascot}>
            <Mascot variant="berry" mood="cheer" size={92} />
          </div>
          <div className={styles.mainMascot}>
            <Mascot variant="sprout" mood="cheer" size={140} />
          </div>
          <div className={styles.sideMascot}>
            <Mascot variant="pebble" mood="cheer" size={92} />
          </div>
        </div>
      )}

      {/* Non-perfect: single mascot */}
      {!isPerfect && (
        <div className={styles.singleMascot}>
          <Mascot variant="sprout" mood="cheer" size={140} />
        </div>
      )}

      {/* Perfect score banner */}
      {isPerfect && (
        <motion.div
          className={styles.perfectBanner}
          animate={{ scale: [1, 1.045, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            className={styles.perfectStar}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <span className={styles.perfectText}>Perfect score</span>
          <motion.span
            className={styles.perfectStar}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Title */}
      <div>
        <div className={styles.title}>
          {isPerfect
            ? 'Amazing!'
            : state.correctCount >= 3
              ? 'Great job!'
              : 'Well tried!'}
        </div>
        <div className={styles.subtitle}>
          {isPerfect
            ? 'You answered every question right!'
            : `You got ${state.correctCount} out of ${total} correct.`}
        </div>
      </div>

      {/* Progress ring */}
      <ProgressRing correctCount={state.correctCount} total={total} />

      {/* Reward pills */}
      <div className={styles.rewards}>
        <div className={styles.rewardPill}>
          <div className={styles.rewardValue} style={{ color: '#B8862E' }}>
            +{state.sessionXp}
          </div>
          <div className={styles.rewardLabel}>XP earned</div>
        </div>
        <div className={styles.rewardPill}>
          <div className={styles.rewardValue} style={{ color: '#E0A63E' }}>
            +{state.sessionCoins}
          </div>
          <div className={styles.rewardLabel}>coins</div>
        </div>
        <div className={styles.rewardPill}>
          <div className={styles.rewardValue} style={{ color: '#7BAE7F' }}>
            {total}
          </div>
          <div className={styles.rewardLabel}>facts learned</div>
        </div>
      </div>

      {/* Conversation prompt */}
      <div className={styles.conversationCard}>
        <div className={styles.conversationLabel}>Keep the wonder going</div>
        <div className={styles.conversationPrompt}>
          {getConversationPrompt(state.topicKey || '')}
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button
          onClick={handlePlayAgain}
          className={styles.playAgainBtn}
        >
          Play again
        </button>
        {isPerfect && (
          <button
            onClick={handleTryAnother}
            className={styles.tryAnotherBtn}
          >
            Try another topic
          </button>
        )}
        <button
          onClick={handleGoHome}
          className={styles.backHomeBtn}
        >
          Back home
        </button>
      </div>
    </motion.div>
  )
}

function getConversationPrompt(topicKey: string): string {
  const topic = getTopicByKey(topicKey)
  return topic?.summaryPrompt || 'What do you want to learn about next?'
}
