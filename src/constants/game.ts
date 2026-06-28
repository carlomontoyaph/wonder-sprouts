// Business rules — placeholder values per design brief.
// These are product decisions flagged for confirmation before launch.

export const GAME_CONSTANTS = {
  XP_CORRECT: 20,
  COINS_CORRECT: 10,
  XP_TRY: 5,
  LEVEL_XP: 200,
  DEFAULT_SESSION_LEN: 5 as const,
  SESSION_LEN_OPTIONS: [3, 5] as const,
  DAILY_LIMIT_OPTIONS: [0, 15, 30, 60] as const,
  QUESTIONS_PER_TOPIC: 5,
  BADGE_THRESHOLDS: {
    EXPLORER: 3,
    FIRE: 3,
    SCHOLAR: 50,
  },
} as const

export const STORAGE_KEY = 'ft_progress'
export const MUTE_KEY = 'ft_muted'
export const FEEDBACK_KEY = 'ws_feedback'
