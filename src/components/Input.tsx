import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export function Input({ label, error, icon, className = '', style, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ width: '100%', ...style }} className={className}>
      {label && (
        <label htmlFor={inputId} style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 12, color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: icon ? '10px 10px 10px 38px' : '10px 14px',
            fontSize: '14px',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            transition: 'var(--transition)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', style, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ width: '100%', ...style }} className={className}>
      {label && (
        <label htmlFor={textareaId} style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: 6, color: 'var(--color-text)' }}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        style={{
          width: '100%',
          minHeight: 100,
          padding: '12px 16px',
          fontSize: '16px',
          fontFamily: 'inherit',
          borderRadius: 'var(--radius)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          transition: 'var(--transition)',
          outline: 'none',
          resize: 'vertical',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)'
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className = '', style, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ width: '100%', ...style }} className={className}>
      {label && (
        <label htmlFor={selectId} style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            transition: 'var(--transition)',
            outline: 'none',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            paddingRight: 36,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          {...props}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}