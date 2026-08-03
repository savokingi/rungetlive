import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode, type Dispatch } from 'react'
import {
  Task, UserProfile, LevelRequirement, Skin, AIConfig, Achievement,
  RepeatConfig, RepeatType
} from '../types'
import { LEVELS, calculateLevel } from '../constants/levels'
import { collectCompletedDates, computeStreak, getDaysInGame, localDateKey } from '../utils/progression'

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
  // Levels — "Adam progression" (Sub-3 → True Adam)
  { id: 'default', name: 'Новичок', preview: 'adam1', unlockLevel: 1, unlocked: true },
  { id: 'adam2', name: 'Обычный', preview: 'adam2', unlockLevel: 3, unlocked: false },
  { id: 'adam3', name: 'Заметный', preview: 'adam3', unlockLevel: 5, unlocked: false },
  { id: 'adam4', name: 'Уверенный', preview: 'adam4', unlockLevel: 7, unlocked: false },
  { id: 'adam5', name: 'Харизматичный', preview: 'adam5', unlockLevel: 9, unlocked: false },
  { id: 'adam6', name: 'Лидер', preview: 'adam6', unlockLevel: 11, unlocked: false },
  { id: 'adam7', name: 'Chad', preview: 'adam7', unlockLevel: 13, unlocked: false },
  { id: 'adam8', name: 'Superior', preview: 'adam8', unlockLevel: 15, unlocked: false },
  { id: 'adam9', name: 'Пиковый', preview: 'adam9', unlockLevel: 18, unlocked: false },
  { id: 'adam10', name: 'True Adam', preview: 'adam10', unlockLevel: 20, unlocked: false },
  // Achievements — themed (specialized)
  { id: 'runner', name: 'Спринтер', preview: 'zap', unlockAchievement: 'first_task', unlocked: false },
  { id: 'scholar', name: 'Учёный', preview: 'book-open', unlockAchievement: 'ten_tasks', unlocked: false },
  { id: 'chef', name: 'Шеф-повар', preview: 'chef', unlockAchievement: 'fifty_tasks', unlocked: false },
  { id: 'artist', name: 'Художник', preview: 'artist', unlockAchievement: 'hundred_tasks', unlocked: false },
  { id: 'warrior', name: 'Воитель', preview: 'swords', unlockAchievement: 'week_streak', unlocked: false },
  { id: 'explorer', name: 'Исследователь', preview: 'compass', unlockAchievement: 'month_days', unlocked: false },
  { id: 'musician', name: 'Музыкант', preview: 'music', unlockAchievement: 'level_7', unlocked: false },
  { id: 'doctor', name: 'Доктор', preview: 'cross', unlockAchievement: 'level_10', unlocked: false },
  { id: 'business', name: 'Бизнесмен', preview: 'briefcase', unlockAchievement: 'level_15', unlocked: false },
  { id: 'astronaut', name: 'Астронавт', preview: 'rocket', unlockAchievement: 'max_level', unlocked: false },
]

