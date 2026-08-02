import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode, type Dispatch } from 'react'
import {
  Task, UserProfile, LevelRequirement, Skin, AIConfig, Achievement,
  RepeatConfig, RepeatType
} from '../types'
import { LEVELS, getNextLevel } from '../constants/levels'
import { collectCompletedDates, computeStreak, getDaysInGame } from '../utils/progression'

export const STORAGE_KEY = 'rungetlive-state'

export interface SettingsState {
  notifications: { enabled: boolean; time: string }
  sounds: boolean
  language: 'ru' | 'en'
}

const INITIAL_SETTINGS: SettingsState = {
  notifications: { enabled: true, time: '09:00' },
  sounds: true,
  language: 'ru',
}

const INITIAL_PROFILE: UserProfile = {
  name: 'Игрок',
  avatar: 'default',
  level: 1,
  xp: 0,
  totalXp: 0,
  daysInGame: 1,
  tasksCompleted: 0,
  totalPointsEarned: 0,
  currentSkin: 'default',
  unlockedSkins: ['default'],
  streak: 1,
  maxStreak: 1,
  createdAt: Date.now(),
}

const INITIAL_SKINS: Skin[] = [
  { id: 'default', name: 'Стандартный', preview: 'user', unlockLevel: 1, unlocked: true },
  { id: 'runner', name: 'Бегун', preview: 'zap', unlockLevel: 5, unlocked: false },
  { id: 'scholar', name: 'Учёный', preview: 'book-open', unlockLevel: 10, unlocked: false },
  { id: 'master', name: 'Мастер', preview: 'crown', unlockLevel: 15, unlocked: false },
  { id: 'legend', name: 'Легенда', preview: 'star', unlockLevel: 20, unlocked: false },
]

const INITIAL_AI_CONFIG: AIConfig = { type: 'subscription', customApiKey: '', customBaseUrl: '' }

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_task', name: 'Первый шаг', title: 'Первый шаг', description: 'Выполни первую задачу', icon: 'target', unlocked: false, unlockedAt: null },
  { id: 'week_streak', name: 'Неделя без пропусков', title: 'Неделя без пропусков', description: '7 дней подряд', icon: 'flame', unlocked: false, unlockedAt: null },
  { id: 'level_5', name: 'Рыцарь порядка', title: 'Рыцарь порядка', description: 'Достигни 5 уровня', icon: 'swords', unlocked: false, unlockedAt: null },
  { id: 'level_10', name: 'Мастер дисциплины', title: 'Мастер дисциплины', description: 'Достигни 10 уровня', icon: 'medal', unlocked: false, unlockedAt: null },
  { id: 'hundred_tasks', name: 'Сотня дел', title: 'Сотня дел', description: 'Выполни 100 задач', icon: 'check-circle', unlocked: false, unlockedAt: null },
]

interface AppState {
  profile: UserProfile
  tasks: Task[]
  skins: Skin[]
  aiConfig: AIConfig
  achievements: Achievement[]
  selectedSkinId: string
  selectedDate: string
  sidebarOpen: boolean
  settings: SettingsState
}

type AppAction =
  | { type: 'LOAD'; payload: Partial<AppState> }
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: { id: string; date: string } }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_SKIN'; payload: string }
  | { type: 'SET_AI_CONFIG'; payload: AIConfig }
  | { type: 'UNLOCK_SKIN'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'LEVEL_UP'; payload: number }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_SETTINGS'; payload: Partial<SettingsState> }
  | { type: 'RESET_STATE' }

