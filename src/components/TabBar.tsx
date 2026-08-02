import { useLocation, useNavigate } from 'react-router-dom'
import { Bot, Home, CheckSquare2 } from 'lucide-react'
import { TAB_ITEMS } from '../constants/routes'

const iconMap: Record<string, React.ReactNode> = {
  '/ai': <Bot size={22} />,
  '/': <Home size={22} />,
  '/tasks': <CheckSquare2 size={22} />,
}

export function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 'var(--tabbar-height)',
      background: 'var(--color-surface)',
      borderTop: '0.5px solid var(--color-border)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      zIndex: 100,
    }} aria-label="Основная навигация">
      {TAB_ITEMS.map(({ path, label }) => {
        const isActive = location.pathname === path
        return (
          <button key={path} onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '8px 4px',
              background: 'transparent', border: 'none',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              minHeight: 56, minWidth: 44, cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            title={label}
          >
            {iconMap[path]}
          </button>
        )
      })}
    </nav>
  )
}