const INITIAL_AI_CONFIG: AIConfig = { type: 'subscription', customApiKey: '', customBaseUrl: '' }

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_task', name: 'Первый шаг', title: 'Первый шаг', description: 'Выполни 1 задачу', icon: 'target', kind: 'tasks', target: 1, unlocked: false, unlockedAt: null },
  { id: 'ten_tasks', name: 'Десять дел', title: 'Десять дел', description: 'Выполни 10 задач', icon: 'check-circle', kind: 'tasks', target: 10, unlocked: false, unlockedAt: null },
  { id: 'fifty_tasks', name: 'Пятьдесят дел', title: 'Пятьдесят дел', description: 'Выполни 50 задач', icon: 'medal', kind: 'tasks', target: 50, unlocked: false, unlockedAt: null },
  { id: 'hundred_tasks', name: 'Сотня дел', title: 'Сотня дел', description: 'Выполни 100 задач', icon: 'check-circle', kind: 'tasks', target: 100, unlocked: false, unlockedAt: null },
  { id: 'week_streak', name: 'Неделя без пропусков', title: 'Неделя без пропусков', description: '7 дней серии', icon: 'flame', kind: 'streak', target: 7, unlocked: false, unlockedAt: null },
  { id: 'month_days', name: 'Месяц в игре', title: 'Месяц в игре', description: '30 дней с запуска', icon: 'calendar', kind: 'days', target: 30, unlocked: false, unlockedAt: null },
  { id: 'level_7', name: 'Рыцарь порядка', title: 'Рыцарь порядка', description: 'Достигни 7 уровня', icon: 'swords', kind: 'level', target: 7, unlocked: false, unlockedAt: null },
  { id: 'level_10', name: 'Мастер дисциплины', title: 'Мастер дисциплины', description: 'Достигни 10 уровня', icon: 'medal', kind: 'level', target: 10, unlocked: false, unlockedAt: null },
  { id: 'level_15', name: 'Легенда', title: 'Легенда', description: 'Достигни 15 уровня', icon: 'star', kind: 'level', target: 15, unlocked: false, unlockedAt: null },
  { id: 'max_level', name: 'Предел', title: 'Предел', description: 'Достигни 20 уровня', icon: 'trophy', kind: 'level', target: 20, unlocked: false, unlockedAt: null },
]

function computeUnlockedAchievements(profile: UserProfile): Set<string> {
  const ids = new Set<string>()
  const add = (id: string, cond: boolean) => { if (cond) ids.add(id) }
  add('first_task', profile.tasksCompleted >= 1)
  add('ten_tasks', profile.tasksCompleted >= 10)
  add('fifty_tasks', profile.tasksCompleted >= 50)
  add('hundred_tasks', profile.tasksCompleted >= 100)
  add('week_streak', profile.streak >= 7)
  add('month_days', profile.daysInGame >= 30)
  add('level_7', profile.level >= 7)
  add('level_10', profile.level >= 10)
  add('level_15', profile.level >= 15)
  add('max_level', profile.level >= 20)
  return ids
}

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

