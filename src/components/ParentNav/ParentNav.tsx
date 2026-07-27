import styles from './ParentNav.module.css'

export type ParentSectionId = 'stats' | 'learning' | 'habits' | 'ai' | 'books'

interface ParentNavProps {
  active: ParentSectionId
  onSelect: (id: ParentSectionId) => void
}

const ITEMS: { id: ParentSectionId; label: string }[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'learning', label: 'Learning' },
  { id: 'habits', label: 'Habits' },
  { id: 'ai', label: 'AI' },
  { id: 'books', label: 'Books' },
]

export function ParentNav({ active, onSelect }: ParentNavProps) {
  return (
    <div className={styles.wrap}>
      <nav
        className={styles.inner}
        aria-label="Dashboard sections"
        role="tablist"
      >
        {ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              className={
                isActive ? `${styles.pill} ${styles.pillActive}` : styles.pill
              }
              onClick={() => {
                if (window.FTSound) window.FTSound.tap()
                onSelect(item.id)
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
