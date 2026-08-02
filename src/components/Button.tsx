import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  flex?: number | string
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  flex,
  children,
  disabled,
  className = '',
  style = {},
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 'none',
    borderRadius: 'var(--radius-btn)',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    opacity: loading || disabled ? 0.5 : 1,
    transition: 'var(--transition)',
    width: fullWidth ? '100%' : 'auto',
    flex: flex ?? '0 1 auto',
    ...style,
  }

  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: 'white',
    },
    secondary: {
      background: 'var(--color-accent-light)',
      color: 'var(--color-accent)',
      border: '1px solid var(--color-accent-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: 'white',
    },
  }

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '12px', height: 32 },
    md: { padding: '10px 20px', fontSize: '13px', height: 40 },
    lg: { padding: '14px 28px', fontSize: '14px', height: 48 },
  }

  return (
    <button
      className={className}
      style={{ ...baseStyle, ...variants[variant], ...sizes[size] }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
        </svg>
      ) : leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}