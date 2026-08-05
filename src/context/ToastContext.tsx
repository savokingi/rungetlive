import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface Toast {
  id: number
  text: string
  kind: 'info' | 'success'
}

interface ToastContextType {
  showToast: (text: string, kind?: 'info' | 'success') => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((text: string, kind: 'info' | 'success' = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, text, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', top: 'calc(var(--header-height) + 8px)', left: 0, right: 0, zIndex: 2000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        pointerEvents: 'none', padding: '0 16px',
      }}>
        {toasts.map(t => (
          <div key={t.id} role="status" style={{
            animation: 'slideUp 0.25s ease', pointerEvents: 'auto', maxWidth: '100%',
            padding: '10px 16px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
            background: t.kind === 'success' ? 'var(--color-accent)' : 'var(--color-surface)',
            color: t.kind === 'success' ? 'white' : 'var(--color-text)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            border: t.kind === 'success' ? 'none' : '0.5px solid var(--color-border)',
            fontSize: 13, fontWeight: 500,
          }}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
