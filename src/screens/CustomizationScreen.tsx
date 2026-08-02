import { Check, Lock } from 'lucide-react'
import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { CHARACTER_MAP } from '../components/CharacterSVG'

function renderPreview(preview?: string) {
  const C = preview ? CHARACTER_MAP[preview] : undefined
  return C ? <C size={44} animated /> : null
}

export function CustomizationScreen() {
  const { state, dispatch } = useApp()
  const { skins, selectedSkinId } = state

  return (
    <div className="page">
      <PageHeader title="Персонаж" showBack />

      <main style={{ flex: 1, padding: '24px 16px 40px', overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
          <Avatar skinId={skins.find(s => s.id === selectedSkinId)?.preview} name={skins.find(s => s.id === selectedSkinId)?.name} size="xl" />
          <h2 style={{ marginTop: 16, fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
            {skins.find(s => s.id === selectedSkinId)?.name || 'Стандартный'}
          </h2>
          <p style={{ marginTop: 4, fontSize: '13px', color: 'var(--color-text-muted)' }}>Текущий скин</p>
        </div>

        <Card>
          <div style={{ padding: 16 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: 16, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Доступные скины</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 16 }}>
              {skins.map(skin => (
                <button
                  key={skin.id}
                  onClick={() => skin.unlocked ? dispatch({ type: 'SET_SKIN', payload: skin.id }) : undefined}
                  disabled={!skin.unlocked}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '16px', borderRadius: 'var(--radius)',
                    border: `1px solid ${selectedSkinId === skin.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: selectedSkinId === skin.id ? 'var(--color-accent-light)' : 'var(--color-surface)',
                    cursor: skin.unlocked ? 'pointer' : 'not-allowed',
                    opacity: skin.unlocked ? 1 : 0.5,
                    transition: 'var(--transition)',
                  }}
                  aria-pressed={selectedSkinId === skin.id}
                  aria-disabled={!skin.unlocked}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-border))',
                    color: 'var(--color-accent)',
                  }}>
                    {renderPreview(skin.preview)}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: skin.unlocked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{skin.name}</div>
                    {skin.unlocked ? (
                      selectedSkinId === skin.id ? (
                        <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <Check size={12} /> Выбран
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Доступен</span>
                      )
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <Lock size={10} /> {typeof skin.unlockLevel === 'number' ? `Ур. ${skin.unlockLevel}` : 'За достижение'}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </main>

      <TabBar />
    </div>
  )
}