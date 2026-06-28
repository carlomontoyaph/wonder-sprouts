import { AppState, GameProgress, CategoryKey, MascotVariant, ScreenName } from '../types'
import { GAME_CONSTANTS, STORAGE_KEY } from '../constants/game'
import { shuffleOrder } from '../utils/shuffle'
import { getTopicByKey, getActiveQuestions } from '../data/topics'

export type GameAction =
  | { type: 'SET_SCREEN'; screen: ScreenName }
  | { type: 'START_QUIZ'; topicKey: string }
  | { type: 'ANSWER_QUESTION'; answerIndex: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GO_BACK' }
  | { type: 'LOAD_PROGRESS'; progress: Partial<GameProgress> }
  | { type: 'PULSE_COINS_DONE' }
  | { type: 'SET_CHILD_NAME'; name: string }
  | { type: 'SET_AVATAR'; variant: MascotVariant }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_REDUCE_MOTION' }
  | { type: 'TOGGLE_TEXT_BIG' }
  | { type: 'SET_FILTER'; filter: CategoryKey }
  | { type: 'OPEN_FILTER_SHEET' }
  | { type: 'CLOSE_FILTER_SHEET' }
  | { type: 'PARENT_GATE_ANSWER'; value: number }
  | { type: 'TOGGLE_HIDDEN_TOPIC'; topicKey: string }
  | { type: 'SET_SESSION_LEN'; len: 3 | 5 }
  | { type: 'SET_DAILY_LIMIT'; min: number }
  | { type: 'RESET_PROGRESS' }
  | { type: 'CYCLE_TIP' }
  | { type: 'GO_HOME' }
  | { type: 'GO_TOPICS' }
  | { type: 'GO_PARENTS' }
  | { type: 'GO_LANDING' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'UPDATE_VIEWPORT'; width: number }
  | { type: 'ENTER_APP' }
  | { type: 'SUBMIT_FEEDBACK' }
  | { type: 'ACCUMULATE_TIME'; seconds: number }

export const initialState: AppState = {
  screen: 'home',
  wonderIdx: 0,
  childName: '',
  xp: 0,
  coins: 0,
  topicKey: null,
  qIndex: 0,
  sessionAnswers: [],
  shuffles: [],
  sessionXp: 0,
  sessionCoins: 0,
  correctCount: 0,
  progress: {},
  factsLearned: 0,
  sessions: 0,
  streak: 0,
  lastPlayed: null,
  perfectTopics: {},
  muted: false,
  topicFilter: 'all',
  filterSheetOpen: false,
  vw: typeof window !== 'undefined' ? window.innerWidth : 1024,
  playSeconds: 0,
  todaySeconds: 0,
  todayDate: null,
  dailyLimitMin: 0,
  hiddenTopics: {},
  sessionLen: 5,
  avatarVariant: 'sprout',
  reduceMotion: false,
  textBig: false,
  hasSeenLanding: false,
  parentUnlocked: false,
  gateA: 0,
  gateB: 0,
  gateChoices: [],
  gateError: false,
  tipIndex: 0,
  pulseCoins: false,
}

function newGate(): Pick<AppState, 'gateA' | 'gateB' | 'gateChoices' | 'gateError'> {
  const a = 2 + Math.floor(Math.random() * 7)
  const b = 2 + Math.floor(Math.random() * 7)
  const ans = a + b
  const set = new Set<number>([ans])
  while (set.size < 3) {
    set.add(ans + (Math.floor(Math.random() * 7) - 3) || ans + 1)
  }
  const choices = Array.from(set).sort(() => Math.random() - 0.5)
  return { gateA: a, gateB: b, gateChoices: choices, gateError: false }
}

function persist(state: GameProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
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
      hasSeenLanding: state.hasSeenLanding,
      muted: state.muted,
    }))
  } catch { /* silently fail */ }
}

