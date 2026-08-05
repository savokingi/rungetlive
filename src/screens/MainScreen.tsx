import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, User } from 'lucide-react'
import { Button } from '../components/Button'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../constants/routes'
import { LEVELS } from '../constants/levels'
import { CHARACTER_MAP } from '../components/CharacterSVG'

export function MainScreen() {
  const navigate = useNavigate()
  const { state, getLevelProgress } = useApp()
  const { profile, selectedSkinId, skins } = state
  const currentSkin = skins.find(s => s.id === selectedSkinId)
  const CharComponent = currentSkin ? CHARACTER_MAP[currentSkin.preview] : undefined
  const progress = getLevelProgress()
  const maxLevel = LEVELS[LEVELS.length - 1].level
  const isMax = profile.level >= maxLevel
  const waitingDays = !progress.canLevelUp && progress.percent >= 100 && !isMax
    ? Math.max(0, progress.nextDaysRequired - profile.daysInGame)
    : null

  return (
    <div className="page">
      <PageHeader title="Главная" showBack={false} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px 40px' }}>
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {CharComponent ? <CharComponent size={160} animated /> : (
            <div style={{
              width: 150, height: 150, borderRadius: '50%',
              background: 'var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}>
              <User size={64} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: '9999px',
            background: 'var(--color-accent-light)', color: 'var(--color-accent)',
            fontSize: '11px', fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase'
          }}>
            {currentSkin?.name || 'Персонаж'}
          </span>
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-accent)' }}>{profile.level}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>Уровень</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text)' }}>{isMax ? 'МАКС' : `${progress.current} / ${progress.required || '-'}`}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>XP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text)' }}>{profile.daysInGame}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>Дней</div>
          </div>
        </div>

        {waitingDays !== null && (
          <p style={{ marginTop: 10, fontSize: '12px', color: 'var(--color-warning)', textAlign: 'center' }}>
            XP хватает — до {progress.nextLevel} уровня ещё {waitingDays} {pluralDays(waitingDays)}
          </p>
        )}

        <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.CHARACTER)} style={{ marginTop: 20 }}>
          Сменить
        </Button>
      </main>

      <div style={{ padding: '0 20px 24px' }}>
        <Button variant="primary" size="md" fullWidth onClick={() => navigate(ROUTES.TASKS)}>
          <Zap size={16} /> Дела <ArrowRight size={16} />
        </Button>
      </div>

      <TabBar />
    </div>
  )
}

function pluralDays(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}