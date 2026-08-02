import type { CSSProperties, ReactElement } from 'react'

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
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes haloPulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.5; }
}
@keyframes fuelFloat {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 0.8; }
}
`

/* ============================================================
 * LEVEL CHARACTERS — Adam progression (Chad-o-Meter), tiers 1..10.
 * Same person, scaling "aura": posture, shoulders, glow, crown.
 * ============================================================ */

function CharacterAdamCore(props: CharacterSVGProps & { tier: number }) {
  const { tier, ...rest } = props
  const t = Math.max(1, Math.min(10, tier))
  const t1 = (t - 1) / 9
  const lerp = (a: number, b: number) => a + (b - a) * t1
  const {
    size: sz = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)',
    accentBorder = 'var(--color-accent-border)', animated,
  } = rest

  const L = 60
  const r = (v: number) => Math.round(v * 10) / 10
  const X = (dx: number) => `${r(L + dx)}`

  // Progression metrics (tier 1 -> 10): shoulders widen, neck thickens,
  // torso fills out, arms thicken, muscle detail increases, posture straightens.
  const shoulder = lerp(13.5, 24)
  const chest = lerp(9.5, 14.5)
  const waistH = lerp(7.6, 9.4)
  const hipH = lerp(8.2, 10)
  const neckH = lerp(3.4, 4.6)
  const armU = lerp(2.7, 3.9)
  const armF = lerp(1.8, 2.5)
  const deltR = lerp(3.1, 4.6)
  const mus = lerp(0, 0.9)
  const slump = lerp(7, 0)
  const aura = t < 3 ? 0 : (t - 2) * 0.012
  const halo = t >= 2
  const crown = t >= 9
  const sparkle = t >= 7
  const definedJaw = t >= 6

  // Realistic-style palette
  const SK_L = '#f3cba2'
  const SK_D = '#e1a575'
  const SHAD = '#c78a5b'
  const HAIR = '#2c241d'
  const SHORT = '#33383f'
  const SHOE = '#20222a'
  const INK = '#1b150e'

  const dxsL = [-3, -7, -(shoulder - 1), -(shoulder - 1), -chest, -chest, -(waistH + 1), -waistH, -waistH, 0]
  const dysT = [33, 38, 41, 44, 49, 54, 60, 64, 68, 70]
  const torsoLeft = dxsL.map((dx, i) => `${X(dx)} ${dysT[i]}`).join(' L ')
  const dxR = dxsL.slice().reverse()
  const dyR = dysT.slice().reverse()
  const torsoRight = dxR.map((dx, i) => `${X(-dx)} ${dyR[i]}`).join(' L ')
  const torsoPath = `M ${torsoLeft} L ${torsoRight} Z`

  const grad = `adamSkin_${tier}_${sz}`

  return (
    <svg width={sz} height={sz} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={SK_L} />
          <stop offset="50%" stopColor={SK_D} />
          <stop offset="100%" stopColor={SHAD} />
        </linearGradient>
      </defs>
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        {aura > 0 && (
          <circle cx="60" cy="58" r={Math.min(58, 46 + aura * 130)} fill={accent} opacity={0.05 + aura * 3}
            style={animated ? { animation: 'pulseGlow 3s ease-in-out infinite' } : undefined} />
        )}
        <g transform={`rotate(${-r(slump)} 60 70)`}>
          {aura > 0 && (
            <ellipse cx="60" cy="114" rx={r(10 + shoulder * 0.7)} ry="3.2" fill={accent} opacity={0.3 + aura} />
          )}

          {/* ==== LEGS ==== */}
          <g>
            <path d={`M ${X(hipH - 4.5)} 72 L ${X(hipH + 1)} 72 Q ${X(hipH + 2.5)} 86 ${X(hipH + 1)} 91 L ${X(hipH + 1.6)} 101 L ${X(hipH + 0.5)} 105 L ${X(-4)} 105 L ${X(-3.5)} 101 Q ${X(-2)} 95 ${X(hipH - 3)} 90 Z`}
              fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.6" />
            <path d={`M ${X(-hipH + 4.5)} 72 L ${X(-hipH - 1)} 72 Q ${X(-hipH - 2.5)} 86 ${X(-hipH - 1)} 91 L ${X(-hipH - 1.6)} 101 L ${X(-hipH - 0.5)} 105 L ${X(4)} 105 L ${X(3.5)} 101 Q ${X(2)} 95 ${X(hipH - 4)} 87 Z`}
              fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.6" />
            {mus > 0.3 && (
              <g opacity={mus * 0.5}>
                <path d={`M ${X(chest - 3.5)} 78 L ${X(4.5)} 92 L ${X(1)} 92 Z`} fill="#fff" opacity="0.35" />
                <path d={`M ${X(-chest + 3.5)} 78 L ${X(-4.5)} 92 L ${X(-1)} 92 Z`} fill="#fff" opacity="0.35" />
              </g>
            )}
            <rect x={X(6)} y="105" width="16" height="7" rx="3.2" fill={SHOE} transform="rotate(-5 68 108)" />
            <rect x={X(-6)} y="105" width="16" height="7" rx="3.2" fill={SHOE} transform="rotate(5 52 108)" />
          </g>

          {/* ==== SHORTS ==== */}
          <path d={`M ${X(-hipH)} 60 L ${X(hipH)} 60 Q ${X(hipH + 1)} 64 ${X(hipH + 0.5)} 73 Q ${X(hipH)} 81 ${X(hipH - 1.5)} 85 L ${X(7)} 86 L ${X(-7)} 86 L ${X(-hipH + 1.5)} 85 Q ${X(-hipH)} 81 ${X(-hipH - 0.5)} 73 Q ${X(-hipH - 1)} 64 ${X(-hipH)} 60 Z`}
            fill={SHORT} stroke={`rgba(0,0,0,0.3)`} strokeWidth="0.7" />
          <rect x={X(-hipH)} y="58.5" width={hipH * 2} height="3.4" rx="1.7" fill={accent} />
          {t >= 3 && (
            <path d={`M ${X(-hipH + 1)} 74 Q ${X(0)} 80 ${X(hipH - 1)} 74`} fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
          )}

          {/* ==== LEFT ARM ==== */}
          <path d={`M ${X(-shoulder + 2)} 42 L ${X(-shoulder + 4)} 55 L ${X(-shoulder + 2)} 66`} stroke={SK_D} strokeWidth={armU * 2} strokeLinecap="round" fill="none" />
          <path d={`M ${X(-shoulder + 2)} 66 L ${X(-shoulder + 1)} 84 L ${X(-shoulder + 0.5)} 95`} stroke={SK_D} strokeWidth={armF * 2} strokeLinecap="round" fill="none" />
          <circle cx={X(-shoulder + 0.5)} cy="96.5" r="2.3" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
          <circle cx={X(-shoulder + 3)} cy="45" r={deltR} fill={SK_L} stroke={SHAD} strokeWidth="0.6" />
          {mus > 0.35 && (
            <ellipse cx={X(-shoulder + 2)} cy="60" rx="2.6" ry="4.8" fill="#fff" opacity={mus * 0.25} transform={`rotate(-15 ${X(-shoulder + 2)} 60)`} />
          )}

          {/* ==== RIGHT ARM ==== */}
          <path d={`M ${X(shoulder - 2)} 42 L ${X(shoulder - 2)} 55 L ${X(shoulder - 1)} 66`} stroke={SK_D} strokeWidth={armU * 2} strokeLinecap="round" fill="none" />
          <path d={`M ${X(shoulder - 1)} 66 L ${X(shoulder)} 84 L ${X(shoulder + 0.5)} 95`} stroke={SK_D} strokeWidth={armF * 2} strokeLinecap="round" fill="none" />
          <circle cx={X(shoulder + 0.5)} cy="96.5" r="2.3" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
          <circle cx={X(shoulder - 3)} cy="44" r={deltR} fill={SK_L} stroke={SHAD} strokeWidth="0.6" />
          {mus > 0.35 && (
            <ellipse cx={X(shoulder - 2)} cy="60" rx="2.6" ry="4.8" fill="#fff" opacity={mus * 0.25} transform={`rotate(15 ${X(shoulder - 2)} 60)`} />
          )}

          {/* ==== NECK + TRAPS ==== */}
          <path d={`M ${X(-neckH)} 30 L ${X(neckH)} 30 L ${X(neckH)} 41 L ${X(-neckH)} 41 Z`} fill={SK_D} stroke={SHAD} strokeWidth="0.6" />
          {t >= 3 && (
            <g opacity="0.9">
              <path d={`M ${X(-neckH + 0.5)} 37 Q ${X(-shoulder + 2)} 39 ${X(-shoulder + 1)} 43`} stroke={SK_L} strokeWidth={3} strokeLinecap="round" fill="none" />
              <path d={`M ${X(neckH - 0.5)} 37 Q ${X(shoulder - 2)} 39 ${X(shoulder - 1)} 43`} stroke={SK_L} strokeWidth={3} strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* ==== TORSO ==== */}
          <path d={torsoPath} fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.9" />
          {mus > 0.1 && (
            <g opacity={0.15 + mus * 0.6}>
              <path d={`M ${X(-chest + 2)} 47 Q ${X(-1.5)} 53 ${X(0)} 53`} stroke={SHAD} strokeWidth="1.1" strokeLinecap="round" fill="none" />
              <path d={`M ${X(chest - 2)} 47 Q ${X(1.5)} 53 ${X(0)} 53`} stroke={SHAD} strokeWidth="1.1" strokeLinecap="round" fill="none" />
              <path d={`M ${X(-chest + 3)} 45 L ${X(chest - 3)} 45`} stroke={SHAD} strokeWidth="0.9" opacity="0.7" />
            </g>
          )}
          {mus > 0.15 && (
            <g opacity={mus}>
              {[50.5, 56.5, 62.5].map((yy, ri) => (
                <g key={ri}>
                  <rect x={X(-4)} y={yy} width="4.6" height="4.2" rx="1.3" fill={SHAD} opacity="0.7" />
                  <rect x={X(-0.6)} y={yy} width="4.6" height="4.2" rx="1.3" fill={SHAD} opacity="0.7" />
                </g>
              ))}
              {[50.5, 56.5, 62.5].map((yy, ri) => (
                <line key={ri} x1={X(-4.7)} y1={yy + 4.1} x2={X(4.7)} y2={yy + 4.1} stroke={SHAD} strokeWidth="0.5" opacity="0.5" />
              ))}
            </g>
          )}

          {/* ==== HEAD ==== */}
          <g>
            <circle cx="48.6" cy="24" r="2.1" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
            <circle cx="71.4" cy="24" r="2.1" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
            <circle cx="60" cy="22" r="12.5" fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.8" />
            {/* hair */}
            <path d={`M 47.5 20 Q 46.5 4 60 2.5 Q 73.5 4 72.5 20 Q 62 26 47.5 20 Z`} fill={HAIR} />
            <path d={`M 50 18.5 Q 60 15.5 70 18.5`} stroke={HAIR} strokeWidth="1" opacity="0.6" fill="none" />
            {/* brows */}
            <path d="M 51.5 17 L 57 17.5" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
            <path d="M 68.5 17 L 63 17.5" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
            {/* eyes */}
            <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
              <circle cx="54.7" cy="20.5" r="1.5" fill={INK} />
              <circle cx="65.3" cy="20.5" r="1.5" fill={INK} />
              <circle cx="55.3" cy="20" r="0.5" fill="#fff" opacity="0.9" />
              <circle cx="65.9" cy="20" r="0.5" fill="#fff" opacity="0.9" />
            </g>
            {/* nose */}
            <path d="M 60 22 L 60 24.6 L 59.1 24.9" stroke={INK} strokeWidth="0.7" strokeLinecap="round" opacity="0.8" />
            {/* mouth */}
            <path d={`M 56.6 26.4 Q 60 ${definedJaw ? 28.4 : 27.4} 63.4 26.4`} stroke={INK} strokeWidth="0.8" strokeLinecap="round" />
            {/* jaw */}
            {definedJaw && (
              <path d={`M 48 26 Q 54 31 60 31 Q 66 31 72 26`} fill="none" stroke={SHAD} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
            )}
          </g>

          {/* ==== EXTRAS ==== */}
          {halo && (
            <g opacity="0.85">
              <ellipse cx="60" cy="4.5" rx="16" ry="3.6" fill="none" stroke={accent} strokeWidth="1.4" />
              <rect x="53" y="7.2" width="14" height="2.6" rx="1.3" fill={accent} />
            </g>
          )}
          {crown && (
            <path d="M 41 16 L 60 0 L 79 16 Q 69 20 60 19 Q 51 20 41 16 Z" fill={accent} />
          )}
          {sparkle && (
            <g>
              <polygon points="92,14 94,10 96,14 100,16 96,18 94,22 92,18 88,16" fill={accent} opacity="0.5"
                style={animated ? { animation: 'sparkle 2s ease-in-out infinite', transformOrigin: '94px 16px' } : undefined} />
              <polygon points="24,40 26,36 28,40 31,42 28,44 26,48 24,44 21,42" fill={accent} opacity="0.4"
                style={animated ? { animation: 'sparkle 2.4s ease-in-out infinite 0.6s', transformOrigin: '26px 42px' } : undefined} />
            </g>
          )}
          {aura > 0 && (
            <ellipse cx="60" cy="60" rx={chest * 0.6} ry={waistH * 0.8} fill="none" stroke={accent} strokeWidth="1" opacity={0.15 + aura * 2} strokeDasharray="3 3" />
          )}
        </g>
      </g>
    </svg>
  )
}

export function CharacterAdam1(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={1} /> }
export function CharacterAdam2(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={2} /> }
export function CharacterAdam3(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={3} /> }
export function CharacterAdam4(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={4} /> }
export function CharacterAdam5(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={5} /> }
export function CharacterAdam6(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={6} /> }
export function CharacterAdam7(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={7} /> }
export function CharacterAdam8(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={8} /> }
export function CharacterAdam9(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={9} /> }
export function CharacterAdam10(p: CharacterSVGProps) { return <CharacterAdamCore {...p} tier={10} /> }

/* ============================================================
 * ACHIEVEMENT — themed characters (specialized, "обратные")
 * ============================================================ */

type ThemedVariant =
  | 'default' | 'runner' | 'scholar' | 'chef' | 'artist' | 'warrior'
  | 'explorer' | 'musician' | 'doctor' | 'business' | 'astronaut' | 'master' | 'legend'

function HumanFigure({
  size = 120,
  accent = 'var(--color-accent)',
  accentLight = 'var(--color-accent-light)',
  accentBorder = 'var(--color-accent-border)',
  animated,
  variant = 'default',
}: CharacterSVGProps & { variant?: ThemedVariant }) {
  const L = 60
  const r = (v: number) => Math.round(v * 10) / 10
  const X = (dx: number) => `${r(L + dx)}`
  const v = (n: ThemedVariant) => variant === n

  // Balanced athletic human base
  const shoulder = 18
  const chest = 12.5
  const waistH = 8.6
  const hipH = 9.2
  const neckH = 4
  const armU = 3.4
  const armF = 2.2
  const deltR = 3.9
  const mus = 0.55

  const SK_L = '#f3cba2'
  const SK_D = '#e1a575'
  const SHAD = '#c78a5b'
  const HAIR = '#2c241d'
  const SHORT = '#33383f'
  const SHOE = '#20222a'
  const INK = '#1b150e'
  const grad = `human_${variant}_${size}`

  // Torso silhouette
  const dxsL = [-3, -7, -(shoulder - 1), -(shoulder - 1), -chest, -chest, -(waistH + 1), -waistH, -waistH, 0]
  const dysT = [33, 38, 41, 44, 49, 54, 60, 64, 68, 70]
  const torsoL = dxsL.map((dx, i) => `${X(dx)} ${dysT[i]}`).join(' L ')
  const dxR = dxsL.slice().reverse()
  const dyR = dysT.slice().reverse()
  const torsoR = dxR.map((dx, i) => `${X(-dx)} ${dyR[i]}`).join(' L ')
  const torsoPath = `M ${torsoL} L ${torsoR} Z`

  // Arm limb strings (reused for sleeves)
  const armTopL = `M ${X(-shoulder + 2)} 42 L ${X(-shoulder + 4)} 55 L ${X(-shoulder + 2)} 66`
  const armLowL = `M ${X(-shoulder + 2)} 66 L ${X(-shoulder + 1)} 84 L ${X(-shoulder + 0.5)} 95`
  const armTopR = `M ${X(shoulder - 2)} 42 L ${X(shoulder - 2)} 55 L ${X(shoulder - 1)} 66`
  const armLowR = `M ${X(shoulder - 1)} 66 L ${X(shoulder)} 84 L ${X(shoulder + 0.5)} 95`

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={SK_L} />
          <stop offset="50%" stopColor={SK_D} />
          <stop offset="100%" stopColor={SHAD} />
        </linearGradient>
      </defs>
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        {v('legend') && (
          <circle cx="60" cy="56" r="52" fill={accent} opacity="0.07"
            style={animated ? { animation: 'pulseGlow 3s ease-in-out infinite' } : undefined} />
        )}

        {/* ==== LEGS ==== */}
        <g>
          <path d={`M ${X(hipH - 4.5)} 72 L ${X(hipH + 1)} 72 Q ${X(hipH + 2.5)} 86 ${X(hipH + 1)} 91 L ${X(hipH + 1.6)} 101 L ${X(hipH + 0.5)} 105 L ${X(-4)} 105 L ${X(-3.5)} 101 Q ${X(-2)} 95 ${X(hipH - 3)} 90 Z`}
            fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.6" />
          <path d={`M ${X(-hipH + 4.5)} 72 L ${X(-hipH - 1)} 72 Q ${X(-hipH - 2.5)} 86 ${X(-hipH - 1)} 91 L ${X(-hipH - 1.6)} 101 L ${X(-hipH - 0.5)} 105 L ${X(4)} 105 L ${X(3.5)} 101 Q ${X(2)} 95 ${X(hipH - 4)} 87 Z`}
            fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.6" />
          <g opacity={mus * 0.5}>
            <path d={`M ${X(chest - 3.5)} 78 L ${X(4.5)} 92 L ${X(1)} 92 Z`} fill="#fff" opacity="0.35" />
            <path d={`M ${X(-chest + 3.5)} 78 L ${X(-4.5)} 92 L ${X(-1)} 92 Z`} fill="#fff" opacity="0.35" />
          </g>
          <rect x={X(6)} y="105" width="16" height="7" rx="3.2" fill={SHOE} transform="rotate(-5 68 108)" />
          <rect x={X(-6)} y="105" width="16" height="7" rx="3.2" fill={SHOE} transform="rotate(5 52 108)" />
        </g>

        {/* ==== SHORTS ==== */}
        <path d={`M ${X(-hipH)} 60 L ${X(hipH)} 60 Q ${X(hipH + 1)} 64 ${X(hipH + 0.5)} 73 Q ${X(hipH)} 81 ${X(hipH - 1.5)} 85 L ${X(7)} 86 L ${X(-7)} 86 L ${X(-hipH + 1.5)} 85 Q ${X(-hipH)} 81 ${X(-hipH - 0.5)} 73 Q ${X(-hipH - 1)} 64 ${X(-hipH)} 60 Z`}
          fill={SHORT} stroke={`rgba(0,0,0,0.3)`} strokeWidth="0.7" />
        <rect x={X(-hipH)} y="58.5" width={hipH * 2} height="3.4" rx="1.7" fill={accent} />
        <path d={`M ${X(-hipH + 1)} 74 Q ${X(0)} 80 ${X(hipH - 1)} 74`} fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

        {/* ==== ARMS ==== */}
        <circle cx={X(-shoulder + 3)} cy="45" r={deltR} fill={SK_L} stroke={SHAD} strokeWidth="0.6" />
        <circle cx={X(shoulder - 3)} cy="44" r={deltR} fill={SK_L} stroke={SHAD} strokeWidth="0.6" />
        <path d={armTopL} stroke={SK_D} strokeWidth={armU * 2} strokeLinecap="round" fill="none" />
        <path d={armTopR} stroke={SK_D} strokeWidth={armU * 2} strokeLinecap="round" fill="none" />
        <path d={armLowL} stroke={SK_D} strokeWidth={armF * 2} strokeLinecap="round" fill="none" />
        <path d={armLowR} stroke={SK_D} strokeWidth={armF * 2} strokeLinecap="round" fill="none" />
        <circle cx={X(-shoulder + 0.5)} cy="96.5" r="2.3" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
        <circle cx={X(shoulder + 0.5)} cy="96.5" r="2.3" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
        <ellipse cx={X(-shoulder + 2)} cy="60" rx="2.6" ry="4.8" fill="#fff" opacity={mus * 0.2} transform={`rotate(-15 ${X(-shoulder + 2)} 60)`} />
        <ellipse cx={X(shoulder - 2)} cy="60" rx="2.6" ry="4.8" fill="#fff" opacity={mus * 0.2} transform={`rotate(15 ${X(shoulder - 2)} 60)`} />

        {/* ==== NECK + TRAPS ==== */}
        <path d={`M ${X(-neckH)} 30 L ${X(neckH)} 30 L ${X(neckH)} 41 L ${X(-neckH)} 41 Z`} fill={SK_D} stroke={SHAD} strokeWidth="0.6" />
        <g opacity="0.9">
          <path d={`M ${X(-neckH + 0.5)} 37 Q ${X(-shoulder + 2)} 39 ${X(-shoulder + 1)} 43`} stroke={SK_L} strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d={`M ${X(neckH - 0.5)} 37 Q ${X(shoulder - 2)} 39 ${X(shoulder - 1)} 43`} stroke={SK_L} strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>

        {/* ==== TORSO ==== */}
        <path d={torsoPath} fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.9" />
        <g opacity={0.15 + mus * 0.6}>
          <path d={`M ${X(-chest + 2)} 47 Q ${X(-1.5)} 53 ${X(0)} 53`} stroke={SHAD} strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d={`M ${X(chest - 2)} 47 Q ${X(1.5)} 53 ${X(0)} 53`} stroke={SHAD} strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d={`M ${X(-chest + 3)} 45 L ${X(chest - 3)} 45`} stroke={SHAD} strokeWidth="0.9" opacity="0.7" />
        </g>
        <g opacity={mus}>
          {[50.5, 56.5, 62.5].map((yy, ri) => (
            <g key={ri}>
              <rect x={X(-4)} y={yy} width="4.6" height="4.2" rx="1.3" fill={SHAD} opacity="0.7" />
              <rect x={X(-0.6)} y={yy} width="4.6" height="4.2" rx="1.3" fill={SHAD} opacity="0.7" />
            </g>
          ))}
          {[50.5, 56.5, 62.5].map((yy, ri) => (
            <line key={ri} x1={X(-4.7)} y1={yy + 4.1} x2={X(4.7)} y2={yy + 4.1} stroke={SHAD} strokeWidth="0.5" opacity="0.5" />
          ))}
        </g>

        {/* ==== HEAD ==== */}
        <g>
          {!v('astronaut') && (
            <>
              <circle cx="48.6" cy="24" r="2.1" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
              <circle cx="71.4" cy="24" r="2.1" fill={SK_L} stroke={SHAD} strokeWidth="0.5" />
            </>
          )}
          <circle cx="60" cy="22" r="12.5" fill={`url(#${grad})`} stroke={SHAD} strokeWidth="0.8" />
          <path d={`M 47.5 20 Q 46.5 4 60 2.5 Q 73.5 4 72.5 20 Q 62 26 47.5 20 Z`} fill={HAIR} />
          <path d="M 50 18.5 Q 60 15.5 70 18.5" stroke={HAIR} strokeWidth="1" opacity="0.6" fill="none" />
          <path d="M 51.5 17 L 56 17.5" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
          <path d="M 68.5 17 L 63 17.5" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
          <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
            <circle cx="54.7" cy="20.5" r="1.5" fill={INK} />
            <circle cx="65.3" cy="20.5" r="1.5" fill={INK} />
            <circle cx="55.3" cy="20" r="0.5" fill="#fff" opacity="0.9" />
            <circle cx="65.9" cy="20" r="0.5" fill="#fff" opacity="0.9" />
          </g>
          <path d="M 60 22 L 60 24.6 L 59.1 24.9" stroke={INK} strokeWidth="0.7" strokeLinecap="round" opacity="0.8" />
          <path d="M 56.8 26.2 Q 60 27.6 63.2 26.2" stroke={INK} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M 48.5 26 Q 55 30.5 60 30.5 Q 65 30.5 71.5 26" fill="none" stroke={SHAD} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* ==== ACCESSORIES ==== */}
        {v('runner') && (
          <g>
            <path d="M 47 15 Q 60 11.5 73 15" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M 47 15 L 60 13 M 73 15 L 60 13" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 30 26 L 14 22 M 34 34 L 17 30 M 32 42 L 20 42 M 30 50 L 22 49" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          </g>
        )}
        {v('scholar') && (
          <g>
            <circle cx="53" cy="20.5" r="5.2" fill="none" stroke={accent} strokeWidth="1.3" />
            <circle cx="67" cy="20.5" r="5.2" fill="none" stroke={accent} strokeWidth="1.3" />
            <line x1="58.2" y1="20.5" x2="61.8" y2="20.5" stroke={accent} strokeWidth="1.3" />
            <line x1="47.8" y1="19.8" x2="45" y2="18" stroke={accent} strokeWidth="1.2" />
            <line x1="72.2" y1="19.8" x2="75" y2="18" stroke={accent} strokeWidth="1.2" />
            <path d={`M ${X(-shoulder - 1)} 58 L ${X(-shoulder + 5)} 58 L ${X(-shoulder + 3)} 80 L ${X(-shoulder - 2)} 80 Z`} fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <line x1={X(-shoulder + 1)} y1="60" x2={X(-shoulder + 1)} y2="78" stroke={accent} strokeWidth="0.8" opacity="0.4" />
          </g>
        )}
        {v('chef') && (
          <g>
            <path d="M 44 22 Q 43 3 60 0.5 Q 77 3 76 22 Q 60 25 44 22 Z" fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <circle cx="60" cy="5" r="5" fill="#fff" />
            <rect x="45" y="14" width="30" height="5" rx="2.5" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
            <path d="M 50 46 L 70 46 L 72 70 L 64 66 Q 60 74 56 66 L 48 70 Z" fill="rgba(250,247,240,0.92)" stroke={accentBorder} strokeWidth="1" />
            <path d="M 50 48 L 52 60 L 56 55 M 70 48 L 68 60 L 64 55" stroke={accentBorder} strokeWidth="0.8" fill="none" opacity="0.7" />
          </g>
        )}
        {v('artist') && (
          <g>
            <ellipse cx="60" cy="13" rx="15" ry="5.5" fill={accentLight} stroke={accentBorder} strokeWidth="1" transform="rotate(-8 60 13)" />
            <circle cx="60" cy="11.5" r="3.2" fill={accent} />
            <ellipse cx="34" cy="64" rx="11" ry="8" fill={accentLight} stroke={accentBorder} strokeWidth="1" transform="rotate(-15 34 64)" />
            <circle cx="30" cy="62" r="2" fill="#f87171" />
            <circle cx="35" cy="60" r="2" fill="#facc15" />
            <circle cx="40" cy="62" r="2" fill="#22c55e" />
            <circle cx="35" cy="66" r="2" fill="#3b82f6" />
            <path d="M 78 44 L 92 30" stroke={SK_D} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="93.5" cy="29" r="2.4" fill={accent} />
          </g>
        )}
        {v('warrior') && (
          <g>
            <path d="M 86 8 L 62 74 M 84 8 L 64 74" stroke="#c9cfd6" strokeWidth="4" strokeLinecap="round" />
            <path d="M 80 12 H 92 M 76 46 L 88 46" stroke="#ffd25e" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="89" cy="10" r="4" fill={accent} />
            <circle cx="30" cy="62" r="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
            <circle cx="30" cy="62" r="7.5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.8" />
            <path d="M 42 20 L 60 4 L 78 20 Z" fill={accent} opacity="0.85" />
          </g>
        )}
        {v('explorer') && (
          <g>
            <ellipse cx="60" cy="15" rx="22" ry="5" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <path d="M 46 15 L 46 4 Q 60 0 74 4 L 74 15 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <rect x="46" y="12.5" width="28" height="3" rx="1.5" fill={accent} />
            <circle cx="60" cy="52" r="6" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
            <path d="M 60 47.5 L 62 52 L 60 56.5 L 58 52 Z" fill={accent} />
            <path d="M 47 45 L 55 60 M 73 45 L 65 60" stroke={accent} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          </g>
        )}
        {v('musician') && (
          <g>
            <path d="M 47 24 A 13.5 13.5 0 0 1 73 24" fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round" />
            <rect x="42.5" y="21" width="9" height="8" rx="3.5" fill={accent} />
            <rect x="68.5" y="21" width="9" height="8" rx="3.5" fill={accent} />
            <g style={animated ? { animation: 'float 2.4s ease-in-out infinite' } : undefined}>
              <circle cx="87" cy="26" r="4.2" fill={accent} />
              <rect x="88" y="22" width="3" height="12" rx="1.5" fill={accent} />
            </g>
          </g>
        )}
        {v('doctor') && (
          <g>
            <path d={torsoPath} fill="rgba(255,255,255,0.9)" stroke={accentBorder} strokeWidth="1" />
            <path d="M 58 35 L 58 58 M 62 35 L 62 58" stroke={accentLight} strokeWidth="4" strokeLinecap="round" />
            <rect x="50" y="11" width="20" height="5.5" rx="2.5" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
            <rect x="58.2" y="8" width="3.6" height="12" fill={accent} />
            <rect x="54" y="12" width="12" height="3.6" fill={accent} />
            <path d="M 48 47 Q 41 58 51 63 M 72 47 Q 79 58 69 63" stroke={accent} strokeWidth="1.6" fill="none" />
            <circle cx="60" cy="65" r="5.5" fill="none" stroke={accent} strokeWidth="1.6" />
          </g>
        )}
        {v('business') && (
          <g>
            <path d={torsoPath} fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <path d="M 46 44 L 60 68 L 74 44 Z" fill="#fff" opacity="0.9" stroke={accentBorder} strokeWidth="0.8" />
            <path d="M 56 46 L 64 46 L 60 66 Z" fill={accent} />
            <path d={armTopL} stroke={accentLight} strokeWidth={armU * 2.6} strokeLinecap="round" fill="none" />
            <path d={armTopR} stroke={accentLight} strokeWidth={armU * 2.6} strokeLinecap="round" fill="none" />
            <path d={armLowL} stroke={accentLight} strokeWidth={armF * 2.4} strokeLinecap="round" fill="none" />
            <path d={armLowR} stroke={accentLight} strokeWidth={armF * 2.4} strokeLinecap="round" fill="none" />
            <rect x="27" y="62" width="15" height="12" rx="3" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
            <rect x="32" y="60" width="5" height="3" rx="1" fill={accent} />
          </g>
        )}
        {v('astronaut') && (
          <g>
            <path d={torsoPath} fill="rgba(235,239,246,0.94)" stroke="rgba(120,130,150,0.6)" strokeWidth="1" />
            <path d={armTopL} stroke="#e8ecf2" strokeWidth={armU * 2.6} strokeLinecap="round" fill="none" />
            <path d={armTopR} stroke="#e8ecf2" strokeWidth={armU * 2.6} strokeLinecap="round" fill="none" />
            <path d={armLowL} stroke="#e8ecf2" strokeWidth={armF * 2.4} strokeLinecap="round" fill="none" />
            <path d={armLowR} stroke="#e8ecf2" strokeWidth={armF * 2.4} strokeLinecap="round" fill="none" />
            <circle cx="60" cy="23" r="16.5" fill="rgba(238,242,247,0.95)" stroke={accentBorder} strokeWidth="1.4" />
            <path d="M 48.5 24 Q 50.5 12 60 11 Q 69.5 12 71.5 24 Q 60 33 48.5 24 Z" fill="rgba(12,16,32,0.72)" />
            <ellipse cx="55.5" cy="21" rx="5" ry="1.6" fill="rgba(255,255,255,0.22)" transform="rotate(-14 55.5 21)" />
            <line x1="60" y1="6" x2="60" y2="0.5" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="60" cy="-1" r="2.4" fill={accent} />
            <rect x="47" y="46" width="26" height="16" rx="4" fill="#e6eaf0" stroke="rgba(120,130,150,0.6)" strokeWidth="1" />
            <rect x="53" y="52" width="6" height="4" rx="1.5" fill={accent} />
            <rect x="62" y="52" width="6" height="4" rx="1.5" fill={accent} />
          </g>
        )}
        {v('master') && (
          <g>
            <path d="M 41 19 L 60 2 L 79 19 Q 69 24 60 23 Q 51 24 41 19 Z" fill={accent} />
            <circle cx="60" cy="11" r="1.6" fill="#fff" opacity="0.9" />
            <circle cx="42" cy="50" r="7.5" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
            <circle cx="78" cy="50" r="7.5" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
            <rect x="34" y="50" width="10" height="26" rx="4" fill={accent} opacity="0.28" transform="rotate(8 39 63)" />
            <rect x="76" y="50" width="10" height="26" rx="4" fill={accent} opacity="0.28" transform="rotate(-8 81 63)" />
          </g>
        )}
        {v('legend') && (
          <g>
            <ellipse cx="60" cy="13" rx="17" ry="4.6" fill="none" stroke={accent} strokeWidth="1.4" />
            <rect x="53" y="15.6" width="14" height="2.8" rx="1.4" fill={accent} />
            <polygon points="30,20 32,15 34,20 38,22 34,24 32,29 30,24 26,22" fill={accent} opacity="0.5" />
            <polygon points="90,30 92,26 94,30 98,32 94,34 92,38 90,34 86,32" fill={accent} opacity="0.4" />
          </g>
        )}
      </g>
    </svg>
  )
}

