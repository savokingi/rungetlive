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
          <rect x="44" y="62" width="32" height="24" rx="3" fill={accent} opacity="0.12" stroke={accentBorder} strokeWidth="1" />
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
        <path d="M50 28 C54 26, 58 26, 60 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M60 28 C64 26, 68 26, 70 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M52 38 C55 41, 65 41, 68 38" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="22" y="54" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(-10, 30, 58)" />
        <rect x="82" y="52" width="16" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(10, 90, 56)" />
        <rect x="40" y="86" width="14" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(-15, 47, 91)" />
        <rect x="66" y="86" width="14" height="10" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(15, 73, 91)" />
      </g>
    </svg>
  )
}

export function CharacterChef({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M40 40 Q60 50 80 40 L78 44 Q60 52 42 44 Z" fill={accent} opacity="0.9" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="30" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="30" rx="3" ry="3.5" fill={accent} />
        </g>
        <rect x="48" y="17" width="24" height="16" rx="5" fill={accentLight} stroke={accent} strokeWidth="1.5" />
        <rect x="42" y="14" width="36" height="5" rx="2.5" fill={accent} />
        <path d="M42 22 Q60 20 60 30 Q60 20 78 22" fill={accent} opacity="0.25" />
        <rect x="44" y="62" width="32" height="24" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
        <line x1="60" y1="62" x2="60" y2="86" stroke={accent} strokeWidth="1.2" />
        <line x1="44" y1="68" x2="48" y2="68" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterArtist({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  const colors = ['#f87171', '#facc15', '#22c55e', '#3b82f6', '#a855f7']
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <ellipse cx="60" cy="14" rx="24" ry="7" fill={accent} stroke={accentBorder} strokeWidth="1">
          <animateTransform attributeName="transform" type="rotate" from="0 60 14" to="360 60 14" dur="14s" repeatCount="indefinite" begin="0s" />
        </ellipse>
        <circle cx="60" cy="14" r="2.5" fill="#fff" />
        {colors.map((c, i) => (
          <circle key={i} cx={34 + i * 15} cy="42" r="4" fill={c} opacity="0.8" style={animated ? { animation: 'float 2.5s ease-in-out infinite ' + i * 0.3 + 's' } : undefined} />
        ))}
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="30" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="30" rx="3" ry="3.5" fill={accent} />
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

export function CharacterWarrior({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="34" y="50" width="52" height="44" rx="10" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M34 56 L22 52 L30 66 Z" fill={accent} opacity="0.12" />
        <path d="M86 56 L98 52 L90 66 Z" fill={accent} opacity="0.12" />
        <circle cx="60" cy="30" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <rect x="42" y="14" width="36" height="6" rx="3" fill={accent} opacity="0.9" />
        <path d="M38 26 L82 26 L78 30 L42 30 Z" fill={accent} opacity="0.25" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="28" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="28" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M50 38 C53 42, 67 42, 70 38" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="18" y="48" width="10" height="26" rx="4" fill={accent} opacity="0.85" transform="rotate(18 23 61)" />
        <rect x="92" y="50" width="12" height="20" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" transform="rotate(-18 98 60)" />
        <rect x="40" y="90" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="90" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterExplorer({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M38 22 Q60 8 82 22" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="32" r="13" fill="none" stroke={accent} strokeWidth="1.6" />
        <path d="M60 19 L62 26 L69 28 L62 30 L60 37 L58 30 L51 28 L58 26 Z" fill={accent} />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="32" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="32" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M46 32 L50 32 M70 32 L74 32" stroke={accent} strokeWidth="1.4" />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="38" y="92" width="14" height="14" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
        <rect x="68" y="92" width="14" height="14" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterMusician({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'nod 3s ease-in-out infinite', transformOrigin: '60px 72px' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="30" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M38 24 Q48 34 42 40 M82 24 Q72 34 78 40" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="42" width="36" height="8" rx="4" fill={accent} opacity="0.35" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="32" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="32" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M52 40 C55 43, 65 43, 68 40" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="86" y="24" width="5" height="16" rx="2" fill={accent} opacity="0.7" />
        <circle cx="88" cy="42" r="3" fill={accent} />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterDoctor({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <rect x="52" y="12" width="16" height="16" rx="3" fill="none" stroke={accent} strokeWidth="2" />
        <path d="M37 26 Q40 18 48 20" fill="none" stroke={accent} strokeWidth="2" />
        <path d="M37 26 C33 34 40 36 44 32 C48 28 46 22 42 23" fill={accent} opacity="0.4" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="30" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="30" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M50 38 C53 42, 67 42, 70 38" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M48 52 Q60 66 62 88" fill="none" stroke={accent} strokeWidth="1.8" />
        <circle cx="62" cy="54" r="6" fill={accent} opacity="0.2" />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="88" width="10" height="18" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterBusiness({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <rect x="38" y="52" width="44" height="40" rx="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M38 66 L44 60 L76 60 L82 66" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.4" />
        <circle cx="60" cy="32" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <path d="M42 40 Q48 44 60 44 Q72 44 78 40" fill={accent} opacity="0.15" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="50" cy="30" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="70" cy="30" rx="3" ry="3.5" fill={accent} />
        </g>
        <path d="M50 38 C60 43, 70 38, 70 38" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="62" y="36" width="18" height="14" rx="2" fill={accentLight} stroke={accentBorder} strokeWidth="1.3" transform="rotate(-8 71 43)" />
        <rect x="64" y="33" width="14" height="4" rx="1.5" fill={accent} opacity="0.6" transform="rotate(-8 71 35)" />
        <rect x="26" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="58" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="42" y="90" width="10" height="16" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="90" width="10" height="16" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export function CharacterAstronaut({ size = 120, accent = 'var(--color-accent)', accentLight = 'var(--color-accent-light)', accentBorder = 'var(--color-accent-border)', animated }: CharacterSVGProps) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={animated ? { animation: 'float 3s ease-in-out infinite' } : undefined}>
        <circle cx="34" cy="30" r="4" fill={accent} opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="88" cy="48" r="3" fill={accent} opacity="0.5">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="60" r="2.5" fill={accent} opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <rect x="36" y="54" width="48" height="48" rx="16" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <circle cx="60" cy="34" r="22" fill={accentLight} stroke={accentBorder} strokeWidth="1.5" />
        <ellipse cx="52" cy="32" rx="6.5" ry="7" fill={accent} opacity="0.15" />
        <ellipse cx="68" cy="32" rx="6.5" ry="7" fill={accent} opacity="0.15" />
        <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
          <ellipse cx="52" cy="33" rx="3" ry="3.5" fill={accent} />
          <ellipse cx="68" cy="33" rx="3" ry="3.5" fill={accent} />
        </g>
        <line x1="42" y1="18" x2="78" y2="18" stroke={accent} strokeWidth="1.6" opacity="0.7" />
        <rect x="40" y="90" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="68" y="90" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="26" y="60" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
        <rect x="82" y="60" width="12" height="8" rx="4" fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

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