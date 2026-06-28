import { motion } from 'framer-motion'

interface XPBarProps {
  level: number
  xpInLevel: number
  xpToNext: number
  levelNext: number
}

export function XPBar({ level, xpInLevel, xpToNext, levelNext }: XPBarProps) {
  const pct = Math.round((xpInLevel / (xpInLevel + xpToNext)) * 100)

  return (
    <div style={{
      background: '#FFFFFF',
      border: '2px solid #F0E7D6',
      borderRadius: 20,
      padding: 16,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 9,
      }}>
        <span style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: '#4A3A28',
        }}>
          Level {level}
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#9A8E7C',
        }}>
          {xpToNext} XP to Level {levelNext}
        </span>
      </div>
      <div style={{
        height: 12,
        background: '#F1EADC',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #EBB347, #E8946A)',
            borderRadius: 999,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
