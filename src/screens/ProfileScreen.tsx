import { useMemo } from 'react'
import { Calendar, Target, Sparkles, Flame } from 'lucide-react'
import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { LEVELS } from '../constants/levels'
import { collectCompletedDates } from '../utils/progression'

export function ProfileScreen() {
  const { state, getLevelProgress } = useApp()
  const { profile, selectedSkinId, skins, tasks } = state
  const currentSkin = skins.find(s => s.id === selectedSkinId)
  const progress = getLevelProgress()
  const nextLevel = LEVELS.find(l => l.level === profile.level + 1)

  const activityData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const d of collectCompletedDates(tasks)) {
      counts.set(d, (counts.get(d) || 0) + 1)
    }
    const data = []
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      data.push({ date: dateStr, count: counts.get(dateStr) || 0 })
    }
    return data
  }, [tasks])

  return (
    <div className="page">
      <PageHeader title="Профиль" showBack />

      <main style={{ padding: '16px 16px 32px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
          <Avatar name={currentSkin?.name} size="xl" skinId={currentSkin?.preview} />
          <h2 style={{ marginTop: 12, fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>{profile.name}</h2>

          <div style={{ marginTop: 12, width: '100%', maxWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: '50%', background: 'var(--color-accent)', color: 'white',
                  fontSize: '12px', fontWeight: 700,
                }}>{profile.level}</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>Уровень {profile.level}</span>
              </span>
              {nextLevel && (
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {progress.current} / {progress.required} XP
                </span>
              )}
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
              <div style={{ width: `${progress.percent}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 3, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
          <StatCard icon={<Calendar size={18} />} value={profile.daysInGame} label="Дней" />
          <StatCard icon={<Target size={18} />} value={profile.tasksCompleted} label="Выполнено" />
          <StatCard icon={<Sparkles size={18} />} value={profile.totalXp} label="Всего XP" />
          <StatCard icon={<Flame size={18} />} value={profile.streak} label="Серия" />
        </div>

        <Card>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Активность</p>
            <ActivityHeatmap data={activityData} />
          </div>
        </Card>
      </main>

      <TabBar />
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactElement; value: number; label: string }) {
  return (
    <div style={{
      padding: '12px', borderRadius: 'var(--radius-sm)',
      background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text)' }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const dayOfWeek = startOfYear.getDay() || 7

  const weeks: ({ date: string; count: number } | null)[][] = []
  let currentWeek: ({ date: string; count: number } | null)[] = Array(7).fill(null)
  for (let i = 1; i <= dayOfWeek; i++) currentWeek[i - 1] = null

  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getFullYear(), 0, i + 1)
    if (d > today) break
    const dow = d.getDay() || 7
    if (dow === 1 && i > 0) { weeks.push(currentWeek); currentWeek = Array(7).fill(null) }
    const dateStr = d.toISOString().split('T')[0]
    currentWeek[dow - 1] = { date: dateStr, count: data.find(x => x.date === dateStr)?.count || 0 }
  }
  if (currentWeek.some(x => x)) weeks.push(currentWeek)

  const getColor = (count: number) => {
    if (count === 0) return 'var(--color-border)'
    if (count === 1) return 'var(--color-accent-light)'
    if (count === 2) return 'var(--color-accent-border)'
    return 'var(--color-accent)'
  }

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} style={{ display: 'flex', gap: 2 }}>
            {weeks.map((week, w) => (
              <div key={w} style={{ width: 10, height: 10, borderRadius: 2, background: week[row] ? getColor(week[row].count) : 'transparent', border: week[row] ? 'none' : '1px dashed var(--color-border)' }}
                title={week[row] ? `${week[row].date}: ${week[row].count} задач` : ''} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}