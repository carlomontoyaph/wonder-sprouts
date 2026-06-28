import { motion } from 'framer-motion'
import styles from './CoinPill.module.css'

interface CoinPillProps {
  coins: number
  bump: boolean
  reduceMotion: boolean
}

export function CoinPill({ coins, bump, reduceMotion }: CoinPillProps) {
  return (
    <motion.div
      className={styles.pill}
      animate={
        bump && !reduceMotion
          ? { scale: [1, 1.26, 0.93, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.55, ease: 'easeInOut' }}
    >
      <span className={styles.coin} />
      <span className={styles.label}>{coins}</span>
    </motion.div>
  )
}
