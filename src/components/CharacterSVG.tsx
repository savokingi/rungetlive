import type { ReactElement } from 'react'

interface CharacterSVGProps {
  size?: number
  accent?: string
  accentLight?: string
  accentBorder?: string
  animated?: boolean
}

const animStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.05; r: 52; }
  50% { opacity: 0.11; r: 56; }
}
@keyframes swingArm {
  0%, 100% { transform: rotate(-30deg); }
  50% { transform: rotate(-12deg); }
}
@keyframes swingArmBack {
  0%, 100% { transform: rotate(26deg); }
  50% { transform: rotate(8deg); }
}
@keyframes runLegL {
  0%, 100% { transform: rotate(-24deg); }
  50% { transform: rotate(14deg); }
}
@keyframes runLegR {
  0%, 100% { transform: rotate(20deg); }
  50% { transform: rotate(-14deg); }
}
@keyframes nod {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(3deg); }
}
@keyframes bookPage {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.75; }
}
@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
@keyframes crownShine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
`

/* ============================================================
 * Single flat human figure in the app's accent palette.
 * Shared by level characters (Adam tiers) and themed characters.
 * ============================================================ */

type FigureVariant =
  | 'default' | 'runner' | 'scholar' | 'chef' | 'artist' | 'warrior'
  | 'explorer' | 'musician' | 'doctor' | 'business' | 'astronaut' | 'master' | 'legend'

function HumanFigure({
  size = 120,
  accent = 'var(--color-accent)',
  accentLight = 'var(--color-accent-light)',
  accentBorder = 'var(--color-accent-border)',
  animated,
  variant = 'default',
  tier,
}: CharacterSVGProps & { variant?: FigureVariant; tier?: number }) {
  const t = Math.max(1, Math.min(10, tier ?? 5))
  const t1 = (t - 1) / 9
  const lerp = (a: number, b: number) => a + (b - a) * t1

  const shoulder = lerp(14, 23)
  const chest = lerp(10, 14)
  const waistH = lerp(7.5, 9)
  const hipH = lerp(8.5, 10)
  const neckH = lerp(3.2, 4.4)
  const armU = lerp(2.6, 3.6)
  const armF = lerp(1.8, 2.4)
  const deltR = lerp(3, 4.2)
  const mus = lerp(0, 0.9)
  const slump = lerp(6, 0)
  const aura = tier === undefined ? 0.05 : t < 3 ? 0 : (t - 2) * 0.02
  const halo = tier !== undefined && t >= 2
  const crown = tier !== undefined && t >= 9
  const sparkle = tier !== undefined && t >= 7
  const definedJaw = t >= 6

  const v = (n: FigureVariant) => variant === n
  const isRunner = v('runner')

  const neckTop = 35
  const torsoYs = [42, 46, 50, 56, 63, 70]
  const torsoDxs = [shoulder, shoulder - 0.6, chest, chest - 0.5, waistH, hipH * 0.95]
  const torsoPath = (() => {
    const left = torsoDxs.map((dx, i) => `${60 - dx} ${torsoYs[i]}`).join(' L ')
    const right = torsoDxs.map((dx, i) => `${60 + dx} ${torsoYs[i]}`).reverse().join(' L ')
    return `M ${left} L ${right} Z`
  })()

  const armUppL = `M ${60 - shoulder + 3} 43 L ${60 - shoulder + 2} 62`
  const armLowL = `M ${60 - shoulder + 2} 62 L ${60 - shoulder + 1} 84`
  const armUppR = `M ${60 + shoulder - 3} 43 L ${60 + shoulder - 2} 62`
  const armLowR = `M ${60 + shoulder - 2} 62 L ${60 + shoulder - 1} 84`

  const runnerLeft = isRunner ? { animation: 'swingArm 0.4s ease-in-out infinite', transformOrigin: `${60 - shoulder + 3}px 44px` } : undefined
  const runnerRight = isRunner ? { animation: 'swingArmBack 0.4s ease-in-out infinite', transformOrigin: `${60 + shoulder - 3}px 44px` } : undefined
  const legLAnim = isRunner ? { animation: 'runLegL 0.4s ease-in-out infinite', transformOrigin: '55px 84px' } : undefined
  const legRAnim = isRunner ? { animation: 'runLegR 0.4s ease-in-out infinite', transformOrigin: '65px 84px' } : undefined

  const upper = (d: string, w: number) => (
    <>
      <path d={d} stroke={accentBorder} strokeWidth={w * 2 + 1.8} strokeLinecap="round" fill="none" />
      <path d={d} stroke={accentLight} strokeWidth={w * 2} strokeLinecap="round" fill="none" />
    </>
  )
  const lower = (d: string, w: number) => (
    <>
      <path d={d} stroke={accentBorder} strokeWidth={w * 2 + 1.4} strokeLinecap="round" fill="none" />
      <path d={d} stroke={accentLight} strokeWidth={w * 2} strokeLinecap="round" fill="none" />
    </>
  )

  const floatAnim = animated
    ? variant === 'scholar'
      ? { animation: 'nod 4s ease-in-out infinite', transformOrigin: '60px 72px' }
      : { animation: 'float 3s ease-in-out infinite' }
    : undefined

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {animated && <style>{animStyles}</style>}
      <g style={floatAnim}>
        {aura > 0 && (
          <circle cx="60" cy="58" r="52" fill={accent} opacity={0.04 + aura * 0.6}
            style={animated ? { animation: 'pulseGlow 3s ease-in-out infinite' } : undefined} />
        )}
        <g transform={`rotate(${-slump} 60 72)`}>
          {/* ground shadow */}
          <ellipse cx="60" cy="108" rx={r(shoulder * 1.1)} ry="3" fill={accent} opacity={0.18 + aura * 1.4} />

          {/* legs + feet */}
          <g style={legLAnim}>
            <rect x="52" y="84" width="6" height="18" rx="3" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <rect x="49" y="102" width="12" height="5.5" rx="2.5" fill={accent} />
          </g>
          <g style={legRAnim}>
            <rect x="62" y="84" width="6" height="18" rx="3" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <rect x="59" y="102" width="12" height="5.5" rx="2.5" fill={accent} />
          </g>

          {/* shorts */}
          <path d={`M ${60 - hipH} 70 L ${60 + hipH} 70 Q ${60 + hipH + 1.5} 78 ${60 + hipH - 1} 84 L ${60 - hipH + 1} 84 Q ${60 - hipH - 1.5} 78 ${60 - hipH} 70 Z`}
            fill={accent} opacity="0.9" />

          {/* torso */}
          <path d={torsoPath} fill={accentLight} stroke={accentBorder} strokeWidth="1.2" />

          {/* muscle detail (accent, subtle) */}
          {mus > 0.3 && (
            <g stroke={accent} fill="none" strokeLinecap="round">
              <path d={`M ${60 - chest + 3} 49 Q ${60} 54 ${60 + chest - 3} 49`} strokeWidth="1" opacity="0.4" />
              <g strokeWidth="0.9" opacity="0.3">
                <path d={`M ${60 - 4.5} 56 h 9`} />
                <path d={`M ${60 - 4.5} 61 h 9`} />
                <path d={`M ${60 - 4.5} 66 h 9`} />
              </g>
            </g>
          )}

          {/* neck + traps */}
          <rect x={60 - neckH} y={neckTop} width={neckH * 2} height="8" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
          {mus > 0.3 && (
            <g stroke={accent} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.45">
              <path d={`M ${60 - neckH - 0.5} 40 Q ${60 - shoulder + 3} 41 ${60 - shoulder + 2} 44`} />
              <path d={`M ${60 + neckH + 0.5} 40 Q ${60 + shoulder - 3} 41 ${60 + shoulder - 2} 44`} />
            </g>
          )}

          {/* left arm */}
          <g style={runnerLeft}>
            {upper(armUppL, armU)}
            {lower(armLowL, armF)}
            <circle cx={60 - shoulder + 4} cy="44" r={deltR} fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <circle cx={60 - shoulder + 1} cy="87" r="2.4" fill={accentLight} stroke={accentBorder} strokeWidth="0.9" />
          </g>

          {/* right arm */}
          <g style={runnerRight}>
            {upper(armUppR, armU)}
            {lower(armLowR, armF)}
            <circle cx={60 + shoulder - 4} cy="44" r={deltR} fill={accentLight} stroke={accentBorder} strokeWidth="1" />
            <circle cx={60 + shoulder - 1} cy="87" r="2.4" fill={accentLight} stroke={accentBorder} strokeWidth="0.9" />
          </g>

          {/* head */}
          <g>
            <circle cx="46.5" cy="25" r="2.3" fill={accentLight} stroke={accentBorder} strokeWidth="0.9" />
            <circle cx="73.5" cy="25" r="2.3" fill={accentLight} stroke={accentBorder} strokeWidth="0.9" />
            <circle cx="60" cy="25" r="13" fill={accentLight} stroke={accentBorder} strokeWidth="1.3" />
            <path d="M 47.5 18 Q 45.5 9 60 8 Q 74.5 9 72.5 18 Q 62 23 47.5 18 Z" fill={accent} />
            {definedJaw && (
              <path d="M 49 28 Q 55 33 60 33 Q 65 33 71 28" fill="none" stroke={accentBorder} strokeWidth="1" opacity="0.8" />
            )}
            <g style={animated ? { animation: 'blink 4s infinite' } : undefined}>
              <circle cx="54.5" cy="23" r="1.4" fill={accent} />
              <circle cx="65.5" cy="23" r="1.4" fill={accent} />
            </g>
            <path d="M 56.5 29.5 Q 60 31.5 63.5 29.5" stroke={accent} strokeWidth="1.1" strokeLinecap="round" fill="none" />
          </g>

          {/* extras (level progression) */}
          {halo && (
            <g>
              <ellipse cx="60" cy="6.5" rx="16" ry="3.6" fill="none" stroke={accent} strokeWidth="1.3" />
              <rect x="53" y="9" width="14" height="2.4" rx="1.2" fill={accent} />
            </g>
          )}
          {crown && (
            <g>
              <path d="M 41 20 L 60 4 L 79 20 Q 69 24 60 23 Q 51 24 41 20 Z" fill={accent} />
              <g fill={accentLight} style={animated ? { animation: 'crownShine 2s ease-in-out infinite' } : undefined}>
                <circle cx="50" cy="14" r="1.6" />
                <circle cx="60" cy="11" r="1.6" />
                <circle cx="70" cy="14" r="1.6" />
              </g>
            </g>
          )}
          {sparkle && (
            <g>
              <polygon points="92,14 94,10 96,14 100,16 96,18 94,22 92,18 88,16" fill={accent} opacity="0.5"
                style={animated ? { animation: 'sparkle 2s ease-in-out infinite', transformOrigin: '94px 16px' } : undefined} />
              <polygon points="24,42 26,38 28,42 31,44 28,46 26,50 24,46 21,44" fill={accent} opacity="0.4"
                style={animated ? { animation: 'sparkle 2.4s ease-in-out infinite 0.6s', transformOrigin: '26px 44px' } : undefined} />
            </g>
          )}

          {/* accessories (themed) */}
          {v('runner') && (
            <g>
              <path d="M 47 19 Q 60 15.5 73 19" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 48 19 L 57 17.5 M 72 19 L 63 17.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
              <g stroke={accent} strokeWidth="1.3" strokeLinecap="round" opacity="0.45">
                <path d="M 30 24 L 16 20" />
                <path d="M 34 32 L 19 28" />
                <path d="M 32 42 L 20 42" />
                <path d="M 30 52 L 22 50" />
              </g>
            </g>
          )}
          {v('scholar') && (
            <g>
              <circle cx="53" cy="23" r="5" fill="none" stroke={accent} strokeWidth="1.3" />
              <circle cx="67" cy="23" r="5" fill="none" stroke={accent} strokeWidth="1.3" />
              <line x1="58" y1="23" x2="62" y2="23" stroke={accent} strokeWidth="1.3" />
              <line x1="48" y1="20" x2="45.5" y2="18.5" stroke={accent} strokeWidth="1.1" strokeLinecap="round" />
              <line x1="72" y1="20" x2="74.5" y2="18.5" stroke={accent} strokeWidth="1.1" strokeLinecap="round" />
              <path d="M 44 56 L 60 50 L 76 56 L 74 80 L 60 86 L 46 80 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <line x1="60" y1="50" x2="60" y2="86" stroke={accentBorder} strokeWidth="0.9" />
              <g stroke={accent} strokeWidth="1.1" strokeLinecap="round"
                style={animated ? { animation: 'bookPage 3s ease-in-out infinite' } : undefined}>
                <line x1="48" y1="62" x2="56" y2="62" />
                <line x1="48" y1="68" x2="56" y2="68" />
                <line x1="64" y1="62" x2="72" y2="62" />
                <line x1="64" y1="68" x2="72" y2="68" />
              </g>
            </g>
          )}
          {v('chef') && (
            <g>
              <path d="M 45 22 Q 43 4 60 2 Q 77 4 75 22 Q 60 26 45 22 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <circle cx="60" cy="6" r="5" fill={accent} />
              <path d="M 48 14 h 24" stroke={accentBorder} strokeWidth="1.2" opacity="0.5" />
              <path d="M 46 46 L 74 46 L 76 70 L 60 78 L 44 70 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" opacity="0.9" />
              <path d="M 52 48 L 54 62 L 58 56 M 68 48 L 66 62 L 62 56" stroke={accentBorder} strokeWidth="0.9" fill="none" opacity="0.7" />
            </g>
          )}
          {v('artist') && (
            <g>
              <ellipse cx="60" cy="14" rx="14" ry="5.5" fill={accentLight} stroke={accentBorder} strokeWidth="1" transform="rotate(-8 60 14)" />
              <circle cx="60" cy="12.5" r="3" fill={accent} />
              <ellipse cx="33" cy="66" rx="10" ry="7.5" fill={accentLight} stroke={accentBorder} strokeWidth="1" transform="rotate(-12 33 66)" />
              <g fill={accent}>
                <circle cx="29" cy="63" r="1.6" />
                <circle cx="34" cy="61" r="1.6" />
                <circle cx="39" cy="63" r="1.6" />
                <circle cx="34" cy="68" r="1.6" />
              </g>
              <path d="M 79 46 L 93 32" stroke={accentLight} strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="94" cy="31" r="2.2" fill={accent} />
            </g>
          )}
          {v('warrior') && (
            <g>
              <path d="M 84 6 L 70 68 L 78 68 L 88 10 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <line x1="70" y1="66" x2="86" y2="62" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="84" cy="7" r="2.6" fill={accent} />
              <circle cx="31" cy="62" r="12" fill={accentLight} stroke={accentBorder} strokeWidth="1.4" />
              <circle cx="31" cy="62" r="7.5" fill="none" stroke={accent} strokeWidth="1.3" opacity="0.8" />
              <circle cx="31" cy="62" r="2.4" fill={accent} />
              <path d="M 44 22 Q 44 8 60 7 Q 76 8 76 22 Z" fill={accent} opacity="0.9" />
            </g>
          )}
          {v('explorer') && (
            <g>
              <ellipse cx="60" cy="16" rx="22" ry="5" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <path d="M 46 16 L 46 5 Q 60 0.5 74 5 L 74 16 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <rect x="47" y="13.5" width="26" height="3" rx="1.5" fill={accent} />
              <circle cx="60" cy="56" r="5.5" fill={accentLight} stroke={accentBorder} strokeWidth="1.1" />
              <path d="M 60 52.5 L 61.8 56 L 60 59.5 L 58.2 56 Z" fill={accent} />
            </g>
          )}
          {v('musician') && (
            <g>
              <path d="M 47 27 A 13.5 13.5 0 0 1 73 27" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
              <rect x="43" y="22" width="8.5" height="8" rx="3.5" fill={accent} />
              <rect x="68.5" y="22" width="8.5" height="8" rx="3.5" fill={accent} />
              <g style={animated ? { animation: 'float 2.4s ease-in-out infinite' } : undefined}>
                <circle cx="87" cy="28" r="4" fill={accent} />
                <rect x="87.6" y="24" width="2.8" height="12" rx="1.4" fill={accent} />
              </g>
            </g>
          )}
          {v('doctor') && (
            <g>
              <path d="M 46 46 L 74 46 L 76 72 L 60 80 L 44 72 Z" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <path d="M 48 47 L 52 60 M 72 47 L 68 60" stroke={accentBorder} strokeWidth="0.9" opacity="0.7" fill="none" />
              <circle cx="60" cy="65" r="5" fill="none" stroke={accent} strokeWidth="1.5" />
              <path d="M 60 65 L 60 73" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
              <rect x="52" y="9" width="16" height="4.6" rx="2.3" fill={accentLight} stroke={accentBorder} strokeWidth="0.9" />
              <path d="M 58 9 L 58 14 M 62 9 L 62 14" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
          {v('business') && (
            <g>
              <path d="M 52 45 L 68 45" stroke={accentBorder} strokeWidth="1" />
              <path d="M 54 46 L 66 46 L 60 70 Z" fill={accent} opacity="0.95" />
              <path d="M 54 49 L 66 49" stroke={accentBorder} strokeWidth="0.8" opacity="0.7" />
              <rect x="27" y="62" width="15" height="11" rx="2.5" fill={accentLight} stroke={accentBorder} strokeWidth="1.1" />
              <rect x="32.5" y="59.5" width="4" height="3.5" rx="1" fill={accent} />
            </g>
          )}
          {v('astronaut') && (
            <g>
              <circle cx="60" cy="23" r="16.5" fill={accentLight} stroke={accentBorder} strokeWidth="1.3" />
              <path d="M 50 24 Q 51 13 60 12.5 Q 69 13 70 24 Q 60 32 50 24 Z" fill={accent} opacity="0.8" />
              <line x1="60" y1="5.5" x2="60" y2="0.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="60" cy="0" r="2.4" fill={accent} />
              <rect x="46" y="46" width="28" height="15" rx="3.5" fill={accentLight} stroke={accentBorder} strokeWidth="1" />
              <rect x="54" y="52" width="5" height="4" rx="1.3" fill={accent} />
              <rect x="61" y="52" width="5" height="4" rx="1.3" fill={accent} />
            </g>
          )}
          {v('master') && (
            <g>
              <path d="M 43 18 L 50 5 L 56 15 L 60 3 L 64 15 L 70 5 L 77 18 Q 69 23 60 22 Q 51 23 43 18 Z" fill={accent} />
              <g fill={accentLight} style={animated ? { animation: 'crownShine 2s ease-in-out infinite' } : undefined}>
                <circle cx="50" cy="12" r="1.5" />
                <circle cx="60" cy="10" r="1.5" />
                <circle cx="70" cy="12" r="1.5" />
              </g>
              <ellipse cx="42" cy="48" rx="4" ry="7" fill={accent} opacity="0.3" />
              <ellipse cx="78" cy="48" rx="4" ry="7" fill={accent} opacity="0.3" />
            </g>
          )}
          {v('legend') && (
            <g>
              <ellipse cx="60" cy="10" rx="17" ry="4.4" fill="none" stroke={accent} strokeWidth="1.4" />
              <rect x="53" y="12.6" width="14" height="2.6" rx="1.3" fill={accent} />
              <polygon points="30,20 32,15 34,20 38,22 34,24 32,29 30,24 26,22" fill={accent} opacity="0.5" />
              <polygon points="90,30 92,26 94,30 98,32 94,34 92,38 90,34 86,32" fill={accent} opacity="0.4" />
            </g>
          )}
        </g>
      </g>
    </svg>
  )
}

function r(v: number) {
  return Math.round(v * 10) / 10
}

export function CharacterAdam1(p: CharacterSVGProps) { return <HumanFigure {...p} tier={1} /> }
export function CharacterAdam2(p: CharacterSVGProps) { return <HumanFigure {...p} tier={2} /> }
export function CharacterAdam3(p: CharacterSVGProps) { return <HumanFigure {...p} tier={3} /> }
export function CharacterAdam4(p: CharacterSVGProps) { return <HumanFigure {...p} tier={4} /> }
export function CharacterAdam5(p: CharacterSVGProps) { return <HumanFigure {...p} tier={5} /> }
export function CharacterAdam6(p: CharacterSVGProps) { return <HumanFigure {...p} tier={6} /> }
export function CharacterAdam7(p: CharacterSVGProps) { return <HumanFigure {...p} tier={7} /> }
export function CharacterAdam8(p: CharacterSVGProps) { return <HumanFigure {...p} tier={8} /> }
export function CharacterAdam9(p: CharacterSVGProps) { return <HumanFigure {...p} tier={9} /> }
export function CharacterAdam10(p: CharacterSVGProps) { return <HumanFigure {...p} tier={10} /> }

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
