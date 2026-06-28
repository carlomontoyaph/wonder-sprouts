import { motion } from 'framer-motion'
import styles from './XPPill.module.css'

interface XPPillProps {
  xp: number
  bump: boolean
  reduceMotion: boolean
}

export function XPPill({ xp, bump, reduceMotion }: XPPillProps) {
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
      <span className={styles.star} />
      <span className={styles.label}>{xp}</span>
    </motion.div>
  )
}
