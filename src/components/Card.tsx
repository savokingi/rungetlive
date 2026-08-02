import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  bordered?: boolean
}

export function Card({ children, bordered = true, className = '', style, ...props }: CardProps) {

  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        border: bordered ? '1px solid var(--color-border)' : 'none',
        boxShadow: 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardSection({ children, className = '', style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ padding: '16px', ...style }} {...props}>
      {children}
    </div>
  )
}