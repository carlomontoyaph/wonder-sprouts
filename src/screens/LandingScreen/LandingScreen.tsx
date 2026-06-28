import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Mascot } from '../../components/Mascot/Mascot'
import { FeedbackData } from '../../types'
import { saveFeedback, loadFeedback } from '../../services/storage'
import styles from './LandingScreen.module.css'

const ENJOY_OPTIONS = [
  { key: 'fun_facts', label: 'The fun facts' },
  { key: 'mascot', label: 'The mascot' },
  { key: 'topics', label: 'Choosing topics' },
  { key: 'badges', label: 'Earning badges' },
  { key: 'together', label: 'Playing together' },
]

export function LandingScreen() {
  const { state, dispatch } = useGame()
  const existingFeedback = loadFeedback()

  // Form state
  const [bonding, setBonding] = useState(existingFeedback?.bonding || '')
  const [enjoy, setEnjoy] = useState<string[]>(existingFeedback?.enjoy || [])
  const [otherText, setOtherText] = useState('')
  const [improvement, setImprovement] = useState(existingFeedback?.improvement || '')
  const [recommend, setRecommend] = useState(existingFeedback?.recommend || '')
  const [submitted, setSubmitted] = useState(!!existingFeedback)

  const handleEnterApp = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'ENTER_APP' })
  }

  const handleEnjoyToggle = (key: string) => {
    if (key === 'other') {
      // don't toggle 'other' — it's handled by the text field
      return
    }
    setEnjoy((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const handleOtherChange = (val: string) => {
    setOtherText(val)
    if (val.trim()) {
      setEnjoy((prev) => {
        const filtered = prev.filter((k) => !k.startsWith('other:'))
        return [...filtered, `other:${val.trim()}`]
      })
    } else {
      setEnjoy((prev) => prev.filter((k) => !k.startsWith('other:')))
    }
  }

  const handleSubmit = () => {
    const data: FeedbackData = {
      bonding: bonding || 'not_specified',
      enjoy: enjoy.length > 0 ? enjoy : ['not_specified'],
      improvement,
      recommend: recommend || 'not_specified',
      submittedAt: new Date().toISOString(),
    }
    saveFeedback(data)
    dispatch({ type: 'SUBMIT_FEEDBACK' })
    setSubmitted(true)
  }

  const canSubmit = bonding && recommend

  return (
    <div className={styles.outer}>
      <div className={styles.screen}>
        {/* ===== Hero ===== */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={styles.hero}
        >
          <div className={styles.logoRow}>
            <div className={styles.mascotSmall}>
              <Mascot variant="sprout" mood="happy" size={48} />
            </div>
            <div>
              <div className={styles.brandName}>Wonder Sprouts</div>
              <div className={styles.tagline}>Learn together. Grow together.</div>
            </div>
            <div className={styles.mascotSmall}>
              <Mascot variant="berry" mood="happy" size={48} />
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardBg} />
            <div className={styles.heroCopy}>
              A trivia game for ages <strong>5–8</strong> — made for you and
              your child to play side by side. No timers, no scores to beat, no
              wrong answers that punish. Just <strong>curiosity</strong>,{' '}
              <strong>conversation</strong>, and <strong>time together</strong>.
            </div>
            <div className={styles.heroMascot}>
              <Mascot variant="sprout" mood="cheer" size={120} />
            </div>
            {state.hasSeenLanding ? (
              <motion.button
                className={styles.ctaButton}
                onClick={() => {
                  if (window.FTSound) window.FTSound.tap()
                  dispatch({ type: 'GO_HOME' })
                }}
                whileTap={{ y: 4 }}
              >
                ← Back to game
              </motion.button>
            ) : (
              <motion.button
                className={styles.ctaButton}
                onClick={handleEnterApp}
                whileTap={{ y: 4 }}
              >
                🌱 Start playing
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* ===== Feature highlights ===== */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📚</div>
            <div className={styles.featureTitle}>16 fun topics</div>
            <div className={styles.featureDesc}>
              Animals, space, dinosaurs, and more
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <div className={styles.featureTitle}>5-minute sessions</div>
            <div className={styles.featureDesc}>
              Short enough for any evening
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💛</div>
            <div className={styles.featureTitle}>No pressure</div>
            <div className={styles.featureDesc}>
              Wrong answers? Just a gentle "good try"
            </div>
          </div>
        </div>

        {/* ===== Social proof ===== */}
        <div className={styles.testimonial}>
          <div className={styles.testimonialText}>
            "My daughter asks to play every night. We've learned so much
            together."
          </div>
          <div className={styles.testimonialAuthor}>
            — Parent of a 6-year-old
          </div>
        </div>

        {/* ===== Feedback form ===== */}
        <div className={styles.feedbackSection}>
          <div className={styles.sectionHeading}>Your voice matters</div>
          <div className={styles.sectionSub}>
            Help us make Wonder Sprouts better. These 4 quick questions are
            anonymous — we never ask for your name or email.
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={styles.thankYouCard}
            >
              <div className={styles.thankYouIcon}>💚</div>
              <div className={styles.thankYouTitle}>Thank you!</div>
              <div className={styles.thankYouDesc}>
                We read every response. Your feedback helps us make Wonder
                Sprouts better for families like yours.
              </div>
              <div className={styles.privacyNote}>
                🔒 Since there's no account system, your feedback stays on this
                device. If you'd like to share it with us, you can email us the
                details.
              </div>
            </motion.div>
          ) : (
            <div className={styles.formCard}>
              {/* Q1: Bonding */}
              <div className={styles.formField}>
                <div className={styles.formLabel}>
                  Has Wonder Sprouts helped your family bond?
                </div>
                <div className={styles.radioGroup}>
                  {[
                    { value: 'yes_lot', label: 'Yes, a lot' },
                    { value: 'somewhat', label: 'Somewhat' },
                    { value: 'not_really', label: 'Not really' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBonding(opt.value)}
                      className={`${styles.radioBtn} ${bonding === opt.value ? styles.radioActive : ''}`}
                    >
                      <span className={styles.radioCircle}>
                        {bonding === opt.value && (
                          <span className={styles.radioFill} />
                        )}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Enjoy */}
              <div className={styles.formField}>
                <div className={styles.formLabel}>
                  What does your child enjoy most? (pick all that apply)
                </div>
                <div className={styles.checkboxGroup}>
                  {ENJOY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleEnjoyToggle(opt.key)}
                      className={`${styles.checkBtn} ${enjoy.includes(opt.key) ? styles.checkActive : ''}`}
                    >
                      <span className={styles.checkBox}>
                        {enjoy.includes(opt.key) && (
                          <span className={styles.checkFill}>✓</span>
                        )}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                  <div className={styles.otherRow}>
                    <span
                      className={`${styles.checkBtn} ${styles.checkDisabled}`}
                    >
                      <span className={styles.checkBox}>
                        <span className={styles.checkFill}>✓</span>
                      </span>
                      Other:
                    </span>
                    <input
                      className={styles.otherInput}
                      value={otherText}
                      onChange={(e) => handleOtherChange(e.target.value)}
                      placeholder="Tell us more..."
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              {/* Q3: Improvement */}
              <div className={styles.formField}>
                <div className={styles.formLabel}>
                  What's one thing we could improve?
                </div>
                <textarea
                  className={styles.textArea}
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Q4: Recommend */}
              <div className={styles.formField}>
                <div className={styles.formLabel}>
                  Would you recommend us to other families?
                </div>
                <div className={styles.radioGroup}>
                  {[
                    { value: 'definitely', label: 'Definitely' },
                    { value: 'maybe', label: 'Maybe' },
                    { value: 'not_sure', label: 'Not sure yet' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRecommend(opt.value)}
                      className={`${styles.radioBtn} ${recommend === opt.value ? styles.radioActive : ''}`}
                    >
                      <span className={styles.radioCircle}>
                        {recommend === opt.value && (
                          <span className={styles.radioFill} />
                        )}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`${styles.submitBtn} ${!canSubmit ? styles.submitDisabled : ''}`}
              >
                ✉️ Send feedback
              </button>

              <div className={styles.privacyNote}>
                🔒 We don't collect personal information. This is one-way
                communication — we read every response but won't reply
                individually.
              </div>
            </div>
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className={styles.footer}>
          © 2026 Carlo Rosales Montoya. All rights reserved.
        </div>
      </div>
    </div>
  )
}
