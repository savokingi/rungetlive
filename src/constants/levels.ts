import type { LevelRequirement } from '../types'

export const LEVELS: LevelRequirement[] = [
  { level: 1, daysRequired: 0, xpRequired: 0 },
  { level: 2, daysRequired: 3, xpRequired: 100 },
  { level: 3, daysRequired: 7, xpRequired: 150 },
  { level: 4, daysRequired: 14, xpRequired: 250 },
  { level: 5, daysRequired: 21, xpRequired: 300 },
  { level: 6, daysRequired: 30, xpRequired: 400 },
  { level: 7, daysRequired: 45, xpRequired: 500 },
  { level: 8, daysRequired: 60, xpRequired: 600 },
  { level: 9, daysRequired: 80, xpRequired: 750 },
  { level: 10, daysRequired: 100, xpRequired: 900 },
  { level: 11, daysRequired: 125, xpRequired: 1100 },
  { level: 12, daysRequired: 150, xpRequired: 1300 },
  { level: 13, daysRequired: 180, xpRequired: 1500 },
  { level: 14, daysRequired: 210, xpRequired: 1750 },
  { level: 15, daysRequired: 240, xpRequired: 2000 },
  { level: 16, daysRequired: 270, xpRequired: 2250 },
  { level: 17, daysRequired: 300, xpRequired: 2500 },
  { level: 18, daysRequired: 330, xpRequired: 2800 },
  { level: 19, daysRequired: 365, xpRequired: 3200 },
  { level: 20, daysRequired: 420, xpRequired: 4500 },
]

export function getNextLevel(currentLevel: number): LevelRequirement | undefined {
  return LEVELS.find(l => l.level === currentLevel + 1)
}

export function getLevelProgress(xp: number, daysInGame: number, currentLevel: number) {
  const next = getNextLevel(currentLevel)
  if (!next) return { current: xp, required: 0, percent: 100 }

  const canLevelUp = xp >= next.xpRequired && daysInGame >= next.daysRequired
  return {
    current: xp,
    required: next.xpRequired,
    percent: Math.min(100, (xp / next.xpRequired) * 100),
    canLevelUp,
    nextLevel: next.level,
  }
}

export function calculateLevel(xp: number, daysInGame: number): { level: number; xp: number } {
  let level = 1
  let remainingXp = xp

  for (const lvl of LEVELS) {
    if (lvl.level === 1) continue
    if (remainingXp >= lvl.xpRequired && daysInGame >= lvl.daysRequired) {
      level = lvl.level
      remainingXp -= lvl.xpRequired
    } else {
      break
    }
  }

  return { level, xp: remainingXp }
}