export function CharacterDefault(p: CharacterSVGProps) { return <HumanFigure {...p} variant="default" /> }

export function CharacterRunner(p: CharacterSVGProps) { return <HumanFigure {...p} variant="runner" /> }

export function CharacterScholar(p: CharacterSVGProps) { return <HumanFigure {...p} variant="scholar" /> }

export function CharacterMaster(p: CharacterSVGProps) { return <HumanFigure {...p} variant="master" /> }

export function CharacterLegend(p: CharacterSVGProps) { return <HumanFigure {...p} variant="legend" /> }

export function CharacterChef(p: CharacterSVGProps) { return <HumanFigure {...p} variant="chef" /> }

export function CharacterArtist(p: CharacterSVGProps) { return <HumanFigure {...p} variant="artist" /> }

export function CharacterWarrior(p: CharacterSVGProps) { return <HumanFigure {...p} variant="warrior" /> }

export function CharacterExplorer(p: CharacterSVGProps) { return <HumanFigure {...p} variant="explorer" /> }

export function CharacterMusician(p: CharacterSVGProps) { return <HumanFigure {...p} variant="musician" /> }

export function CharacterDoctor(p: CharacterSVGProps) { return <HumanFigure {...p} variant="doctor" /> }

export function CharacterBusiness(p: CharacterSVGProps) { return <HumanFigure {...p} variant="business" /> }

export function CharacterAstronaut(p: CharacterSVGProps) { return <HumanFigure {...p} variant="astronaut" /> }

/* ============================================================
 * Registry
 * ============================================================ */

export type CharacterComponent = (props: CharacterSVGProps) => ReactElement

export const CHARACTER_MAP: Record<string, CharacterComponent> = {
  // Level progression (Adam tiers)
  adam1: CharacterAdam1,
  adam2: CharacterAdam2,
  adam3: CharacterAdam3,
  adam4: CharacterAdam4,
  adam5: CharacterAdam5,
  adam6: CharacterAdam6,
  adam7: CharacterAdam7,
  adam8: CharacterAdam8,
  adam9: CharacterAdam9,
  adam10: CharacterAdam10,
  // Achievement themed
  user: CharacterDefault,
  zap: CharacterRunner,
  'book-open': CharacterScholar,
  crown: CharacterMaster,
  star: CharacterLegend,
  chef: CharacterChef,
  artist: CharacterArtist,
  swords: CharacterWarrior,
  compass: CharacterExplorer,
  music: CharacterMusician,
  cross: CharacterDoctor,
  briefcase: CharacterBusiness,
  rocket: CharacterAstronaut,
}