export function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN': {
      return { ...state, screen: action.screen }
    }

    case 'START_QUIZ': {
      const t = getTopicByKey(action.topicKey)
      const qs = getActiveQuestions(t, state.sessionLen)
      const shuffles = qs.map((q) => shuffleOrder(q.a.length))
      const progress = { ...state.progress }
      if (progress[action.topicKey] === undefined) progress[action.topicKey] = 0
      const next = {
        ...state,
        screen: 'trivia' as ScreenName,
        topicKey: action.topicKey,
        qIndex: 0,
        sessionAnswers: [] as (number | null)[],
        shuffles,
        sessionXp: 0,
        sessionCoins: 0,
        correctCount: 0,
        pulseCoins: false,
        progress,
      }
      persist(next)
      return next
    }

    case 'ANSWER_QUESTION': {
      const qi = state.qIndex
      if (state.sessionAnswers[qi] != null) return state // already answered
      const t = getTopicByKey(state.topicKey!)
      const correct = action.answerIndex === t.questions[qi].correct
      const addXp = correct ? GAME_CONSTANTS.XP_CORRECT : GAME_CONSTANTS.XP_TRY
      const addCoins = correct ? GAME_CONSTANTS.COINS_CORRECT : 0
      const sessionAnswers = [...state.sessionAnswers]
      sessionAnswers[qi] = action.answerIndex
      const next = {
        ...state,
        sessionAnswers,
        xp: state.xp + addXp,
        coins: state.coins + addCoins,
        sessionXp: state.sessionXp + addXp,
        sessionCoins: state.sessionCoins + addCoins,
        correctCount: state.correctCount + (correct ? 1 : 0),
        pulseCoins: correct && !state.reduceMotion,
        factsLearned: state.factsLearned + 1,
      }
      persist(next)
      return next
    }

    case 'NEXT_QUESTION': {
      const t = getTopicByKey(state.topicKey!)
      const qs = getActiveQuestions(t, state.sessionLen)
      if (state.qIndex >= qs.length - 1) {
        // Finalize session
        const prog = { ...state.progress, [t.key]: Math.max(state.progress[t.key] || 0, qs.length) }
        const isPerfect = state.correctCount === qs.length
        const perfectTopics = { ...state.perfectTopics }
        if (isPerfect) perfectTopics[t.key] = true
        const today = new Date().toDateString()
        let streak = state.streak
        const last = state.lastPlayed
        if (last !== today) {
          const y = new Date()
          y.setDate(y.getDate() - 1)
          streak = last === y.toDateString() ? streak + 1 : 1
        } else if (streak === 0) {
          streak = 1
        }
        const sameDay = state.todayDate === today
        const next = {
          ...state,
          screen: 'summary' as ScreenName,
          progress: prog,
          sessions: state.sessions + 1,
          perfectTopics,
          streak,
          lastPlayed: today,
          todayDate: today,
          todaySeconds: (sameDay ? state.todaySeconds : 0),
        }
        persist(next)
        return next
      } else {
        return { ...state, qIndex: state.qIndex + 1 }
      }
    }

    case 'GO_BACK': {
      if (state.qIndex > 0) {
        return { ...state, qIndex: state.qIndex - 1 }
      }
      return { ...state, screen: 'topics' }
    }

    case 'GO_HOME': {
      return {
        ...state,
        screen: 'home',
        wonderIdx: Math.floor(Math.random() * 100000),
      }
    }

    case 'GO_LANDING': {
      return { ...state, screen: 'landing' }
    }

    case 'GO_TOPICS': {
      return { ...state, screen: 'topics' }
    }

    case 'GO_PARENTS': {
      if (state.parentUnlocked) {
        return { ...state, screen: 'parents' }
      }
      return { ...state, ...newGate(), screen: 'parents' }
    }

    case 'PLAY_AGAIN': {
      return gameReducer(state, { type: 'START_QUIZ', topicKey: state.topicKey! })
    }

    case 'LOAD_PROGRESS': {
      return { ...state, ...action.progress }
    }

    case 'PULSE_COINS_DONE': {
      return { ...state, pulseCoins: false }
    }

    case 'SET_CHILD_NAME': {
      const next = { ...state, childName: action.name.slice(0, 14) }
      persist(next)
      return next
    }

    case 'SET_AVATAR': {
      const next = { ...state, avatarVariant: action.variant }
      persist(next)
      return next
    }

    case 'TOGGLE_MUTE': {
      const next = { ...state, muted: !state.muted }
      return next
    }

    case 'TOGGLE_REDUCE_MOTION': {
      const next = { ...state, reduceMotion: !state.reduceMotion }
      persist(next)
      return next
    }

    case 'TOGGLE_TEXT_BIG': {
      const next = { ...state, textBig: !state.textBig }
      persist(next)
      return next
    }

    case 'SET_FILTER': {
      return { ...state, topicFilter: action.filter, filterSheetOpen: false }
    }

    case 'OPEN_FILTER_SHEET': {
      return { ...state, filterSheetOpen: true }
    }

    case 'CLOSE_FILTER_SHEET': {
      return { ...state, filterSheetOpen: false }
    }

    case 'PARENT_GATE_ANSWER': {
      if (action.value === state.gateA + state.gateB) {
        return { ...state, parentUnlocked: true, gateError: false }
      }
      const gate = newGate()
      return { ...state, ...gate, gateError: true }
    }

    case 'TOGGLE_HIDDEN_TOPIC': {
      const hiddenTopics = { ...state.hiddenTopics }
      if (hiddenTopics[action.topicKey]) {
        delete hiddenTopics[action.topicKey]
      } else {
        hiddenTopics[action.topicKey] = true
      }
      const next = { ...state, hiddenTopics }
      persist(next)
      return next
    }

    case 'SET_SESSION_LEN': {
      const next = { ...state, sessionLen: action.len }
      persist(next)
      return next
    }

    case 'SET_DAILY_LIMIT': {
      const next = { ...state, dailyLimitMin: action.min }
      persist(next)
      return next
    }

    case 'RESET_PROGRESS': {
      const cleared = {
        xp: 0,
        coins: 0,
        progress: {},
        factsLearned: 0,
        sessions: 0,
        streak: 0,
        lastPlayed: null,
        perfectTopics: {},
        playSeconds: 0,
        todaySeconds: 0,
      }
      const next = { ...state, ...cleared }
      persist(next)
      return next
    }

    case 'CYCLE_TIP': {
      return { ...state, tipIndex: (state.tipIndex + 1) % 5 }
    }

    case 'ENTER_APP': {
      const next = { ...state, hasSeenLanding: true, screen: 'home' as ScreenName }
      persist(next)
      return next
    }

    case 'SUBMIT_FEEDBACK': {
      return state // feedback is stored separately; nothing to change in game state
    }

    case 'ACCUMULATE_TIME': {
      const today = new Date().toDateString()
      const sameDay = state.todayDate === today
      const next = {
        ...state,
        playSeconds: state.playSeconds + action.seconds,
        todaySeconds: (sameDay ? state.todaySeconds : 0) + action.seconds,
        todayDate: today,
      }
      persist(next)
      return next
    }

    case 'UPDATE_VIEWPORT': {
      return { ...state, vw: action.width }
    }

    default:
      return state
  }
}
