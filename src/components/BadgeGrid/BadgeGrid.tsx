import { BadgeItem } from '../BadgeItem/BadgeItem'
import { BadgeDef, GameProgress } from '../../types'

interface BadgeGridProps {
  badges: BadgeDef[]
  progress: GameProgress
}

export function BadgeGrid({ badges, progress }: BadgeGridProps) {
  const earnedCount = badges.filter((b) => b.earned(progress)).length

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '2px 2px 10px',
      }}>
        <span style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: '#4A3A28',
        }}>
          Stickers
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#9A8E7C',
        }}>
          {earnedCount} of {badges.length}
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {badges.map((badge) => (
          <BadgeItem
            key={badge.key}
            label={badge.label}
            earned={badge.earned(progress)}
            color={badge.color}
          />
        ))}
      </div>
    </div>
  )
}
