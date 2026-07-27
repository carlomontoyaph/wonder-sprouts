import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AppState, ScreenName, AiProvider } from '../types'
import { gameReducer, GameAction, initialState } from './gameReducer'
import { loadProgress, loadLastScreen, saveLastScreen, loadMuted } from '../services/storage'

interface GameContextValue {
  state: AppState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

const RESUMABLE_SCREENS: ReadonlySet<ScreenName> = new Set<ScreenName>([
  'home', 'topics', 'progress', 'parents', 'settings', 'quizmaker',
])

function hydrateInitialState(): AppState {
  const saved = loadProgress()
  if (!saved || typeof saved.xp !== 'number') {
    return initialState
  }

  const today = new Date().toDateString()
  const hasSeenLanding = !!saved.hasSeenLanding
  const lastScreen = loadLastScreen()
  const resumeScreen: ScreenName =
    hasSeenLanding && lastScreen && RESUMABLE_SCREENS.has(lastScreen)
      ? lastScreen
      : initialState.screen

  return {
    ...initialState,
    screen: resumeScreen,
    xp: saved.xp,
    coins: saved.coins ?? 0,
    progress: saved.progress || {},
    factsLearned: saved.factsLearned || 0,
    sessions: saved.sessions || 0,
    streak: saved.streak || 0,
    lastPlayed: saved.lastPlayed || null,
    perfectTopics: saved.perfectTopics || {},
    playSeconds: saved.playSeconds || 0,
    todaySeconds: saved.todayDate === today ? saved.todaySeconds || 0 : 0,
    todayDate: today,
    dailyLimitMin: saved.dailyLimitMin || 0,
    hiddenTopics: saved.hiddenTopics || {},
    sessionLen: (saved.sessionLen as 3 | 5) || 5,
    childName: saved.childName || '',
    avatarVariant: (saved.avatarVariant as AppState['avatarVariant']) || 'sprout',
    reduceMotion: !!saved.reduceMotion,
    textBig: !!saved.textBig,
    hasSeenLanding,
    muted: saved.muted ?? loadMuted(),
    customTopics: Array.isArray(saved.customTopics) ? saved.customTopics : [],
    aiEnabled: !!saved.aiEnabled,
    aiProvider:
      saved.aiProvider === 'anthropic' ||
      saved.aiProvider === 'openai' ||
      saved.aiProvider === 'gemini'
        ? saved.aiProvider
        : null,
    aiApiKeys: (() => {
      const rec = saved.aiApiKeys
      if (rec && typeof rec === 'object') {
        const out: Partial<Record<AiProvider, string>> = {}
        for (const p of ['anthropic', 'openai', 'gemini'] as AiProvider[]) {
          const v = (rec as Record<string, unknown>)[p]
          if (typeof v === 'string' && v) out[p] = v
        }
        return out
      }
      const legacyKey = (saved as { aiApiKey?: unknown }).aiApiKey
      if (typeof legacyKey === 'string' && legacyKey && saved.aiProvider) {
        return { [saved.aiProvider]: legacyKey } as Partial<Record<AiProvider, string>>
      }
      return {}
    })(),
    aiModel: typeof saved.aiModel === 'string' ? saved.aiModel : '',
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, hydrateInitialState)

  // Sync FTSound (loaded via defer) to persisted muted state, and track viewport.
  useEffect(() => {
    if (window.FTSound) {
      window.FTSound.setMuted(state.muted)
    }

    const onResize = () => {
      dispatch({ type: 'UPDATE_VIEWPORT', width: window.innerWidth })
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist last screen so refresh resumes where the user was.
  useEffect(() => {
    saveLastScreen(state.screen)
  }, [state.screen])

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
