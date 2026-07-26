import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { TopicCard } from '../../components/TopicCard/TopicCard'
import { CategorySheet } from '../../components/CategorySheet/CategorySheet'
import { TOPICS, CATEGORIES, CATEGORY_DOTS } from '../../data/topics'
import { useResponsive } from '../../hooks/useResponsive'
import { Topic } from '../../types'
import styles from './TopicsScreen.module.css'

export function TopicsScreen() {
  const { state, dispatch } = useGame()
  const resp = useResponsive(state.vw)
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null)

  const customTopics = state.customTopics || []

  const isVisible = (tp: Topic) => {
    if (state.hiddenTopics[tp.key]) return false
    if (state.topicFilter === 'all') return true
    return tp.cat === state.topicFilter
  }

  const visibleCustom = customTopics.filter(isVisible)
  const visibleBuiltin = TOPICS.filter(isVisible)

  const currentCat =
    CATEGORIES.find((c) => c.key === state.topicFilter) || CATEGORIES[0]

  const catCount = (k: string) => {
    const all = [...customTopics, ...TOPICS].filter((tp) => !state.hiddenTopics[tp.key])
    if (k === 'all') return all.length
    return all.filter((tp) => tp.cat === k).length
  }

  const handleBack = () => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'GO_HOME' })
  }

  const handleFilterSelect = (filter: string) => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'SET_FILTER', filter: filter as any })
  }

  const handleTopicSelect = (key: string) => {
    if (window.FTSound) window.FTSound.tap()
    dispatch({ type: 'START_QUIZ', topicKey: key })
  }

  const showEmpty = visibleCustom.length === 0 && visibleBuiltin.length === 0

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
      style={{ maxWidth: resp.topicsMaxW }}
    >
      {/* Back + Title */}
      <div className={styles.header}>
        <button onClick={handleBack} aria-label="Back" className={styles.backBtn}>
          ‹
        </button>
        <div>
          <div className={styles.title}>Choose a topic</div>
          <div className={styles.subtitle}>Pick something you're curious about</div>
        </div>
      </div>

      {/* Filter row */}
      <div className={styles.filterRow}>
        <span className={styles.countLabel}>
          {catCount(state.topicFilter)} topics
        </span>
        <button
          onClick={() => {
            if (window.FTSound) window.FTSound.tap()
            dispatch({ type: 'OPEN_FILTER_SHEET' })
          }}
          className={styles.filterBtn}
        >
          <span
            className={styles.filterDot}
            style={{
              background: CATEGORY_DOTS[state.topicFilter] || '#B7A98E',
            }}
          />
          <span className={styles.filterLabel}>{currentCat.label}</span>
          <span className={styles.filterCount}>
            {catCount(state.topicFilter)}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A89A85" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Empty state */}
      {showEmpty && (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>No topics found</div>
          <div className={styles.emptySub}>Try a different category.</div>
        </div>
      )}

      {/* Your books section */}
      {visibleCustom.length > 0 && (
        <>
          <div className={styles.groupTitle}>Your books</div>
          <div
            className={styles.grid}
            style={{ gridTemplateColumns: resp.gridTemplate }}
          >
            {visibleCustom.map((topic) => (
              <div key={topic.key} className={styles.tileWrap}>
                <button
                  className={styles.deleteTileBtn}
                  aria-label={`Delete ${topic.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTarget(topic)
                  }}
                >
                  ✕
                </button>
                <TopicCard
                  topic={topic}
                  done={state.progress[topic.key] || 0}
                  total={topic.questions.length}
                  onSelect={() => handleTopicSelect(topic.key)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Built-in topics grid */}
      {visibleBuiltin.length > 0 && (
        <>
          {visibleCustom.length > 0 && (
            <div className={styles.groupTitle}>Explore</div>
          )}
          <div
            className={styles.grid}
            style={{ gridTemplateColumns: resp.gridTemplate }}
          >
            {visibleBuiltin.map((topic) => (
              <TopicCard
                key={topic.key}
                topic={topic}
                done={state.progress[topic.key] || 0}
                total={topic.questions.length}
                onSelect={() => handleTopicSelect(topic.key)}
              />
            ))}
          </div>
        </>
      )}

      {/* Category sheet overlay */}
      <CategorySheet
        open={state.filterSheetOpen}
        currentFilter={state.topicFilter}
        hiddenTopics={state.hiddenTopics}
        onSelect={handleFilterSelect}
        onClose={() => dispatch({ type: 'CLOSE_FILTER_SHEET' })}
      />

      {/* Delete custom topic confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(74,58,40,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 22,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              style={{
                background: '#fbf7f0',
                border: '2px solid #f0e7d6',
                borderRadius: 24,
                padding: '28px 24px',
                maxWidth: 340,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(74,58,40,0.25)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
              <div style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: '#4a3a28',
                lineHeight: 1.2,
                marginBottom: 8,
              }}>
                Delete "{deleteTarget.name}"?
              </div>
              <div style={{
                fontSize: 14,
                color: '#8a7c68',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: 16,
              }}>
                This quiz will be gone from your library.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    background: '#fff',
                    color: '#8a7c68',
                    border: '2px solid #efe2cc',
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: 12,
                    borderRadius: 16,
                  }}
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    background: '#e8946a',
                    color: '#fff',
                    border: 0,
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    padding: 12,
                    borderRadius: 16,
                  }}
                  onClick={() => {
                    dispatch({ type: 'DELETE_CUSTOM_TOPIC', key: deleteTarget.key })
                    setDeleteTarget(null)
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