function loadInitialState(fresh = false): AppState {
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
      selectedDate: typeof parsed?.selectedDate === 'string' ? parsed.selectedDate : localDateKey(new Date()),
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
    if (fresh) throw new Error()
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

      // Symmetric toggle: checking earns XP, unchecking refunds it.
      let newTasks = state.tasks
      let delta = task.points

      if (task.repeat.type === 'none') {
        if (task.completed) {
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completed: false } : t)
          delta = -task.points
        } else {
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completed: true } : t)
        }
      } else {
        const dates = task.completedDates || []
        if (dates.includes(date)) {
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completedDates: dates.filter(d => d !== date) } : t)
          delta = -task.points
        } else {
          newTasks = state.tasks.map(t => t.id === id ? { ...t, completedDates: [...dates, date] } : t)
        }
      }

      const newTotalXp = Math.max(0, state.profile.totalXp + delta)
      const newTasksCompleted = Math.max(
        0,
        state.profile.tasksCompleted + (delta > 0 ? 1 : -1)
      )

      // Recompute level from lifetime XP, supporting multi-level jumps.
      const { level: newLevel, xp: newXp } = calculateLevel(newTotalXp, state.profile.daysInGame)
      const streak = computeStreak(collectCompletedDates(newTasks))
      const newMaxStreak = Math.max(state.profile.maxStreak, streak)

      // Unlock skins by the reached level; auto-select only when a brand-new
      // highest-tier skin appears, without overriding themed picks.
      let newSkins = state.skins
      let newSelectedSkinId = state.selectedSkinId
      if (newLevel !== state.profile.level) {
        const byLevel = [...state.skins]
          .filter((s): s is Skin & { unlockLevel: number } => typeof s.unlockLevel === 'number')
          .filter(s => s.unlockLevel <= newLevel)
        const newlyUnlocked = byLevel.filter(s => !s.unlocked)
        newSkins = state.skins.map(s =>
          byLevel.some(t => t.id === s.id) ? { ...s, unlocked: true } : s
        )
        const bestNew = newlyUnlocked.sort((a, b) => b.unlockLevel - a.unlockLevel)[0]
        const currentIsLevelSkin = state.skins.find(s => s.id === state.selectedSkinId)?.unlockLevel !== undefined
        if (bestNew && currentIsLevelSkin) {
          newSelectedSkinId = bestNew.id
        }
      }

      return {
        ...state,
        tasks: newTasks,
        profile: {
          ...state.profile,
          xp: newXp,
          totalXp: newTotalXp,
          tasksCompleted: newTasksCompleted,
          totalPointsEarned: newTotalXp,
          level: newLevel,
          streak,
          maxStreak: newMaxStreak,
          currentSkin: newSelectedSkinId,
        },
        skins: newSkins,
        selectedSkinId: newSelectedSkinId,
        achievements: state.achievements,
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
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.payload && !a.unlocked ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
        ),
      }

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
      return loadInitialState(true)

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
    let limit: number
    if (t.repeat.endDate) {
      limit = new Date(t.repeat.endDate + 'T00:00:00').getTime()
    } else {
      const horizon = new Date()
      horizon.setDate(horizon.getDate() + 730)
      limit = Math.max(start.getTime(), horizon.getTime())
    }
    const maxLimit = Math.max(start.getTime(), limit)
    if (t.repeat.type === 'daily') {
      const d = new Date(start)
      while (d.getTime() <= maxLimit) {
        dates.add(localDateKey(d))
        d.setDate(d.getDate() + 1)
      }
    } else if (t.repeat.type === 'weekly' && t.repeat.daysOfWeek) {
      const d = new Date(start)
      while (d.getTime() <= maxLimit) {
        if (t.repeat.daysOfWeek!.includes(d.getDay() === 0 ? 7 : d.getDay())) {
          dates.add(localDateKey(d))
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
  getLevelProgress: () => { current: number; required: number; percent: number; canLevelUp: boolean; nextLevel: number }
  checkAchievements: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, () => loadInitialState())
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { }
    }, 300)
    return () => clearTimeout(id)
  }, [state])

  useEffect(() => {
    const flush = () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { }
    }
    window.addEventListener('beforeunload', flush)
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('beforeunload', flush)
      window.removeEventListener('pagehide', flush)
    }
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
    if (!nextLevel) return { current: state.profile.xp, required: 0, percent: 100, canLevelUp: false, nextLevel: state.profile.level }
    const canLevelUp =
      state.profile.xp >= nextLevel.xpRequired &&
      state.profile.daysInGame >= nextLevel.daysRequired
    return {
      current: state.profile.xp,
      required: nextLevel.xpRequired,
      percent: Math.min(100, (state.profile.xp / nextLevel.xpRequired) * 100),
      canLevelUp,
      nextLevel: nextLevel.level,
    }
  }, [state.profile])

  const checkAchievements = useCallback(() => {
    computeUnlockedAchievements(state.profile).forEach(id => dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id }))
  }, [state.profile])

  useEffect(() => {
    computeUnlockedAchievements(state.profile).forEach(id => dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id }))
  }, [state.profile.tasksCompleted, state.profile.streak, state.profile.daysInGame, state.profile.level])

  useEffect(() => {
    const unlockedIds = new Set(state.achievements.filter(a => a.unlocked).map(a => a.id))
    state.skins.forEach(skin => {
      if (skin.unlocked) return
      const byLevel = typeof skin.unlockLevel === 'number' && state.profile.level >= skin.unlockLevel
      const byAchievement = typeof skin.unlockAchievement === 'string' && unlockedIds.has(skin.unlockAchievement)
      if (byLevel || byAchievement) {
        dispatch({ type: 'UNLOCK_SKIN', payload: skin.id })
      }
    })
  }, [state.profile.level, state.achievements])

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