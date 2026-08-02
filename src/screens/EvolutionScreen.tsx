import { Zap, Lock, Check, TrendingUp } from 'lucide-react'
import { Card } from '../components/Card'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { CHARACTER_MAP } from '../components/CharacterSVG'

const ADAM_TIERS = [
  'Sub-3', 'Sub-3.5', 'Theorycel', 'Lookscel', 'Possibly', 'Lay', 'Owner', 'HTN', 'Chad', 'True Adam',
]

export function EvolutionScreen() {
  const { state, dispatch } = useApp()
  const { skins, profile, selectedSkinId } = state
  const levelSkins = skins
    .filter(s => typeof s.unlockLevel === 'number')
    .sort((a, b) => (a.unlockLevel as number) - (b.unlockLevel as number))

  return (
    <div className="page">
      <PageHeader title="Эволюция" showBack />

      <main style={{ flex: 1, padding: '16px 16px 32px', overflow: 'auto' }}>
        <Card>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>От Sub-3 до True Adam</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Твой персонаж крепнет с уровнем: шире плечи, рельеф мышц, прямой взгляд.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <LevelPill label={`Уровень ${profile.level}`} />
              <LevelPill label={`${profile.daysInGame} д. в игре`} accent={false} />
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>
              Стадии развития
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {levelSkins.map((skin, i) => {
                const unlocked = skin.unlocked
                const current = selectedSkinId === skin.id
                const Char = skin.preview ? CHARACTER_MAP[skin.preview] : undefined
                return (
                  <button
                    key={skin.id}
                    onClick={() => unlocked && dispatch({ type: 'SET_SKIN', payload: skin.id })}
                    disabled={!unlocked}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', width: '100%',
                      borderRadius: 'var(--radius-sm)', textAlign: 'left',
                      border: `1px solid ${current ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: current ? 'var(--color-accent-light)' : 'var(--color-surface)',
                      opacity: unlocked ? 1 : 0.5, cursor: unlocked ? 'pointer' : 'default',
                      transition: 'var(--transition)',
                    }}
                    aria-pressed={current} aria-disabled={!unlocked}
                  >
                    <div style={{
                      width: 54, height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)',
                    }}>
                      {Char ? <Char size={44} animated={unlocked} /> : <Lock size={22} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: unlocked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                          {i + 1}. {skin.name}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--color-accent)', opacity: 0.85 }}>{ADAM_TIERS[i]}</span>
                      </div>
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Zap size={12} style={{ color: 'var(--color-accent)' }} />
                        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                          {unlocked ? `Ур. ${skin.unlockLevel}` : `Разблокируется. ур. ${skin.unlockLevel}`}
                        </span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {current ? (
                        <span style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={13} /> Текущий
                        </span>
                      ) : unlocked ? (
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Активен</span>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Закрыт</span>
                      )}
                    </div>
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

function LevelPill({ label, accent = true }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: '999px', fontSize: 11, fontWeight: 600,
      color: accent ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      background: accent ? 'var(--color-accent-light)' : 'var(--color-surface)',
      border: `1px solid ${accent ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
    }}>
      {label}
    </span>
  )
}