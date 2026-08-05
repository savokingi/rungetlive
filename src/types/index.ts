export type ThemeMode = 'light' | 'dark'
export type AccentColor = 'green' | 'blue' | 'red' | 'purple' | 'orange'
export type RepeatType = 'none' | 'daily' | 'weekly'

export interface ThemeConfig {
  mode: ThemeMode
  accent: AccentColor
}

export interface RepeatConfig {
  type: RepeatType
  daysOfWeek?: number[]
  endDate?: string
}

export interface Task {
  id: string
  title: string
  points: number
  timeStart: string
  timeEnd: string
  date: string
  repeat: RepeatConfig
  completed: boolean
  completedDates?: string[]
  createdAt: number
}

export interface UserProfile {
  name: string
  avatar: string
  level: number
  xp: number
  totalXp: number
  daysInGame: number
  tasksCompleted: number
  totalPointsEarned: number
  currentSkin: string
  unlockedSkins: string[]
  streak: number
  maxStreak: number
  createdAt: number
}

export interface AIConfig {
  type: 'custom' | 'disabled'
  customApiKey: string
  customBaseUrl: string
}

export interface Settings {
  theme: ThemeConfig
  ai: AIConfig
  notifications: { enabled: boolean; time: string }
  language: 'ru' | 'en'
  sounds: boolean
}

export interface Achievement {
  id: string
  name: string
  title: string
  description: string
  icon: string
  kind: 'level' | 'tasks' | 'streak' | 'days'
  target: number
  unlocked: boolean
  unlockedAt: number | null
}

export interface Skin {
  id: string
  name: string
  preview: string
  unlockLevel?: number
  unlockAchievement?: string
  unlocked: boolean
}

export interface LevelRequirement {
  level: number
  daysRequired: number
  xpRequired: number
}

export interface ParsedTask {
  title: string
  points: number
  timeStart?: string
  timeEnd?: string
  date?: string
  confirmed: boolean
  editing: boolean
}