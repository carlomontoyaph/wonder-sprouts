import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Mascot } from '../../components/Mascot/Mascot'
import { XPBar } from '../../components/XPBar/XPBar'
import { BadgeGrid } from '../../components/BadgeGrid/BadgeGrid'
import { TOPICS } from '../../data/topics'
import { BADGE_DEFS } from '../../data/badges'
import { GAME_CONSTANTS } from '../../constants/game'
import styles from './ProgressScreen.module.css'

export function ProgressScreen() {
  const { state, dispatch } = useGame()

  const level = Math.floor(state.xp / GAME_CONSTANTS.LEVEL_XP) + 1
  const xpInLevel = state.xp % GAME_CONSTANTS.LEVEL_XP
  const levelNext = level + 1
  const xpToNext = GAME_CONSTANTS.LEVEL_XP - xpInLevel
  const exploredCount = Object.keys(state.progress || {}).length
  const factsLearned = state.factsLearned || 0
  const streak = state.streak || 0

  const progressGreeting =
    streak >= 3
      ? "You're on a roll!"
      : Object.keys(state.perfectTopics || {}).length >= 1
        ? 'Look at you go!'
        : "You're doing great!"

  // Per-topic progress rows
  const progressTopics = TOPICS.filter(
    (tp) => (state.progress || {})[tp.key] !== undefined,
  ).map((tp) => {
    const done = state.progress[tp.key] || 0
    const tot = tp.questions.length
    return {
      key: tp.key,
      name: tp.name,
      color: tp.color,
      soft: tp.soft,
      icon: tp.iconSvg,
      pct: tot > 0 ? Math.round((done / tot) * 100) : 0,
      label: `${done}/${tot}`,
      isPerfect: !!(state.perfectTopics || {})[tp.key],
    }
  })

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <Mascot
              variant={state.avatarVariant}
              mood="cheer"
              size={58}
            />
          </div>
          <div>
            <div className={styles.title}>My Progress</div>
            <div className={styles.greeting}>{progressGreeting}</div>
          </div>
        </div>
        <div className={styles.levelBadge}>
          <span className={styles.levelNumber}>{level}</span>
          <span className={styles.levelLabel}>Level</span>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar
        level={level}
        xpInLevel={xpInLevel}
        xpToNext={xpToNext}
        levelNext={levelNext}
      />

      {/* Stat tiles */}
      <div className={styles.stats}>
        <div className={styles.statTile}>
          <div className={styles.statValue} style={{ color: '#5C8560' }}>
            {factsLearned}
          </div>
          <div className={styles.statLabel}>facts learned</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statValue} style={{ color: '#5961A8' }}>
            {exploredCount}
          </div>
          <div className={styles.statLabel}>topics explored</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statValue} style={{ color: '#C8744E' }}>
            {streak}
          </div>
          <div className={styles.statLabel}>
            {streak === 1 ? 'day' : 'days'} streak
          </div>
        </div>
      </div>

      {/* Per-topic progress */}
      <div>
        <div className={styles.sectionTitle}>Topics you've tried</div>
        {progressTopics.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No topics yet!</div>
            <div className={styles.emptySub}>
              Play a quiz to start your journey.
            </div>
          </div>
        ) : (
          <div className={styles.topicList}>
            {progressTopics.map((tp) => (
              <div
                key={tp.key}
                className={styles.topicRow}
                style={{ borderColor: tp.soft }}
              >
                <span
                  className={styles.topicIcon}
                  style={{ background: tp.soft }}
                  dangerouslySetInnerHTML={{ __html: tp.icon }}
                />
                <span className={styles.topicInfo}>
                  <span className={styles.topicNameRow}>
                    <span className={styles.topicName}>{tp.name}</span>
                    {tp.isPerfect && <span className={styles.perfectStar} />}
                  </span>
                  <span className={styles.topicBar}>
                    <span className={styles.barTrack}>
                      <span
                        className={styles.barFill}
                        style={{
                          width: `${tp.pct}%`,
                          background: tp.color,
                        }}
                      />
                    </span>
                    <span className={styles.barLabel}>{tp.label}</span>
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <BadgeGrid badges={BADGE_DEFS} progress={state} />

      {/* CTA */}
      <button
        onClick={() => {
          if (window.FTSound) window.FTSound.tap()
          dispatch({ type: 'GO_TOPICS' })
        }}
        className={styles.ctaButton}
      >
        Keep exploring
      </button>
    </motion.div>
  )
}
