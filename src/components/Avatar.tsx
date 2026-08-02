import { User } from 'lucide-react'
import { CHARACTER_MAP } from './CharacterSVG'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  skinId?: string
}

const sizeMap = { sm: 32, md: 48, lg: 64, xl: 80, xxl: 120 }

export function Avatar({ src, name, size = 'md', skinId }: AvatarProps) {
  const d = sizeMap[size]
  const fontSize = d * 0.35

  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : ''

  const CharComponent = skinId ? CHARACTER_MAP[skinId] : undefined

  return (
    <div
      style={{
        width: d, height: d, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: CharComponent ? 'transparent' : 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-border))',
        border: CharComponent ? 'none' : '2px solid var(--color-accent-border)',
        color: 'var(--color-accent)',
      }}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : CharComponent ? (
        <CharComponent size={d} />
      ) : initials ? (
        <span style={{ fontWeight: 700, fontSize, lineHeight: 1 }}>{initials}</span>
      ) : (
        <User size={d * 0.5} strokeWidth={1.5} />
      )}
    </div>
  )
}