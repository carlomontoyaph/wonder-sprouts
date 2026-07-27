import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { AiProvider, Topic, TopicQuestion } from '../../types'
import { AI_PROVIDER_META } from '../../services/aiProviders'
import styles from './QuizMakerScreen.module.css'

type Stage = 'intro' | 'processing' | 'review' | 'saved'

const OCR_MODEL_SIZE = 'about 15MB'
const STALL_HINT_MS = 20000
const AI_PROVIDERS: AiProvider[] = ['gemini', 'anthropic', 'openai']

const BOOK_PALETTE: { color: string; soft: string }[] = [
  { color: '#8A6FBF', soft: '#EDE4F5' },
  { color: '#E8946A', soft: '#FBEADF' },
  { color: '#4FB0A3', soft: '#DFF0EE' },
  { color: '#D07AA8', soft: '#F6E4EE' },
  { color: '#C9A24B', soft: '#F3E4B7' },
  { color: '#6A9CD6', soft: '#E4EFF9' },
]

function bookIconSvg(color: string): string {
  return (
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    `<path fill="${color}" d="M4 4.5A1.5 1.5 0 0 1 5.5 3H18a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.75.43L18 18.2l-1.25.72a.5.5 0 0 1-.5 0L15 18.2l-1.25.72a.5.5 0 0 1-.5 0L12 18.2l-1.25.72a.5.5 0 0 1-.5 0L9 18.2l-1.25.72a.5.5 0 0 1-.5 0L6 18.2l-1.25.73A.5.5 0 0 1 4 18.5z"/>` +
    '<rect x="7" y="7" width="9" height="1.4" rx="0.7" fill="#FBF7F0"/>' +
    '<rect x="7" y="10" width="7" height="1.4" rx="0.7" fill="#FBF7F0"/>' +
    '<rect x="7" y="13" width="8" height="1.4" rx="0.7" fill="#FBF7F0"/>' +
    '</svg>'
  )
}

function hashKey(k: string): number {
  let h = 0
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0
  return h
}

function slug(name: string): string {
  return (name || 'book')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'book'
}

function buildCustomTopic(name: string, questions: TopicQuestion[]): Topic {
  const trimmed = name.trim().replace(/[\x00-\x1f]/g, '').slice(0, 30)
  const key = `book:${slug(trimmed)}:${Date.now().toString(36)}`
  const swatch = BOOK_PALETTE[hashKey(key) % BOOK_PALETTE.length]
  return {
    key,
    name: trimmed,
    color: swatch.color,
    soft: swatch.soft,
    cat: 'books',
    blurb: 'From your book',
    iconSvg: bookIconSvg(swatch.color),
    questions,
    summaryPrompt: `What was your favorite part of ${trimmed}?`,
    custom: true,
    createdAt: Date.now(),
  }
}

