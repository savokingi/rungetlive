import { Trophy, Lock, CheckCircle2, Target, Flame, Swords, Medal, Clock } from 'lucide-react'
import { Card } from '../components/Card'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'

const iconMap: Record<string, React.ReactNode> = {
  target: <Target size={20} />,
  flame: <Flame size={20} />,
  swords: <Swords size={20} />,
  medal: <Medal size={20} />,
  'check-circle': <CheckCircle2 size={20} />,
}

export function AchievementsScreen() {
  const { state } = useApp()
  const achievements = state.achievements
  const unlocked = achievements.filter(a => a.unlocked).length
  const total = achievements.length
  const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0

  return (
    <div className="page">
      <PageHeader title="Достижения" showBack />

      <main style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
        <Card>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-accent)' }}>{unlocked}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>Разблокировано</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text)' }}>{total}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>Всего</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text)' }}>{progress}%</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>Прогресс</div>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Список</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {achievements.map(achievement => (
                <button key={achievement.id} disabled={!achievement.unlocked}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                    borderRadius: 'var(--radius-sm)', border: '0.5px solid var(--color-border)',
                    background: achievement.unlocked ? 'var(--color-surface)' : 'var(--color-bg)',
                    cursor: achievement.unlocked ? 'pointer' : 'not-allowed',
                    opacity: achievement.unlocked ? 1 : 0.4, textAlign: 'left', width: '100%',
                  }} aria-disabled={!achievement.unlocked}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: achievement.unlocked ? 'var(--color-accent-light)' : 'var(--color-border)',
                    color: achievement.unlocked ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}>
                    {achievement.unlocked ? (iconMap[achievement.icon] || <Trophy size={20} />) : <Lock size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: achievement.unlocked ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                      {achievement.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                      {achievement.description}
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} /> {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Trophy size={12} /> Разблокировано
                    </div>
                  )}
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