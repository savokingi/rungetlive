import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { MENU_ITEMS, ROUTES } from '../constants/routes'
import { Home, CheckSquare2, Bot, User, Sparkles, Trophy, Settings } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  [ROUTES.HOME]: <Home size={20} />,
  [ROUTES.TASKS]: <CheckSquare2 size={20} />,
  [ROUTES.AI]: <Bot size={20} />,
  [ROUTES.PROFILE]: <User size={20} />,
  [ROUTES.CHARACTER]: <Sparkles size={20} />,
  [ROUTES.ACHIEVEMENTS]: <Trophy size={20} />,
  [ROUTES.SETTINGS]: <Settings size={20} />,
}

interface DrawerContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const DrawerContext = createContext<DrawerContextType | null>(null)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <DrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
      <DrawerWindow isOpen={isOpen} onClose={close} />
    </DrawerContext.Provider>
  )
}

export function useDrawer(): DrawerContextType {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider')
  return ctx
}

function DrawerWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
      document.body.style.overflow = 'hidden'
    } else {
      setAnimating(false)
      setTimeout(() => { setVisible(false); document.body.style.overflow = '' }, 200)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const handleNav = (path: string) => {
    navigate(path)
    onClose()
  }

  if (!visible) return null

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }} role="dialog" aria-modal="true">
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--overlay-bg)',
        transition: 'opacity 0.2s ease', opacity: animating ? 1 : 0,
      }} onClick={onClose} />
      <div style={{
        width: 280, maxWidth: '85vw', height: '100%',
        background: 'var(--color-surface)', display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s ease',
        transform: animating ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 12px 20px',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
              {state.profile.name}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Уровень {state.profile.level} · {state.profile.xp} XP
            </p>
          </div>
          <button onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-secondary)', cursor: 'pointer', flexShrink: 0,
            }}
            aria-label="Закрыть меню"
          ><X size={20} /></button>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', overflow: 'auto' }} aria-label="Навигация">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MENU_ITEMS.map(({ path, label }) => {
              const isActive = location.pathname === path
              return (
                <li key={path}>
                  <button onClick={() => handleNav(path)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-accent-light)' : 'transparent',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                      fontWeight: isActive ? 600 : 400, fontSize: '15px',
                      textAlign: 'left', cursor: 'pointer', border: 'none',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {iconMap[path]}
                    {label}
                    {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }} />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ padding: '12px 20px', borderTop: '0.5px solid var(--color-border)' }}>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', letterSpacing: '0.2px' }}>
            RunGetLife v0.1.0
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}