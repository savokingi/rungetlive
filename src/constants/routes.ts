export const ROUTES = {
  HOME: '/',
  TASKS: '/tasks',
  AI: '/ai',
  PROFILE: '/profile',
  CHARACTER: '/character',
  CUSTOMIZATION: '/customization',
  ACHIEVEMENTS: '/achievements',
  SETTINGS: '/settings',
} as const

export const TAB_ITEMS = [
  { path: ROUTES.AI, label: 'ИИ' },
  { path: ROUTES.HOME, label: 'Главная' },
  { path: ROUTES.TASKS, label: 'Дела' },
] as const

export const MENU_ITEMS = [
  { path: ROUTES.HOME, label: 'Главная' },
  { path: ROUTES.TASKS, label: 'Дела' },
  { path: ROUTES.AI, label: 'ИИ-ассистент' },
  { path: ROUTES.PROFILE, label: 'Профиль' },
  { path: ROUTES.CHARACTER, label: 'Персонаж' },
  { path: ROUTES.ACHIEVEMENTS, label: 'Достижения' },
  { path: ROUTES.SETTINGS, label: 'Настройки' },
] as const