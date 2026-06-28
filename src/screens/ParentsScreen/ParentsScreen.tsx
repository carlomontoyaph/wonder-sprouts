import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { ParentGate } from '../../components/ParentGate/ParentGate'
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch'
import { TOPICS } from '../../data/topics'
import { PARENT_TIPS } from '../../data/prompts'
import { formatTime } from '../../utils/format'
import { GAME_CONSTANTS } from '../../constants/game'
import styles from './ParentsScreen.module.css'

export function ParentsScreen() {
  const { state, dispatch } = useGame()
  const [showReset, setShowReset] = useState(false)
  const level = Math.floor(state.xp / GAME_CONSTANTS.LEVEL_XP) + 1

  const factsLearned = state.factsLearned || 0
  const streak = state.streak || 0
  const todayMin = Math.round((state.todaySeconds || 0) / 60)
  const limit = state.dailyLimitMin || 0

  const childName = (state.childName || '').trim() || 'Your child'

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
    >
      {/* LOCKED GATE */}
      {!state.parentUnlocked && (
        <ParentGate
          gateA={state.gateA}
          gateB={state.gateB}
          gateChoices={state.gateChoices}
          gateError={state.gateError}
          onAnswer={(value) => {
            dispatch({ type: 'PARENT_GATE_ANSWER', value })
          }}
        />
      )}

      {/* UNLOCKED DASHBOARD */}
      {state.parentUnlocked && (
        <>
          <div className={styles.dashboardHeader}>
            <div>
              <div className={styles.dashboardTitle}>Parent dashboard</div>
              <div className={styles.dashboardSub}>
                {childName} · Level {level}
              </div>
            </div>
            <span className={styles.unlockedBadge}>Unlocked</span>
          </div>

          {/* At a glance */}
          <div>
            <div className={styles.sectionTitle}>At a glance</div>
            <div className={styles.statGrid}>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{state.sessions || 0}</div>
                <div className={styles.statDesc}>quizzes played</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{factsLearned}</div>
                <div className={styles.statDesc}>facts learned</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{streak}</div>
                <div className={styles.statDesc}>day streak</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>
                  {formatTime(state.playSeconds)}
                </div>
                <div className={styles.statDesc}>total play time</div>
              </div>
            </div>
          </div>

          {/* Learning */}
          <div>
            <div className={styles.sectionTitle}>Learning</div>
            <div className={styles.controlsCard}>
              {/* Session length */}
              <div className={styles.controlRow}>
                <div>
                  <div className={styles.controlLabel}>
                    Questions per quiz
                  </div>
                  <div className={styles.controlDesc}>
                    How long each session runs
                  </div>
                </div>
                <div className={styles.pillGroup}>
                  {GAME_CONSTANTS.SESSION_LEN_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        if (window.FTSound) window.FTSound.tap()
                        dispatch({ type: 'SET_SESSION_LEN', len: n })
                      }}
                      className={styles.pillBtn}
                      style={{
                        background:
                          (state.sessionLen || 5) === n
                            ? '#4A3A28'
                            : '#FFFFFF',
                        color:
                          (state.sessionLen || 5) === n
                            ? '#FFFFFF'
                            : '#8A7C68',
                      }}
                    >
                      {n === 5 ? 'Full (5)' : `Short (${n})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic visibility */}
              <div>
                <div className={styles.topicHeader}>
                  <span className={styles.controlLabel}>
                    Available topics
                  </span>
                  <span className={styles.topicCount}>
                    {TOPICS.filter((t) => !state.hiddenTopics[t.key]).length}{' '}
                    on
                  </span>
                </div>
                <div className={styles.topicList}>
                  {TOPICS.map((tp) => {
                    const visible = !state.hiddenTopics[tp.key]
                    return (
                      <div key={tp.key} className={styles.topicRow}>
                        <span
                          className={styles.topicIcon}
                          style={{ background: tp.soft }}
                          dangerouslySetInnerHTML={{
                            __html: tp.iconSvg,
                          }}
                        />
                        <span className={styles.topicName}>{tp.name}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'TOGGLE_HIDDEN_TOPIC',
                              topicKey: tp.key,
                            })
                          }
                          aria-label={`Toggle ${tp.name}`}
                          className={styles.toggleTrack}
                          style={{
                            background: visible ? tp.color : '#E4D8C2',
                          }}
                        >
                          <span
                            className={styles.toggleKnob}
                            style={{
                              left: visible ? 20 : 2,
                            }}
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Healthy habits */}
          <div>
            <div className={styles.sectionTitle}>Healthy habits</div>
            <div className={styles.controlsCard}>
              {/* Daily limit */}
              <div>
                <div className={styles.controlRow}>
                  <div className={styles.controlLabel}>
                    Daily play limit
                  </div>
                  <span className={styles.controlDesc}>
                    {limit > 0
                      ? `${todayMin} / ${limit} min today`
                      : `${todayMin} min today`}
                  </span>
                </div>
                <div className={styles.limitGroup}>
                  {GAME_CONSTANTS.DAILY_LIMIT_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        if (window.FTSound) window.FTSound.tap()
                        dispatch({ type: 'SET_DAILY_LIMIT', min: m })
                      }}
                      className={styles.limitBtn}
                      style={{
                        background:
                          (state.dailyLimitMin || 0) === m
                            ? '#4A3A28'
                            : '#FFFFFF',
                        color:
                          (state.dailyLimitMin || 0) === m
                            ? '#FFFFFF'
                            : '#8A7C68',
                      }}
                    >
                      {m === 0 ? 'Off' : `${m} min`}
                    </button>
                  ))}
                </div>
                {limit > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#9A8E7C',
                    }}>
                      <span>{todayMin} min used</span>
                      <span>{Math.max(0, limit - todayMin)} min remaining</span>
                    </div>
                    <div style={{
                      height: 8,
                      background: '#F1EADC',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, (todayMin / limit) * 100)}%`,
                        background: todayMin >= limit
                          ? '#E8946A'
                          : todayMin >= limit * 0.8
                            ? '#EBB347'
                            : '#7BAE7F',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Sound */}
              <div className={styles.controlRow}>
                <div>
                  <div className={styles.controlLabel}>
                    Sound & music
                  </div>
                  <div className={styles.controlDesc}>
                    Cheers and effects
                  </div>
                </div>
                <ToggleSwitch
                  enabled={!state.muted}
                  onToggle={() => {
                    if (window.FTSound) window.FTSound.setMuted(!state.muted)
                    dispatch({ type: 'TOGGLE_MUTE' })
                  }}
                  ariaLabel="Toggle sound"
                />
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className={styles.tipCard}>
            <div className={styles.tipHeader}>
              <span className={styles.tipLabel}>Tip for grown-ups</span>
              <button
                onClick={() => dispatch({ type: 'CYCLE_TIP' })}
                className={styles.tipBtn}
              >
                Next tip
              </button>
            </div>
            <div className={styles.tipText}>
              {PARENT_TIPS[state.tipIndex % PARENT_TIPS.length]}
            </div>
          </div>

          {/* Feedback */}
          <div
            className={styles.tipCard}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (window.FTSound) window.FTSound.tap()
              dispatch({ type: 'GO_LANDING' })
            }}
          >
            <div className={styles.tipHeader}>
              <span className={styles.tipLabel}>We'd love your feedback</span>
              <button
                className={styles.tipBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.FTSound) window.FTSound.tap()
                  dispatch({ type: 'GO_LANDING' })
                }}
              >
                Share thoughts
              </button>
            </div>
            <div className={styles.tipText}>
              Help us make Wonder Sprouts better. Tap to share your experience —
              it only takes a minute and we never ask for personal details.
            </div>
          </div>

          {/* Reset */}
          <div className={styles.footerRow}>
            <span className={styles.versionText}>
              Wonder Sprouts v0.1 · Data stays on this device
            </span>
            <button
              onClick={() => setShowReset(true)}
              className={styles.resetBtn}
            >
              Reset progress
            </button>
          </div>
        </>
      )}

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            className={styles.modalScrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowReset(false)}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalIcon}>🌱</div>
              <div className={styles.modalTitle}>
                Do you really want to reset progress?
              </div>
              <div className={styles.modalBody}>
                This will erase all XP, coins, badges, and progress. This cannot
                be undone.
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.modalCancel}
                  onClick={() => setShowReset(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalConfirm}
                  onClick={() => {
                    dispatch({ type: 'RESET_PROGRESS' })
                    setShowReset(false)
                  }}
                >
                  Yes, reset it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
