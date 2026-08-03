import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import { DrawerProvider } from './components/Drawer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ROUTES } from './constants/routes'

const MainScreen = lazy(() => import('./screens/MainScreen').then(m => ({ default: m.MainScreen })))
const TasksScreen = lazy(() => import('./screens/TasksScreen').then(m => ({ default: m.TasksScreen })))
const AIScreen = lazy(() => import('./screens/AIScreen').then(m => ({ default: m.AIScreen })))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })))
const StatsScreen = lazy(() => import('./screens/StatsScreen').then(m => ({ default: m.StatsScreen })))
const SettingsScreen = lazy(() => import('./screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })))
const CharacterScreen = lazy(() => import('./screens/CharacterScreen').then(m => ({ default: m.CharacterScreen })))
const EvolutionScreen = lazy(() => import('./screens/EvolutionScreen').then(m => ({ default: m.EvolutionScreen })))
const AchievementsScreen = lazy(() => import('./screens/AchievementsScreen').then(m => ({ default: m.AchievementsScreen })))

function Loading() {
  return <div style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Загрузка...</div>
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <DrawerProvider>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<MainScreen />} />
                <Route path={ROUTES.TASKS} element={<TasksScreen />} />
                <Route path={ROUTES.AI} element={<AIScreen />} />
                <Route path={ROUTES.PROFILE} element={<ProfileScreen />} />
                <Route path={ROUTES.STATS} element={<StatsScreen />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsScreen />} />
                <Route path={ROUTES.CHARACTER} element={<CharacterScreen />} />
                <Route path={ROUTES.EVOLUTION} element={<EvolutionScreen />} />
                <Route path={ROUTES.CUSTOMIZATION} element={<Navigate to={ROUTES.CHARACTER} replace />} />
                <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsScreen />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </DrawerProvider>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App