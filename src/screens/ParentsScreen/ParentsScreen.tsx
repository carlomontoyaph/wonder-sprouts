import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { ParentGate } from '../../components/ParentGate/ParentGate'
import { ParentNav, ParentSectionId } from '../../components/ParentNav/ParentNav'
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch'
import { TOPICS } from '../../data/topics'
import { PARENT_TIPS } from '../../data/prompts'
import { formatTime } from '../../utils/format'
import { GAME_CONSTANTS } from '../../constants/game'
import { AI_PROVIDER_META } from '../../services/aiProviders'
import { AiProvider } from '../../types'
import styles from './ParentsScreen.module.css'

const AI_PROVIDERS: AiProvider[] = ['gemini', 'anthropic', 'openai']
const SECTION_IDS: ParentSectionId[] = ['stats', 'learning', 'habits', 'ai', 'books']

export function ParentsScreen() {
  const { state, dispatch } = useGame()
  const [showReset, setShowReset] = useState(false)
  const [showClearBooks, setShowClearBooks] = useState(false)
  const [keyCheck, setKeyCheck] = useState<null | 'ok' | 'bad'>(null)
  const [activeSection, setActiveSection] = useState<ParentSectionId>('stats')
  const sectionRefs = useRef<Record<ParentSectionId, HTMLDivElement | null>>({
    stats: null,
    learning: null,
    habits: null,
    ai: null,
    books: null,
  })
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const suppressObserverRef = useRef(false)
  const suppressTimeoutRef = useRef<number | null>(null)
  const reduceMotion = state.reduceMotion

  const scrollToSection = useCallback(
    (id: ParentSectionId) => {
      const el = sectionRefs.current[id]
      if (!el) return
      setActiveSection(id)
      suppressObserverRef.current = true
      if (suppressTimeoutRef.current) {
        window.clearTimeout(suppressTimeoutRef.current)
      }
      el.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      suppressTimeoutRef.current = window.setTimeout(() => {
        suppressObserverRef.current = false
      }, reduceMotion ? 80 : 800)
    },
    [reduceMotion],
  )

  useEffect(() => {
    if (!state.parentUnlocked) return
    let focus: string | null = null
    try {
      focus = sessionStorage.getItem('parents:focus')
      if (focus) sessionStorage.removeItem('parents:focus')
    } catch {}
    if (focus === 'ai') {
      scrollToSection('ai')
    }
  }, [state.parentUnlocked, scrollToSection])

  useEffect(() => {
    if (!state.parentUnlocked) return
    const root = scrollContainerRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) {
          const id = visible.target.getAttribute('data-section') as ParentSectionId | null
          if (id) setActiveSection(id)
        }
      },
      { root, rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )
    SECTION_IDS.forEach((id) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [state.parentUnlocked])
  const level = Math.floor(state.xp / GAME_CONSTANTS.LEVEL_XP) + 1
  const customCount = state.customTopics?.length || 0

  const factsLearned = state.factsLearned || 0
  const streak = state.streak || 0
  const todayMin = Math.round((state.todaySeconds || 0) / 60)
  const limit = state.dailyLimitMin || 0

  const childName = (state.childName || '').trim() || 'Your child'
  const currentKey = state.aiProvider ? state.aiApiKeys[state.aiProvider] || '' : ''

  return (
    <motion.div
      ref={scrollContainerRef}
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
          <ParentNav active={activeSection} onSelect={scrollToSection} />

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
          <div
            ref={(el) => {
              sectionRefs.current.stats = el
            }}
            data-section="stats"
            className={styles.jumpTarget}
          >
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
          <div
            ref={(el) => {
              sectionRefs.current.learning = el
            }}
            data-section="learning"
            className={styles.jumpTarget}
          >
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
          <div
            ref={(el) => {
              sectionRefs.current.habits = el
            }}
            data-section="habits"
            className={styles.jumpTarget}
          >
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

          {/* AI quiz mode */}
          <div
            ref={(el) => {
              sectionRefs.current.ai = el
            }}
            data-section="ai"
            className={styles.jumpTarget}
          >
            <div className={styles.sectionTitle}>AI quiz mode</div>
            <div className={styles.controlsCard}>
              <div className={styles.controlRow}>
                <div>
                  <div className={styles.controlLabel}>Use AI to make quizzes</div>
                  <div className={styles.controlDesc}>
                    Better questions from photos of any book. Bring your own API
                    key from Anthropic, OpenAI, or Google. Your key stays on this
                    device — nothing goes to Wonder Sprouts. Anyone with access to
                    this device can read it.
                  </div>
                </div>
                <ToggleSwitch
                  enabled={state.aiEnabled}
                  onToggle={() =>
                    dispatch({ type: 'SET_AI_ENABLED', enabled: !state.aiEnabled })
                  }
                  ariaLabel="Toggle AI quiz mode"
                />
              </div>

              {state.aiEnabled && (
                <>
                  <div>
                    <div className={styles.controlLabel} style={{ marginBottom: 8 }}>
                      Provider
                    </div>
                    <div className={styles.pillGroup}>
                      {AI_PROVIDERS.map((p) => {
                        const active = state.aiProvider === p
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              if (window.FTSound) window.FTSound.tap()
                              dispatch({ type: 'SET_AI_PROVIDER', provider: p })
                              setKeyCheck(null)
                            }}
                            className={styles.pillBtn}
                            style={{
                              background: active ? '#4A3A28' : '#FFFFFF',
                              color: active ? '#FFFFFF' : '#8A7C68',
                            }}
                          >
                            {AI_PROVIDER_META[p].label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {state.aiProvider && (
                    <>
                      <div>
                        <div className={styles.controlLabel} style={{ marginBottom: 8 }}>
                          API key
                        </div>
                        <div className={styles.aiKeyRow}>
                          <input
                            type="password"
                            autoComplete="off"
                            spellCheck={false}
                            className={styles.aiKeyInput}
                            placeholder={AI_PROVIDER_META[state.aiProvider].keyPlaceholder}
                            value={currentKey}
                            onChange={(e) => {
                              dispatch({ type: 'SET_AI_API_KEY', key: e.target.value.trim() })
                              setKeyCheck(null)
                            }}
                          />
                          <button
                            className={styles.pillBtn}
                            style={{ background: '#fff', color: '#8A7C68' }}
                            onClick={() => {
                              const meta = AI_PROVIDER_META[state.aiProvider!]
                              setKeyCheck(meta.keyPattern.test(currentKey) ? 'ok' : 'bad')
                            }}
                            disabled={!currentKey}
                          >
                            Check
                          </button>
                          <button
                            className={styles.pillBtn}
                            style={{ background: '#fff', color: '#c8744e', borderColor: '#f0d4cc' }}
                            onClick={() => {
                              dispatch({ type: 'SET_AI_API_KEY', key: '' })
                              setKeyCheck(null)
                            }}
                            disabled={!currentKey}
                          >
                            Clear
                          </button>
                        </div>
                        <div className={styles.aiKeyHint}>
                          {keyCheck === 'ok' && (
                            <span style={{ color: '#4A7A54' }}>
                              Looks good.
                            </span>
                          )}
                          {keyCheck === 'bad' && (
                            <span style={{ color: '#c8744e' }}>
                              That doesn't match this provider's format.
                            </span>
                          )}
                          {keyCheck === null && (
                            <span>{AI_PROVIDER_META[state.aiProvider].keyHint}</span>
                          )}
                        </div>

                        <div className={styles.aiKeyGuide}>
                          <div className={styles.aiKeyGuideTitle}>
                            How to get a key
                          </div>
                          <ol className={styles.aiKeyGuideSteps}>
                            {AI_PROVIDER_META[state.aiProvider].keySteps.map(
                              (step, i) => (
                                <li key={i}>{step}</li>
                              ),
                            )}
                          </ol>
                          <div className={styles.aiKeyGuideCost}>
                            {AI_PROVIDER_META[state.aiProvider].keyCost}
                          </div>
                          <a
                            href={AI_PROVIDER_META[state.aiProvider].keyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.aiKeyGuideLink}
                          >
                            {AI_PROVIDER_META[state.aiProvider].keyUrlLabel} ↗
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Book quizzes */}
          <div
            ref={(el) => {
              sectionRefs.current.books = el
            }}
            data-section="books"
            className={styles.jumpTarget}
          >
            <div className={styles.sectionTitle}>Book quizzes</div>
            <div className={styles.controlsCard}>
              <div className={styles.controlRow}>
                <div>
                  <div className={styles.controlLabel}>Create a book quiz</div>
                  <div className={styles.controlDesc}>
                    Snap pages from a favorite book and turn them into 5
                    questions. Saved on this device only.{' '}
                    {customCount > 0 ? `${customCount} saved` : 'None saved yet'}.
                  </div>
                </div>
                <button
                  className={styles.pillBtn}
                  style={{ background: '#8A6FBF', color: '#fff', borderColor: '#8A6FBF' }}
                  onClick={() => {
                    if (window.FTSound) window.FTSound.tap()
                    dispatch({ type: 'GO_QUIZMAKER' })
                  }}
                >
                  New
                </button>
              </div>
              {customCount > 0 && (
                <div className={styles.controlRow}>
                  <div>
                    <div className={styles.controlLabel}>Clear book quizzes</div>
                    <div className={styles.controlDesc}>
                      Remove every custom quiz. This doesn't affect built-in topics.
                    </div>
                  </div>
                  <button
                    className={styles.pillBtn}
                    style={{ background: '#fff', color: '#c8744e', borderColor: '#f0d4cc' }}
                    onClick={() => setShowClearBooks(true)}
                  >
                    Clear
                  </button>
                </div>
              )}
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

      {/* Clear book quizzes confirmation modal */}
      <AnimatePresence>
        {showClearBooks && (
          <motion.div
            className={styles.modalScrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowClearBooks(false)}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalIcon}>📚</div>
              <div className={styles.modalTitle}>Remove all book quizzes?</div>
              <div className={styles.modalBody}>
                This deletes every quiz you made from book photos. Built-in
                topics stay.
              </div>
              <div className={styles.modalButtons}>
                <button
                  className={styles.modalCancel}
                  onClick={() => setShowClearBooks(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalConfirm}
                  onClick={() => {
                    dispatch({ type: 'CLEAR_CUSTOM_TOPICS' })
                    setShowClearBooks(false)
                  }}
                >
                  Yes, remove them
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
