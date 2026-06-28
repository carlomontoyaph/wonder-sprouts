import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { TopicCard } from '../../components/TopicCard/TopicCard'
import { CategorySheet } from '../../components/CategorySheet/CategorySheet'
import { TOPICS, CATEGORIES, CATEGORY_DOTS } from '../../data/topics'
import { useResponsive } from '../../hooks/useResponsive'
import styles from './TopicsScreen.module.css'

export function TopicsScreen() {
  const { state, dispatch } = useGame()
  const resp = useResponsive(state.vw)

  const visibleTopics = TOPICS.filter(
    (tp) =>
      !state.hiddenTopics[tp.key] &&
      (state.topicFilter === 'all' || tp.cat === state.topicFilter),
  )

  const currentCat =
    CATEGORIES.find((c) => c.key === state.topicFilter) || CATEGORIES[0]
  const catCount = (k: string) =>
    TOPICS.filter((tp) => !state.hiddenTopics[tp.key]).filter(
      (tp) => k === 'all' || tp.cat === k,
    ).length

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

      {/* Topic grid */}
      {visibleTopics.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>No topics found</div>
          <div className={styles.emptySub}>Try a different category.</div>
        </div>
      ) : (
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: resp.gridTemplate }}
        >
          {visibleTopics.map((topic) => (
            <TopicCard
              key={topic.key}
              topic={topic}
              done={state.progress[topic.key] || 0}
              total={topic.questions.length}
              onSelect={() => handleTopicSelect(topic.key)}
            />
          ))}
        </div>
      )}

      {/* Category sheet overlay */}
      <CategorySheet
        open={state.filterSheetOpen}
        currentFilter={state.topicFilter}
        hiddenTopics={state.hiddenTopics}
        onSelect={handleFilterSelect}
        onClose={() => dispatch({ type: 'CLOSE_FILTER_SHEET' })}
      />
    </motion.div>
  )
}
