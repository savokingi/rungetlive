import { ChevronLeft, Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDrawer } from './Drawer'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
}

export function PageHeader({ title, showBack = true, onBack, rightAction }: PageHeaderProps) {
  const navigate = useNavigate()
  const { open: openDrawer } = useDrawer()

  const canGoBack = showBack && (window.history.state?.idx ?? 0) > 0
  const usesBack = onBack || canGoBack

  const handleClick = onBack
    ? onBack
    : canGoBack
      ? () => navigate(-1)
      : openDrawer

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--header-height)', zIndex: 50,
        display: 'flex', alignItems: 'center', padding: '0 16px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: 'var(--color-surface)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--radius)', border: 'none', background: 'transparent', cursor: 'pointer',
          color: 'var(--color-accent)', marginLeft: -8, flexShrink: 0,
        }}
        aria-label={usesBack ? 'Назад' : 'Меню'}
      >
        {canGoBack ? <ChevronLeft size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
      </button>
      <h1 style={{
        flex: 1, textAlign: 'center', fontSize: '14px', fontWeight: 500,
        color: 'var(--color-text)', letterSpacing: '-0.1px',
      }}>
        {title}
      </h1>
      <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction}
      </div>
    </header>
  )
}