function loadInitialState(): AppState {
  const build = (parsed?: any): AppState => {
    const tasks: Task[] = Array.isArray(parsed?.tasks) ? parsed.tasks : []
    const profile = {
      ...INITIAL_PROFILE,
      ...(parsed?.profile || {}),
    }
    profile.daysInGame = Math.max(profile.daysInGame, getDaysInGame(profile.createdAt))
    const fetchedStreak = computeStreak(collectCompletedDates(tasks))
    profile.streak = Math.max(profile.streak, fetchedStreak)
    profile.maxStreak = Math.max(profile.maxStreak, fetchedStreak)
    return {
      profile,
      tasks,
      skins: Array.isArray(parsed?.skins) ? parsed.skins : INITIAL_SKINS,
      aiConfig: typeof parsed?.aiConfig === 'object' ? { ...INITIAL_AI_CONFIG, ...parsed.aiConfig } : INITIAL_AI_CONFIG,
      achievements: Array.isArray(parsed?.achievements) ? parsed.achievements : INITIAL_ACHIEVEMENTS,
      selectedSkinId: typeof parsed?.selectedSkinId === 'string' ? parsed.selectedSkinId : 'default',
      selectedDate: typeof parsed?.selectedDate === 'string' ? parsed.selectedDate : new Date().toISOString().split('T')[0],
      sidebarOpen: false,
      settings: {
        ...INITIAL_SETTINGS,
        ...(typeof parsed?.settings === 'object' ? parsed.settings : {}),
        notifications: {
          ...INITIAL_SETTINGS.notifications,
          ...(typeof parsed?.settings?.notifications === 'object' ? parsed.settings.notifications : {}),
        },
      },
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error()
    return build(parsed)
  } catch {
    return build()
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload }

    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case 'TOGGLE_TASK': {
      const { id, date } = action.payload
      const task = state.tasks.find(t => t.id === id)
      if (!task) return state

      let newTasks = state.tasks
      let pointsGained = 0

      if (task.repeat.type === 'none') {
        if (task.completed) return state
        pointsGained = task.points
        newTasks = state.tasks.map(t => t.id === id ? { ...t, completed: true } : t)
      } else {
        const dates = task.completedDates || []
        if (dates.includes(date)) {
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completedDates: dates.filter(d => d !== date) } : t)
        } else {
          pointsGained = task.points
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completedDates: [...dates, date] } : t)
        }
      }

      const newTasksCompleted = state.profile.tasksCompleted + (pointsGained > 0 ? 1 : 0)
      const newTotalXp = state.profile.totalXp + pointsGained
      const newXp = state.profile.xp + pointsGained
      const streak = computeStreak(collectCompletedDates(newTasks))
      const newMaxStreak = Math.max(state.profile.maxStreak, streak)

      const nextLevel = getNextLevel(state.profile.level)
      let newLevel = state.profile.level
      let xpAfterLevel = newXp

      if (nextLevel && newXp >= nextLevel.xpRequired && state.profile.daysInGame >= nextLevel.daysRequired) {
        newLevel = nextLevel.level
        xpAfterLevel = 0
      }

      const newAchievements = [...state.achievements]
      const unlock = (id: string) => {
        const i = newAchievements.findIndex(a => a.id === id)
        if (i >= 0 && !newAchievements[i].unlocked) {
          newAchievements[i] = { ...newAchievements[i], unlocked: true, unlockedAt: Date.now() }
        }
      }
      if (newTasksCompleted >= 1) unlock('first_task')
      if (newTasksCompleted >= 100) unlock('hundred_tasks')
      if (newLevel >= 5) unlock('level_5')
      if (newLevel >= 10) unlock('level_10')
      if (streak >= 7) unlock('week_streak')

      let newSkins = state.skins
      let newSelectedSkinId = state.selectedSkinId
      if (newLevel !== state.profile.level) {
        const skinToSelect = [...state.skins]
          .filter(s => s.unlockLevel <= newLevel)
          .sort((a, b) => b.unlockLevel - a.unlockLevel)[0]
        if (skinToSelect && skinToSelect.id !== state.selectedSkinId) {
          newSelectedSkinId = skinToSelect.id
          if (!skinToSelect.unlocked) {
            newSkins = state.skins.map(s =>
              s.id === skinToSelect.id ? { ...s, unlocked: true } : s
            )
          }
        }
      }

      return {
        ...state,
        tasks: newTasks,
        profile: {
          ...state.profile,
          xp: xpAfterLevel,
          totalXp: newTotalXp,
          tasksCompleted: newTasksCompleted,
          totalPointsEarned: state.profile.totalPointsEarned + pointsGained,
          level: newLevel,
          streak,
          maxStreak: newMaxStreak,
        },
        skins: newSkins,
        selectedSkinId: newSelectedSkinId,
        achievements: newAchievements,
      }
    }

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }

    case 'SET_SKIN':
      return { ...state, selectedSkinId: action.payload, profile: { ...state.profile, currentSkin: action.payload } }

    case 'SET_AI_CONFIG': {
      const cfg = action.payload
      const valid: AIConfig = {
        type: ['subscription', 'custom', 'disabled'].includes(cfg.type) ? cfg.type : 'disabled',
        customApiKey: typeof cfg.customApiKey === 'string' ? cfg.customApiKey.slice(0, 200) : '',
        customBaseUrl: typeof cfg.customBaseUrl === 'string' ? cfg.customBaseUrl.slice(0, 500) : '',
      }
      return { ...state, aiConfig: valid }
    }

    case 'UNLOCK_SKIN':
      return { ...state, skins: state.skins.map(s => s.id === action.payload ? { ...s, unlocked: true } : s) }

    case 'UNLOCK_ACHIEVEMENT':
      return { ...state, achievements: state.achievements.map(a => a.id === action.payload ? { ...a, unlocked: true, unlockedAt: Date.now() } : a) }

    case 'LEVEL_UP':
      return { ...state, profile: { ...state.profile, level: action.payload, xp: 0 } }

    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload }

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
          notifications: {
            ...state.settings.notifications,
            ...(action.payload.notifications || {}),
          },
        },
      }

    case 'RESET_STATE':
      return loadInitialState()

    default:
      return state
  }
}

