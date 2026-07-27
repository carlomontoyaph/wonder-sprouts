export type CategoryKey = 'all' | 'nature' | 'science' | 'world' | 'books'

export type MascotVariant = 'sprout' | 'berry' | 'pebble' | 'lily' | 'plum' | 'tango'

export type MascotMood = 'happy' | 'cheer' | 'encourage'

export type ScreenName = 'home' | 'topics' | 'trivia' | 'summary' | 'progress' | 'parents' | 'settings' | 'landing' | 'quizmaker'

export interface TopicQuestion {
  q: string
  a: [string, string, string, string]
  correct: number
  art: string
  artDesc: string
  fact: string
  talk: string
}

export interface Topic {
  key: string
  name: string
  color: string
  soft: string
  cat: CategoryKey
  blurb: string
  iconSvg: string
  questions: TopicQuestion[]
  summaryPrompt: string
  custom?: true
  createdAt?: number
}

export interface BadgeDef {
  key: string
  label: string
  color: string
  earned: (progress: GameProgress) => boolean
}

export interface FeedbackData {
  bonding: string
  enjoy: string[]
  improvement: string
  recommend: string
  submittedAt: string
}

export interface GameProgress {
  xp: number
  coins: number
  progress: Record<string, number>
  factsLearned: number
  sessions: number
  streak: number
  lastPlayed: string | null
  perfectTopics: Record<string, boolean>
  playSeconds: number
  todaySeconds: number
  todayDate: string | null
  dailyLimitMin: number
  hiddenTopics: Record<string, boolean>
  sessionLen: 3 | 5
  childName: string
  avatarVariant: MascotVariant
  reduceMotion: boolean
  textBig: boolean
  hasSeenLanding: boolean
  muted: boolean
  customTopics: Topic[]
  aiEnabled: boolean
  aiProvider: AiProvider | null
  aiApiKeys: Partial<Record<AiProvider, string>>
  aiModel: string
  bookQuizLen: 3 | 5 | 10
}

export type AiProvider = 'anthropic' | 'openai' | 'gemini'

export interface SessionState {
  screen: ScreenName
  topicKey: string | null
  qIndex: number
  sessionAnswers: (number | null)[]
  shuffles: number[][]
  questionOrder: number[]
  sessionXp: number
  sessionCoins: number
  correctCount: number
  pulseCoins: boolean
  topicFilter: CategoryKey
  filterSheetOpen: boolean
  parentUnlocked: boolean
  gateA: number
  gateB: number
  gateChoices: number[]
  gateError: boolean
  tipIndex: number
  wonderIdx: number
  vw: number
  muted: boolean
  customTopicSaveError: 'QUOTA' | null
  postGateDestination: ScreenName | null
}

export type AppState = GameProgress & SessionState

export type Viewport = 'mobile' | 'tablet' | 'desktop'
