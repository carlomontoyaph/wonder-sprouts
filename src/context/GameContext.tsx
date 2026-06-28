import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AppState, GameProgress } from '../types'
import { gameReducer, GameAction, initialState } from './gameReducer'
import { loadProgress } from '../services/storage'

interface GameContextValue {
  state: AppState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Load persisted progress on mount
  useEffect(() => {
    const saved = loadProgress()
    if (saved && typeof saved.xp === 'number') {
      const today = new Date().toDateString()
      const patch: Partial<GameProgress> = {
        xp: saved.xp,
        coins: saved.coins,
        progress: saved.progress || {},
        factsLearned: saved.factsLearned || 0,
        sessions: saved.sessions || 0,
        streak: saved.streak || 0,
        lastPlayed: saved.lastPlayed || null,
        perfectTopics: saved.perfectTopics || {},
        playSeconds: saved.playSeconds || 0,
        todaySeconds:
          saved.todayDate === today ? saved.todaySeconds || 0 : 0,
        todayDate: today,
        dailyLimitMin: saved.dailyLimitMin || 0,
        hiddenTopics: saved.hiddenTopics || {},
        sessionLen: (saved.sessionLen as 3 | 5) || 5,
        childName: saved.childName || '',
        avatarVariant: (saved.avatarVariant as AppState['avatarVariant']) || 'sprout',
        reduceMotion: !!saved.reduceMotion,
        textBig: !!saved.textBig,
        hasSeenLanding: !!saved.hasSeenLanding,
        muted: saved.muted ?? false,
      }
      dispatch({ type: 'LOAD_PROGRESS', progress: patch })
      // Sync FTSound to match loaded muted state
      if (window.FTSound) {
        window.FTSound.setMuted(!!saved.muted)
      }
    }

    // Viewport tracking
    const onResize = () => {
      dispatch({ type: 'UPDATE_VIEWPORT', width: window.innerWidth })
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
