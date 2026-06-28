import { motion } from 'framer-motion'
import { Topic } from '../../types'
import styles from './TopicCard.module.css'

interface TopicCardProps {
  topic: Topic
  done: number
  total: number
  onSelect: () => void
}

export function TopicCard({ topic, done, total, onSelect }: TopicCardProps) {
  const isDone = done >= total && done > 0
  const started = done > 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  let statusLabel = 'New'
  let statusBg = '#FFFFFF'
  let statusTxt = '#A89A85'
  let statusBorder = '#EFE5D3'

  if (isDone) {
    statusLabel = 'Done!'
    statusBg = topic.color
    statusTxt = '#FFFFFF'
    statusBorder = topic.color
  } else if (started) {
    statusLabel = `${done}/${total}`
    statusBg = topic.soft
    statusTxt = topic.color
    statusBorder = topic.color
  }

  return (
    <motion.button
      className={styles.card}
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      style={{
        borderColor: topic.soft,
      }}
    >
      <span className={styles.topRow}>
        <span
          className={styles.iconTile}
          style={{ background: topic.soft }}
          dangerouslySetInnerHTML={{ __html: topic.iconSvg }}
        />
        <span
          className={styles.status}
          style={{
            background: statusBg,
            color: statusTxt,
            borderColor: statusBorder,
          }}
        >
          {statusLabel}
        </span>
      </span>
      <span className={styles.info}>
        <span className={styles.name}>{topic.name}</span>
        <span className={styles.blurb}>{topic.blurb}</span>
      </span>
    </motion.button>
  )
}
