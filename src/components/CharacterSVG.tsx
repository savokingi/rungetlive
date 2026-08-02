import type { CSSProperties } from 'react'

interface CharacterSVGProps {
  size?: number
  accent?: string
  accentLight?: string
  accentBorder?: string
  animated?: boolean
}

const baseStyles = {
  head: (fill: string) => ({ fill, rx: 14, ry: 14 } as CSSProperties),
  body: (fill: string) => ({ fill, rx: 10, ry: 10 } as CSSProperties),
}

const animStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes floatLegs {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.06; r: 52; }
  50% { opacity: 0.12; r: 56; }
}
@keyframes swingArm {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(-15deg); }
}
@keyframes swingArmBack {
  0%, 100% { transform: rotate(25deg); }
  50% { transform: rotate(10deg); }
}
@keyframes runLegL {
  0%, 100% { transform: rotate(-20deg); }
  50% { transform: rotate(10deg); }
}
@keyframes runLegR {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(-15deg); }
}
@keyframes nod {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(3deg); }
}
@keyframes bookPage {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
@keyframes crownShine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
`

export function CharacterDefault({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="34" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="32" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="32" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M50 40 C53 45, 67 45, 70 40" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterRunner({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'floatLegs 0.4s ease-in-out infinite' } : undefined}>
        <g transform="rotate(10, 60, 72)">
          <rect x="38" y="52" width="44" height="38" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        </g>
        <circle cx="60" cy="30" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M38 26 C38 14, 82 14, 82 26" stroke={accent} strokeWidth="2.5" fill={accent} opacity="0.3" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="28" rx="3" ry="3" fill={accent} />
          <ellipse cx="70" cy="28" rx="3" ry="3" fill={accent} />
        </g>
        <line x1="46" y1="22" x2="54" y2="23" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="66" y1="23" x2="74" y2="22" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M90 20 L100 18 M92 28 L102 27 M88 36 L98 36" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <rect x="76" y="56" width="18" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2"
          style={animated ? { animation: 'swingArm 0.4s ease-in-out infinite', transformOrigin: '85px 60px' } : { transform: 'rotate(-30deg)', transformOrigin: '85px 60px' }} />
        <rect x="24" y="64" width="14" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2"
          style={animated ? { animation: 'swingArmBack 0.4s ease-in-out infinite', transformOrigin: '31px 68px' } : { transform: 'rotate(25deg)', transformOrigin: '31px 68px' }} />
        <rect x="36" y="86" width="10" height="22" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2"
          style={animated ? { animation: 'runLegL 0.4s ease-in-out infinite', transformOrigin: '41px 97px' } : { transform: 'rotate(-20deg)', transformOrigin: '41px 97px' }} />
        <rect x="68" y="82" width="10" height="24" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2"
          style={animated ? { animation: 'runLegR 0.4s ease-in-out infinite', transformOrigin: '73px 94px' } : { transform: 'rotate(15deg)', transformOrigin: '73px 94px' }} />
      </g>
    </svg>
  )
}

export function CharacterScholar({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'nod 4s ease-in-out infinite', transformOrigin: '60px 72px' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="49" cy="30" r="7" fill="none" stroke={accent} strokeWidth="1.5" />
        <circle cx="71" cy="30" r="7" fill="none" stroke={accent} strokeWidth="1.5" />
        <line x1="56" y1="30" x2="64" y2="30" stroke={accent} strokeWidth="1.5" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="49" cy="30" rx="2" ry="2.5" fill={accent} />
          <ellipse cx="71" cy="30" rx="2" ry="2.5" fill={accent} />
        </g>
        <g style={animated ? { animation: 'bookPage 3s ease-in-out infinite' } : undefined}>
          <rect x="44" y="62" width="32" height="24" rx="3" fill={accent} opacity="0.15" stroke={accentBorder} strokeWidth="1" />
          <line x1="60" y1="62" x2="60" y2="86" stroke={accent} strokeWidth="1" opacity="0.3" />
          <line x1="52" y1="70" x2="58" y2="70" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="52" y1="76" x2="58" y2="76" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="62" y1="70" x2="68" y2="70" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="62" y1="76" x2="68" y2="76" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </g>
        <rect x="28" y="60" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="76" y="60" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterMaster({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 4s ease-in-out infinite' } : undefined}>
        <rect x="36" y="52" width="48" height="42" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M36 52 L30 68 L36 64 Z" fill={accent} opacity="0.15" />
        <path d="M84 52 L90 68 L84 64 Z" fill={accent} opacity="0.15" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <g style={animated ? { animation: 'crownShine 2s ease-in-out infinite' } : undefined}>
          <path d="M42 22 L48 8 L54 18 L60 4 L66 18 L72 8 L78 22 Z" fill={accent} stroke={accent} strokeWidth="1" />
          <circle cx="48" cy="14" r="2" fill="white" />
          <circle cx="60" cy="11" r="2" fill="white" />
          <circle cx="72" cy="14" r="2" fill="white" />
        </g>
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="30" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="30" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M50 40 C53 44, 67 44, 70 40" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <rect x="22" y="56" width="16" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="56" width="16" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="90" width="12" height="18" rx="5" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="66" y="90" width="12" height="18" rx="5" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterLegend({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <circle cx="60" cy="56" r="52" fill={accent} opacity="0.06" style={animated ? { animation: 'pulseGlow 3s ease-in-out infinite' } : undefined} />
        <circle cx="60" cy="56" r="44" fill={accent} opacity="0.04" />
        <polygon points="28,18 30,14 32,18 36,20 32,22 30,26 28,22 24,20" fill={accent} opacity="0.5"
          style={animated ? { animation: 'sparkle 2s ease-in-out infinite', transformOrigin: '30px 20px' } : undefined} />
        <polygon points="88,10 89.5,7 91,10 94,11.5 91,13 89.5,16 88,13 85,11.5" fill={accent} opacity="0.4"
          style={animated ? { animation: 'sparkle 2.5s ease-in-out infinite 0.5s', transformOrigin: '89.5px 11.5px' } : undefined} />
        <polygon points="96,36 97,33 98,36 100,37 98,38 97,41 96,38 94,37" fill={accent} opacity="0.3"
          style={animated ? { animation: 'sparkle 3s ease-in-out infinite 1s', transformOrigin: '97px 37px' } : undefined} />
        <rect x="38" y="50" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="28" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <polygon points="60,4 62,11 69,13 63,17 65,24 60,20 55,24 57,17 51,13 58,11" fill={accent} />
        <path d="M46 28 C49 26, 53 26, 56 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M64 28 C67 26, 71 26, 74 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M52 38 C55 41, 65 41, 68 38" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="22" y="54" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(-10, 30, 58)" />
        <rect x="82" y="52" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(10, 90, 56)" />
        <rect x="40" y="86" width="14" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(-15, 47, 91)" />
        <rect x="66" y="86" width="14" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(15, 73, 91)" />
      </g>
    </svg>
  )
}