function validateUUID(): string {
  try { return crypto.randomUUID() } catch { return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}` }
}

interface TasksIndex {
  getForDate: (date: string) => Task[]
}

function buildTasksIndex(tasks: Task[]): TasksIndex {
  const map = new Map<string, Task[]>()
  for (const t of tasks) {
    const dates = new Set<string>()
    dates.add(t.date)
    const start = new Date(t.date + 'T00:00:00')
    const end = new Date(t.date + 'T00:00:00')
    if (t.repeat.endDate) {
      end.setTime(new Date(t.repeat.endDate + 'T00:00:00').getTime())
    } else {
      end.setDate(end.getDate() + 90)
    }
    const limit = Math.max(start.getTime(), end.getTime())
    if (t.repeat.type === 'daily') {
      const d = new Date(start)
      while (d.getTime() <= limit) {
        dates.add(d.toISOString().split('T')[0])
        d.setDate(d.getDate() + 1)
      }
    } else if (t.repeat.type === 'weekly' && t.repeat.daysOfWeek) {
      const d = new Date(start)
      while (d.getTime() <= limit) {
        if (t.repeat.daysOfWeek!.includes(d.getDay() === 0 ? 7 : d.getDay())) {
          dates.add(d.toISOString().split('T')[0])
        }
        d.setDate(d.getDate() + 1)
      }
    }
    for (const date of dates) {
      const existing = map.get(date) || []
      existing.push(t)
      map.set(date, existing)
    }
  }
  return {
    getForDate: (date: string) => map.get(date) || [],
  }
}

interface AppContextType {
  state: AppState
  dispatch: Dispatch<AppAction>
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  getTasksForDate: (date: string) => Task[]
  getLevelProgress: () => { current: number; required: number; percent: number }
  checkAchievements: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { }
    }, 300)
    return () => clearTimeout(id)
  }, [state])

  const indexRef = useRef<TasksIndex>({ getForDate: () => [] })
  useEffect(() => { indexRef.current = buildTasksIndex(state.tasks) }, [state.tasks])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: { ...task, id: validateUUID(), createdAt: Date.now() } })
  }, [])

  const getTasksForDate = useCallback((date: string): Task[] => {
    return indexRef.current.getForDate(date)
  }, [])

  const getLevelProgress = useCallback(() => {
    const nextLevel = LEVELS.find(l => l.level === state.profile.level + 1)
    if (!nextLevel) return { current: state.profile.xp, required: 0, percent: 100 }
    return {
      current: state.profile.xp,
      required: nextLevel.xpRequired,
      percent: Math.min(100, (state.profile.xp / nextLevel.xpRequired) * 100),
    }
  }, [state.profile])

  const checkAchievements = useCallback(() => {
    const { profile } = state
    if (profile.tasksCompleted >= 1) dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'first_task' })
    if (profile.tasksCompleted >= 100) dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'hundred_tasks' })
    if (profile.level >= 5) dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'level_5' })
    if (profile.level >= 10) dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'level_10' })
    if (profile.streak >= 7) dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: 'week_streak' })
  }, [state.profile])

  useEffect(() => {
    state.skins.forEach(skin => {
      if (!skin.unlocked && state.profile.level >= skin.unlockLevel) {
        dispatch({ type: 'UNLOCK_SKIN', payload: skin.id })
      }
    })
  }, [state.profile.level])

  return (
    <AppContext.Provider value={{ state, dispatch, addTask, getTasksForDate, getLevelProgress, checkAchievements }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}