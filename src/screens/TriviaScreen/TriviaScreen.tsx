import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { QuestionCard } from '../../components/QuestionCard/QuestionCard'
import { AnswerButton } from '../../components/AnswerButton/AnswerButton'
import { FeedbackBlock } from '../../components/FeedbackBlock/FeedbackBlock'
import { MuteButton } from '../../components/MuteButton/MuteButton'
import { Mascot } from '../../components/Mascot/Mascot'
import { ConfettiBurst, getConfettiColors } from '../../services/confetti'
import { getTopicByKey, getActiveQuestions } from '../../data/topics'
import styles from './TriviaScreen.module.css'

export function TriviaScreen() {
  const { state, dispatch } = useGame()
  const topic = getTopicByKey(state.topicKey!)
  const total = getActiveQuestions(topic, state.sessionLen).length

  // Timer state
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastSyncRef = useRef(0)

  // Live timer: runs while trivia is active and not paused
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSessionElapsed((prev) => {
        const next = prev + 1
        // Sync to global state every 5 seconds
        if (next - lastSyncRef.current >= 5) {
          lastSyncRef.current = next
          dispatch({ type: 'ACCUMULATE_TIME', seconds: 5 })
        }
        return next
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, dispatch])

  // Sync remaining seconds on unmount
  useEffect(() => {
    return () => {
      const unsynced = sessionElapsed - lastSyncRef.current
      if (unsynced > 0) {
        dispatch({ type: 'ACCUMULATE_TIME', seconds: unsynced })
      }
    }
  }, [sessionElapsed, dispatch])

  const dailyLimit = state.dailyLimitMin || 0
  const totalTodaySec = state.todaySeconds + sessionElapsed
  const limitSec = dailyLimit * 60
  const reachedLimit = dailyLimit > 0 && totalTodaySec >= limitSec
  const remainingMin = dailyLimit > 0 ? Math.max(0, Math.ceil((limitSec - totalTodaySec) / 60)) : 0
  const isNearLimit = dailyLimit > 0 && remainingMin <= 5 && remainingMin > 0

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }
  const q = topic.questions[state.qIndex]
  const order =
    state.shuffles && state.shuffles[state.qIndex]
      ? state.shuffles[state.qIndex]
      : [0, 1, 2, 3]
  const selected = state.sessionAnswers ? state.sessionAnswers[state.qIndex] : null
  const answered = selected != null
  const isCorrect = answered && selected === q.correct
  const isLast = state.qIndex >= total - 1
  const letters = ['A', 'B', 'C', 'D']

  // Clear pulseCoins after 1s
  useEffect(() => {
    if (state.pulseCoins) {
      const timer = setTimeout(() => {
        dispatch({ type: 'PULSE_COINS_DONE' })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.pulseCoins, dispatch])

  const handleBack = useCallback(() => {
    if (window.FTSound) window.FTSound.tap()
    if (state.qIndex > 0) {
      dispatch({ type: 'GO_BACK' })
    } else {
      dispatch({ type: 'GO_TOPICS' })
    }
  }, [state.qIndex, dispatch])

  const handleAnswer = useCallback(
    (origIndex: number) => {
      if (answered) return
      const correct = origIndex === q.correct
      if (window.FTSound) {
        correct ? window.FTSound.correct() : window.FTSound.wrong()
      }
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: origIndex })
    },
    [answered, q, dispatch],
  )

  const handleNext = useCallback(() => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'NEXT_QUESTION' })
  }, [dispatch])

  const handleMute = useCallback(() => {
    const next = !state.muted
    if (window.FTSound) window.FTSound.setMuted(next)
    dispatch({ type: 'TOGGLE_MUTE' })
  }, [state.muted, dispatch])

  const progressPct = Math.round(
    ((state.qIndex + (answered ? 1 : 0)) / total) * 100,
  )

  return (
    <div
      className={styles.screen}
      style={{
        background: `radial-gradient(120% 70% at 50% -8%, ${topic.soft} 0%, #FBF7F0 60%)`,
      }}
    >
      {/* Background decor */}
      <div
        className={styles.bgCircle}
        style={{
          top: -60,
          right: -50,
          width: 180,
          height: 180,
          background: topic.soft,
        }}
      />
      <div
        className={styles.bgCircle}
        style={{
          bottom: 40,
          left: -40,
          width: 120,
          height: 120,
          background: topic.soft,
          opacity: 0.45,
        }}
      />

      {/* Confetti */}
      {isCorrect && !state.reduceMotion && (
        <div className={styles.confettiLayer}>
          <ConfettiBurst
            colors={getConfettiColors(topic.key)}
            originX={0.5}
            originY={0.3}
          />
        </div>
      )}

      {/* Flying coins (correct answer celebration) */}
      <AnimatePresence>
        {state.pulseCoins && !state.reduceMotion && (
          <div className={styles.coinFlyLayer}>
            {[
              { sx: -90, sy: 240, d: 0 },
              { sx: -140, sy: 210, d: 0.06 },
              { sx: -60, sy: 270, d: 0.12 },
              { sx: -170, sy: 180, d: 0.18 },
              { sx: -110, sy: 300, d: 0.24 },
            ].map((c, i) => (
              <motion.span
                key={i}
                initial={{ x: c.sx, y: c.sy, scale: 0.5, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  delay: c.d,
                  ease: [0.4, 0.7, 0.5, 1],
                }}
                style={{
                  position: 'absolute',
                  top: 26,
                  right: 26,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#E0A63E',
                  boxShadow:
                    'inset 0 0 0 2.5px #F3C969, 0 2px 4px rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className={styles.topBar}>
        <button
          onClick={handleBack}
          aria-label={state.qIndex > 0 ? 'Previous question' : 'Choose a topic'}
          title={state.qIndex > 0 ? 'Previous question' : 'Choose a topic'}
          className={styles.backBtn}
        >
          ‹
        </button>
        <div className={styles.progressArea}>
          <div className={styles.progressHeader}>
            <span className={styles.topicName} style={{ color: topic.color }}>
              {topic.name}
            </span>
            <span className={styles.qCounter}>
              Question {state.qIndex + 1} of {total}
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%`, background: topic.color }}
            />
          </div>
        </div>
        <MuteButton muted={state.muted} onToggle={handleMute} />

        {/* Timer badge */}
        <div
          className={styles.timerBadge}
          style={{
            color: reachedLimit ? '#C8744E' : isNearLimit ? '#B8862E' : '#9A8E7C',
          }}
          title={dailyLimit > 0 ? `${Math.floor(totalTodaySec / 60)} min of ${dailyLimit} min used` : undefined}
        >
          {dailyLimit > 0
            ? reachedLimit
              ? 'Time’s up!'
              : `${Math.floor(totalTodaySec / 60)}/${dailyLimit}m`
            : formatTime(sessionElapsed)}
        </div>

        {/* Pause button */}
        <button
          onClick={() => {
            if (window.FTSound) window.FTSound.tap()
            setPaused((p) => !p)
          }}
          aria-label={paused ? 'Resume' : 'Pause'}
          className={styles.pauseBtn}
        >
          {paused ? '▶' : '⏸'}
        </button>

        <button
          onClick={() => {
            if (window.FTSound) window.FTSound.tap()
            dispatch({ type: 'GO_TOPICS' })
          }}
          aria-label="Choose a topic"
          title="Choose a topic"
          className={styles.topicsBtn}
        >
          <span className={styles.topicsGrid}>
            <span /><span /><span /><span />
          </span>
          <span className={styles.topicsLabel}>Topics</span>
        </button>
      </div>

      {/* Limit-reached banner */}
      <AnimatePresence>
        {reachedLimit && (
          <motion.div
            className={styles.limitBanner}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You've reached today's play limit — great session!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <div className={styles.questionArea}>
        <QuestionCard
          qNumber={state.qIndex + 1}
          questionText={q.q}
          topicIcon={topic.iconSvg}
          topicColor={topic.color}
          topicSoft={topic.soft}
        />
      </div>

      {/* Answers */}
      <div className={styles.answers}>
        {order.map((orig, d) => {
          const text = q.a[orig]
          let btnState: 'default' | 'correct' | 'wrong' | 'dimmed' = 'default'
          if (answered) {
            if (orig === q.correct) {
              btnState = 'correct'
            } else if (orig === selected) {
              btnState = 'wrong'
            } else {
              btnState = 'dimmed'
            }
          }
          return (
            <AnswerButton
              key={d}
              letter={letters[d]}
              text={text}
              state={btnState}
              onSelect={() => handleAnswer(orig)}
              disabled={answered}
            />
          )
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <FeedbackBlock
          wasCorrect={isCorrect}
          mascotVariant={state.avatarVariant}
          factText={q.fact}
          talkPrompt={`Talk together: ${q.talk}`}
          showReveal={isCorrect && !!q.art}
          revealArt={q.art}
          revealName={q.a[q.correct]}
          revealDesc={q.artDesc}
          topicKey={state.topicKey || undefined}
        />
      )}

      {/* Next / Summary button */}
      {answered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.nextBtn}
          onClick={handleNext}
          whileTap={{ y: 4 }}
        >
          {isLast ? 'See summary' : 'Next question'}
        </motion.button>
      )}

      {/* Pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className={styles.pauseOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaused(false)}
          >
            <motion.div
              className={styles.pauseCard}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.pauseMascot}>
                <Mascot variant="sprout" mood="happy" size={100} />
              </div>
              <div className={styles.pauseTitle}>Take a break!</div>
              <div className={styles.pauseBody}>
                We'll be right here when you come back.
              </div>
              <button
                className={styles.pauseContinue}
                onClick={() => setPaused(false)}
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
