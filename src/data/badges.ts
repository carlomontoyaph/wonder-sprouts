import { BadgeDef, GameProgress } from '../types'

export const BADGE_DEFS: BadgeDef[] = [
  {
    key: 'first',
    label: 'First Quiz',
    color: '#7BAE7F',
    earned: (p: GameProgress) => p.sessions >= 1,
  },
  {
    key: 'perfect',
    label: 'Perfect!',
    color: '#EBB347',
    earned: (p: GameProgress) => Object.keys(p.perfectTopics).length >= 1,
  },
  {
    key: 'explorer',
    label: 'Explorer',
    color: '#7C84C4',
    earned: (p: GameProgress) => Object.keys(p.progress).length >= 3,
  },
  {
    key: 'fire',
    label: 'On Fire',
    color: '#E8946A',
    earned: (p: GameProgress) => p.streak >= 3,
  },
  {
    key: 'scholar',
    label: 'Scholar',
    color: '#3E9CB0',
    earned: (p: GameProgress) => p.factsLearned >= 50,
  },
  {
    key: 'master',
    label: 'Topic Master',
    color: '#C56B86',
    earned: (p: GameProgress) => {
      const totalTopics = Object.keys(p.progress).length
      const mastered = Object.values(p.progress).filter((v) => v >= 5).length
      return mastered >= 1
    },
  },
]
