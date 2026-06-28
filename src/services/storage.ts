import { GameProgress, FeedbackData } from '../types'
import { STORAGE_KEY, MUTE_KEY, FEEDBACK_KEY } from '../constants/game'

export function loadProgress(): Partial<GameProgress> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed.xp !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(state: GameProgress): void {
  try {
    const toSave = {
      xp: state.xp,
      coins: state.coins,
      progress: state.progress,
      factsLearned: state.factsLearned,
      sessions: state.sessions,
      streak: state.streak,
      lastPlayed: state.lastPlayed,
      perfectTopics: state.perfectTopics,
      playSeconds: state.playSeconds,
      todaySeconds: state.todaySeconds,
      todayDate: state.todayDate,
      dailyLimitMin: state.dailyLimitMin,
      hiddenTopics: state.hiddenTopics,
      sessionLen: state.sessionLen,
      childName: state.childName,
      avatarVariant: state.avatarVariant,
      reduceMotion: state.reduceMotion,
      textBig: state.textBig,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    /* silently fail */
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* silently fail */
  }
}

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function saveMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    /* silently fail */
  }
}

export function loadFeedback(): FeedbackData | null {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveFeedback(data: FeedbackData): void {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(data))
  } catch {
    /* silently fail */
  }
}
