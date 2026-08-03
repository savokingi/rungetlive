import { Lock, Check, Zap, Calendar } from 'lucide-react'
import { Card } from '../components/Card'
import { Avatar } from '../components/Avatar'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { getNextLevel } from '../constants/levels'
import { CHARACTER_MAP } from '../components/CharacterSVG'

function renderPreview(preview?: string) {
  const C = preview ? CHARACTER_MAP[preview] : undefined
  return C ? <C size={44} animated /> : null
}

function LevelProgress({ current, required }: { current: number; required: number }) {
  const pct = required > 0 ? Math.min(100, (current / required) * 100) : 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Zap size={14} strokeWidth={1.5} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: 'var(--color-accent)', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', minWidth: 60, textAlign: 'right' }}>{current}/{required} XP</span>
    </div>
  )
}

export function CharacterScreen() {
  const { state, dispatch } = useApp()
  const { skins, profile, selectedSkinId } = state
  const currentSkin = skins.find(s => s.id === selectedSkinId)
  const nextLevel = getNextLevel(profile.level)
  const isMaxLevel = !nextLevel

  return (
    <div className="page">
      <PageHeader title="Персонаж" showBack />

      <main style={{ flex: 1, padding: '16px 16px 32px', overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Avatar size="xl" skinId={currentSkin?.preview} />
          <p style={{ marginTop: 10, fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
            {currentSkin?.name || 'Стандартный'}
          </p>
          <p style={{ marginTop: 2, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Текущий персонаж</p>
        </div>

        <Card>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>{profile.level}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 4 }}>уровень</span>
              </div>
              {!isMaxLevel && (
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  Следующий: {nextLevel.level} уровень
                </span>
              )}
            </div>
            <LevelProgress current={profile.xp} required={nextLevel?.xpRequired ?? 0} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Calendar size={14} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                {profile.daysInGame} д. в игре
                {!isMaxLevel && <> / нужно {nextLevel.daysRequired} д.</>}
              </span>
            </div>
            {isMaxLevel && (
              <p style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 8 }}>Максимальный уровень достигнут!</p>
            )}
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Скины</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
              {skins.map(skin => {
                const isCurrent = selectedSkinId === skin.id
                const isUnlocked = skin.unlocked
                const unlockAchievement = skin.unlockAchievement
                  ? state.achievements.find(a => a.id === skin.unlockAchievement)
                  : null
                return (
                  <button key={skin.id}
                    onClick={() => { if (isUnlocked) dispatch({ type: 'SET_SKIN', payload: skin.id }) }}
                    disabled={!isUnlocked}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '12px', borderRadius: 'var(--radius-sm)',
                      border: `0.5px solid ${isCurrent ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: isCurrent ? 'var(--color-accent-light)' : 'var(--color-surface)',
                      opacity: isUnlocked ? 1 : 0.4,
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      transition: 'var(--transition)',
                    }} aria-pressed={isCurrent} aria-disabled={!isUnlocked}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: isUnlocked ? 'var(--gradient-accent)' : 'var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isUnlocked ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      position: 'relative',
                    }}>
                      {renderPreview(skin.preview)}
                      {!isUnlocked && <Lock size={12} style={{ position: 'absolute', bottom: -2, right: -2, color: 'var(--color-text-muted)' }} />}
                      {isCurrent && <Check size={12} style={{ position: 'absolute', bottom: -2, right: -2, color: 'var(--color-accent)' }} />}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: isUnlocked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{skin.name}</span>
                    <span style={{ fontSize: '10px', color: isUnlocked ? 'var(--color-text-muted)' : 'var(--color-text-secondary)' }}>
                      {isUnlocked ? (isCurrent ? 'Выбран' : 'Доступен') : (
                        typeof skin.unlockLevel === 'number'
                          ? `Ур. ${skin.unlockLevel}`
                          : unlockAchievement ? unlockAchievement.name : 'За достижение'
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>
      </main>

      <TabBar />
    </div>
  )
}