export function QuizMakerScreen() {
  const { state, dispatch } = useGame()
  const [stage, setStage] = useState<Stage>('intro')
  const [files, setFiles] = useState<File[]>([])
  const [name, setName] = useState('')
  const [progress, setProgress] = useState(0)
  const [questions, setQuestions] = useState<TopicQuestion[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [firstRun, setFirstRun] = useState(true)
  const [aiFailed, setAiFailed] = useState(false)
  const [saveAttempted, setSaveAttempted] = useState(false)
  const [stalled, setStalled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const nameValid = name.trim().length > 0

  useEffect(() => {
    if (stage !== 'processing') {
      setStalled(false)
      return
    }
    if (progress > 0) {
      setStalled(false)
      return
    }
    const t = window.setTimeout(() => setStalled(true), STALL_HINT_MS)
    return () => window.clearTimeout(t)
  }, [stage, progress])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const currentKey = state.aiProvider ? state.aiApiKeys[state.aiProvider] || '' : ''

  const aiModeOn = state.aiEnabled && !!state.aiProvider

  const providerKeyValid =
    !!state.aiProvider &&
    AI_PROVIDER_META[state.aiProvider].keyPattern.test(currentKey)

  const aiConfigured = aiModeOn && providerKeyValid

  const thumbUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files],
  )

  const handleBack = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'GO_PARENTS' })
  }

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list || list.length === 0) return
    const picked = Array.from(list).slice(0, 4 - files.length)
    setFiles((prev) => [...prev, ...picked].slice(0, 4))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const runHeuristic = async (signal: AbortSignal) => {
    const { runOcr } = await import('../../services/ocr')
    const text = await runOcr(files, (p) => setProgress(p), signal)
    if (signal.aborted) return
    const { generateQuiz } = await import('../../services/quizGen')
    const result = generateQuiz(text, state.bookQuizLen)
    if (!result.ok) {
      setErr(
        result.reason === 'EMPTY'
          ? "I couldn't read the text on those pages. Try clearer, well-lit photos."
          : `I didn't find enough words to make ${state.bookQuizLen} questions. Try adding another page.`,
      )
      setStage('intro')
      setFirstRun(false)
      return
    }
    setQuestions(result.questions)
    setStage('review')
    setFirstRun(false)
  }

  const runAi = async () => {
    const { aiGenerateQuiz } = await import('../../services/aiQuizGen')
    const result = await aiGenerateQuiz({
      files,
      provider: state.aiProvider!,
      apiKey: currentKey,
      model: state.aiModel,
      count: state.bookQuizLen,
      onProgress: (p) => setProgress(p),
    })
    if (!result.ok) {
      const base =
        result.reason === 'AUTH'
          ? "That API key was rejected. Double-check it in the Parents screen."
          : result.reason === 'RATE_LIMIT'
            ? "The AI provider is rate-limiting requests. Try again in a minute, or check your free-tier quota / billing."
            : result.reason === 'CORS'
              ? "The browser blocked the AI request. You can try without AI instead."
              : result.reason === 'NETWORK'
                ? "Couldn't reach the AI provider. Check your connection and try again."
                : result.reason === 'BAD_JSON'
                  ? "The AI returned an unexpected response. Try again."
                  : result.reason === 'INSUFFICIENT'
                    ? `The AI couldn't make ${state.bookQuizLen} questions from those pages. Try clearer photos or add another page.`
                    : "Something went wrong with the AI request. Try again."
      const msg = result.detail ? `${base} (${result.detail})` : base
      setErr(msg)
      setAiFailed(true)
      setStage('intro')
      setFirstRun(false)
      return
    }
    setQuestions(result.questions)
    setStage('review')
    setFirstRun(false)
  }

  const handleGenerate = async () => {
    if (files.length === 0) return
    setErr(null)
    setAiFailed(false)
    setProgress(0)
    setStage('processing')
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      if (aiConfigured) {
        await runAi()
      } else {
        await runHeuristic(controller.signal)
      }
    } catch (e) {
      if (controller.signal.aborted) return
      setErr("Something went wrong while reading your book. Please try again.")
      setStage('intro')
      setFirstRun(false)
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const handleFallbackHeuristic = async () => {
    if (files.length === 0) return
    setErr(null)
    setAiFailed(false)
    setProgress(0)
    setStage('processing')
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      await runHeuristic(controller.signal)
    } catch (e) {
      if (controller.signal.aborted) return
      setErr("Something went wrong while reading your book. Please try again.")
      setStage('intro')
      setFirstRun(false)
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const handleCancelProcessing = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setStage('intro')
    setProgress(0)
    setStalled(false)
  }

  const handleSave = () => {
    if (questions.length < 1) return
    if (!nameValid) {
      setSaveAttempted(true)
      return
    }
    const topic = buildCustomTopic(name, questions)
    dispatch({ type: 'SAVE_CUSTOM_TOPIC', topic })
    setStage('saved')
  }

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
    >
      <div className={styles.header}>
        <button onClick={handleBack} aria-label="Back" className={styles.backBtn}>
          ‹
        </button>
        <div>
          <div className={styles.title}>Create a book quiz</div>
          <div className={styles.subtitle}>
            Snap pages from your kid's book and turn them into a quiz
          </div>
        </div>
      </div>

      {err && <div className={styles.errBanner}>{err}</div>}

      {stage === 'intro' && (
        <>
          <div className={styles.card}>
            <div className={styles.hint}>
              Take clear, well-lit photos of the words on your book pages. You
              can add up to 4 pages.{' '}
              {!aiModeOn &&
                'This all happens on your device — nothing is sent to the internet.'}
            </div>

            <div className={styles.notice}>
              Heads up: book quizzes are saved on this device only. If you
              switch phones or clear this app's data, your quizzes won't come
              along.
              {!aiModeOn && (
                <> The first time you make a quiz without AI, we'll download a small on-device reader ({OCR_MODEL_SIZE}) — after that it works offline.</>
              )}
            </div>

            <div className={styles.captureRow}>
              <span className={styles.label}>Pages ({files.length}/4)</span>
              {files.length > 0 && (
                <div className={styles.thumbGrid}>
                  {thumbUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className={styles.thumb}
                      style={{ backgroundImage: `url(${url})` }}
                    >
                      <button
                        className={styles.thumbRemove}
                        aria-label="Remove page"
                        onClick={() => removeFile(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {files.length < 4 && (
                <label className={styles.addPhotoBtn}>
                  + Add a page
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handlePickFiles}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            <div className={styles.captureRow}>
              <span className={styles.label}>Number of questions</span>
              <div className={styles.aiProviderPills}>
                {[3, 5, 10].map((n) => {
                  const active = state.bookQuizLen === n
                  return (
                    <button
                      key={n}
                      type="button"
                      className={
                        active
                          ? `${styles.aiPillBtn} ${styles.aiPillBtnActive}`
                          : styles.aiPillBtn
                      }
                      onClick={() => {
                        if (window.FTSound) window.FTSound.tap()
                        dispatch({ type: 'SET_BOOK_QUIZ_LEN', len: n as 3 | 5 | 10 })
                      }}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={styles.captureRow}>
              <label className={styles.label} htmlFor="qm-name">
                Quiz name
              </label>
              <input
                id="qm-name"
                className={styles.input}
                placeholder="e.g. The Very Hungry Caterpillar"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 30))}
                maxLength={30}
              />
            </div>

            {aiModeOn && state.aiProvider && (
              <div
                className={
                  aiFailed || !providerKeyValid
                    ? `${styles.aiModeRow} ${styles.aiModeRowFailed}`
                    : styles.aiModeRow
                }
              >
                {aiFailed && providerKeyValid && (
                  <div className={styles.aiModeHint}>
                    That model didn't work — try a different one.
                  </div>
                )}
                <div className={styles.aiModeControls}>
                  <div className={styles.aiModeField}>
                    <span className={styles.aiModeLabel}>AI provider</span>
                    <div className={styles.aiProviderPills}>
                      {AI_PROVIDERS.map((p) => {
                        const active = state.aiProvider === p
                        return (
                          <button
                            key={p}
                            type="button"
                            className={
                              active
                                ? `${styles.aiPillBtn} ${styles.aiPillBtnActive}`
                                : styles.aiPillBtn
                            }
                            onClick={() => {
                              if (window.FTSound) window.FTSound.tap()
                              dispatch({ type: 'SET_AI_PROVIDER', provider: p })
                            }}
                          >
                            {AI_PROVIDER_META[p].label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className={styles.aiModeField}>
                    <span className={styles.aiModeLabel}>Model</span>
                    <select
                      className={styles.aiModelSelect}
                      value={
                        state.aiModel ||
                        AI_PROVIDER_META[state.aiProvider].defaultModel
                      }
                      onChange={(e) => {
                        if (window.FTSound) window.FTSound.tap()
                        dispatch({ type: 'SET_AI_MODEL', model: e.target.value })
                      }}
                    >
                      {AI_PROVIDER_META[state.aiProvider].models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {!providerKeyValid && (
                  <div className={styles.aiKeyMissingRow}>
                    <div className={styles.aiKeyMissingText}>
                      No {AI_PROVIDER_META[state.aiProvider].label} API key on this device. Add one to use this provider.
                    </div>
                    <button
                      type="button"
                      className={styles.aiSettingsBtn}
                      onClick={() => {
                        if (window.FTSound) window.FTSound.tap()
                        try {
                          sessionStorage.setItem('parents:focus', 'ai')
                        } catch {}
                        dispatch({ type: 'GO_PARENTS' })
                      }}
                    >
                      Open AI settings →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.actionRow}>
            {aiModeOn && (
              <button
                className={styles.secondaryBtn}
                onClick={handleFallbackHeuristic}
                disabled={files.length === 0}
              >
                Generate without AI
              </button>
            )}
            <button
              className={styles.primaryBtn}
              onClick={handleGenerate}
              disabled={
                files.length === 0 || (aiModeOn && !providerKeyValid)
              }
            >
              {aiModeOn ? 'Generate with AI' : 'Generate quiz'}
            </button>
          </div>
        </>
      )}

      {stage === 'processing' && (
        <div className={styles.card}>
          <div className={styles.progressWrap}>
            <div className={styles.progressRing} />
            <div className={styles.progressPct}>
              {Math.round(progress * 100)}%
            </div>
            <div className={styles.progressCaption}>
              {aiConfigured
                ? 'Asking the AI to read your book…'
                : firstRun
                  ? `Downloading the reader (first time only — ${OCR_MODEL_SIZE}, so it may take a minute)…`
                  : 'Reading the words on your pages…'}
            </div>
            {stalled && (
              <div className={styles.progressCaption}>
                Still working — first-time download can be slow on weak connections.
              </div>
            )}
            <button
              className={styles.secondaryBtn}
              onClick={handleCancelProcessing}
              style={{ marginTop: 6 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {stage === 'review' && (
        <>
          <div className={styles.card}>
            <div className={styles.hint}>
              Here {questions.length === 1 ? 'is the 1 question' : `are the ${questions.length} questions`} I made. Give your quiz a name, then save it.
            </div>
            <input
              className={styles.input}
              placeholder="Quiz name (required)"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              maxLength={30}
              aria-invalid={saveAttempted && !nameValid}
              aria-describedby="qm-name-hint"
            />
            {saveAttempted && !nameValid && (
              <div id="qm-name-hint" className={styles.errBanner}>
                Give your quiz a name to save it.
              </div>
            )}
          </div>

          <div className={styles.reviewList}>
            {questions.map((q, i) => (
              <div key={i} className={styles.reviewQ}>
                <div className={styles.reviewQText}>
                  {i + 1}. {q.q}
                </div>
                <div className={styles.reviewAnswers}>
                  {q.a.map((ans, ai) => (
                    <div
                      key={ai}
                      className={
                        ai === q.correct
                          ? `${styles.reviewAnswer} ${styles.reviewCorrect}`
                          : styles.reviewAnswer
                      }
                    >
                      {ai === q.correct ? '✓ ' : ''}
                      {ans}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actionRow}>
            <button
              className={styles.secondaryBtn}
              onClick={() => setStage('intro')}
            >
              Retake
            </button>
            <button
              className={styles.primaryBtn}
              onClick={handleSave}
              disabled={!nameValid || questions.length < 1}
            >
              Save quiz
            </button>
          </div>
        </>
      )}

      {stage === 'saved' && state.customTopicSaveError === 'QUOTA' && (
        <div className={styles.card}>
          <div className={styles.savedBox}>
            <div className={styles.savedIcon}>💾</div>
            <div className={styles.title}>Out of room on this device</div>
            <div className={styles.progressCaption}>
              This quiz is loaded for now, but there's no space left to save it.
              Delete a book quiz in Topics or use "Clear book quizzes" in
              Parents, then try again.
            </div>
            <div className={styles.actionRow} style={{ marginTop: 8 }}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setStage('review')}
              >
                Back to review
              </button>
              <button
                className={styles.primaryBtn}
                onClick={() => dispatch({ type: 'GO_TOPICS' })}
              >
                Go to Topics
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'saved' && state.customTopicSaveError !== 'QUOTA' && (
        <div className={styles.card}>
          <div className={styles.savedBox}>
            <div className={styles.savedIcon}>📚</div>
            <div className={styles.title}>Saved!</div>
            <div className={styles.progressCaption}>
              Your quiz is ready under "Your books" on the topics screen.
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => dispatch({ type: 'GO_TOPICS' })}
              style={{ marginTop: 8 }}
            >
              See it
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
