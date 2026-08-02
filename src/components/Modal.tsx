import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import type { ReactNode, CSSProperties } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const trapRef = useFocusTrap(isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles: Record<string, CSSProperties> = {
    sm: { maxWidth: '360px' },
    md: { maxWidth: '480px' },
    lg: { maxWidth: '640px' },
    full: { maxWidth: '100%', width: '100%', height: '100%', maxHeight: '100%', borderRadius: 0 },
  }

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex', alignItems: size === 'full' ? 'stretch' : 'center',
      justifyContent: 'center', padding: 16, zIndex: 1000,
    }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div ref={trapRef} style={{
        background: 'var(--color-surface)', borderRadius: size === 'full' ? 0 : 14,
        width: '100%', maxHeight: size === 'full' ? '100%' : '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        ...sizeStyles[size],
      }} onClick={e => e.stopPropagation()}>
        {(title || size === 'full') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 0', flexShrink: 0 }}>
            {title && <h2 id="modal-title" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>{title}</h2>}
            <button onClick={onClose} autoFocus
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)', background: 'transparent',
                border: 'none', cursor: 'pointer', marginLeft: 'auto',
              }}
              aria-label="Закрыть"
            ><X size={20} /></button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>{children}</div>
      </div>
    </div>,
    document.body
  )
}