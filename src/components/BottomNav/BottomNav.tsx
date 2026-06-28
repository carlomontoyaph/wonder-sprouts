import { ScreenName } from '../../types'
import styles from './BottomNav.module.css'

interface NavItem {
  screen: ScreenName
  label: string
  icon: React.ReactNode
}

interface BottomNavProps {
  currentScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

const NAV_ITEMS: NavItem[] = [
  {
    screen: 'home',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" fill="currentColor" />
      </svg>
    ),
  },
  {
    screen: 'progress',
    label: 'Progress',
    icon: (
      <svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="16" height="16" rx="3" />
      </svg>
    ),
  },
  {
    screen: 'parents',
    label: 'Parents',
    icon: (
      <svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" />
      </svg>
    ),
  },
  {
    screen: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="16" height="16" rx="4" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
  },
]

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = currentScreen === item.screen
        return (
          <button
            key={item.screen}
            className={styles.item}
            onClick={() => onNavigate(item.screen)}
            style={{ color: isActive ? '#E8946A' : '#C7BCA8' }}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.iconWrap}>
              {item.icon}
              {isActive && <span className={styles.activeDot} />}
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
