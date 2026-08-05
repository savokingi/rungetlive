import { useMemo } from 'react'
import { Flame, Trophy, ListChecks, CalendarDays, TrendingUp } from 'lucide-react'
import { Card } from '../components/Card'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { LEVELS } from '../constants/levels'
import { localDateKey } from '../utils/progression'
import type { Task } from '../types'

interface DayStat { date: string; label: string; xp: number; count: number }

function buildDayStats(tasks: Task[], days: number): DayStat[] {
  const map = new Map<string, DayStat>()
  const now = new Date()
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = localDateKey(d)
    map.set(key, { date: key, label: dayNames[d.getDay()], xp: 0, count: 0 })
  }
  for (const t of tasks) {
    const dates = new Set<string>()
    if (t.repeat.type === 'none') {
      if (t.completed) dates.add(t.date)
    } else {
      for (const d of t.completedDates || []) dates.add(d)
    }
    for (const d of dates) {
      const entry = map.get(d)
      if (entry) {
        entry.xp += t.points
        entry.count += 1
      }
    }
  }
  return [...map.values()]
}

function buildHeatmap(tasks: Task[], weeks: number) {
  const counts = new Map<string, number>()
  for (const t of tasks) {
    if (t.repeat.type === 'none') {
      if (t.completed) counts.set(t.date, (counts.get(t.date) || 0) + 1)
    } else {
      for (const d of t.completedDates || []) counts.set(d, (counts.get(d) || 0) + 1)
    }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - (weeks * 7 - 1))
  const cells: { date: string; count: number; future: boolean }[] = []
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (d.getTime() > today.getTime()) break
    cells.push({ date: localDateKey(d), count: counts.get(localDateKey(d)) || 0, future: false })
  }
  return cells
}

function levelOpacity(count: number): number {
  if (count <= 0) return 0.08
  if (count === 1) return 0.35
  if (count <= 3) return 0.6
  return 0.9
}

function BarChart({ data, color, max }: { data: DayStat[]; color: string; max: number }) {
  const top = Math.max(max, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96 }}>
      {data.map((d, i) => {
        const h = Math.max(4, (d.xp / top) * 100)
        const isToday = i === data.length - 1
        return (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
            <div style={{
              width: '100%', maxWidth: 22, height: `${h}%`, minHeight: 3,
              borderRadius: 4, background: color,
              opacity: isToday ? 1 : 0.65,
            }} />
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function StatsScreen() {
  const { state } = useApp()
  const { profile, tasks } = state

  const week = useMemo(() => buildDayStats(tasks, 7), [tasks])
  const twoWeeks = useMemo(() => buildDayStats(tasks, 14), [tasks])
  const heatmap = useMemo(() => buildHeatmap(tasks, 12), [tasks])

  const weekXp = week.reduce((s, d) => s + d.xp, 0)
  const weekTasks = week.reduce((s, d) => s + d.count, 0)
  const maxWeekXp = Math.max(...week.map(d => d.xp))
  const maxDayXp = Math.max(...twoWeeks.map(d => d.xp))
  const activeDays = heatmap.filter(c => c.count > 0).length
  const bestDay = [...twoWeeks].sort((a, b) => b.xp - a.xp)[0]

  return (
    <div className="page">
      <PageHeader title="Статистика" showBack />

      <main style={{ padding: '16px', flex: 1, overflow: 'auto' }}>
        <Card>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 90, background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)' }}>
                  <TrendingUp size={14} />
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Неделя</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>{weekXp} XP</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>{weekTasks} задач</div>
              </div>
              <div style={{ flex: 1, minWidth: 90, background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)' }}>
                  <ListChecks size={14} />
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Всего</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>{profile.totalPointsEarned} XP</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>{profile.tasksCompleted} задач</div>
              </div>
              <div style={{ flex: 1, minWidth: 90, background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)' }}>
                  <Flame size={14} />
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Серия</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>{profile.streak}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>макс. {profile.maxStreak}</div>
              </div>
              <div style={{ flex: 1, minWidth: 90, background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)' }}>
                  <CalendarDays size={14} />
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Дни</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>{profile.daysInGame}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>активных: {activeDays}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>
              XP за неделю
            </p>
            <BarChart data={week} color="var(--color-accent)" max={maxWeekXp} />
            {bestDay && bestDay.xp > 0 && (
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 10 }}>
                Лучший день: <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{new Date(bestDay.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span> — {bestDay.xp} XP, {bestDay.count} задач
              </p>
            )}
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>
              Задачи за 2 недели
            </p>
            <BarChart data={twoWeeks} color="var(--color-accent-light)" max={maxDayXp} />
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>
              Активность за 12 недель
            </p>
            {activeDays === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                Пока нет активности — выполни первую задачу
              </p>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <div
                  role="img"
                  aria-label={`Активность за 12 недель: ${activeDays} активных дней`}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 10px)', gridAutoRows: '10px', gap: 3, minWidth: 'max-content' }}
                >
                  {heatmap.map(c => (
                    <div key={c.date}
                      role="img"
                      aria-label={`${c.date}: ${c.count} задач`}
                      title={`${c.date}: ${c.count} задач`}
                      style={{
                        width: 10, height: 10, borderRadius: 2,
                        background: 'var(--color-accent)',
                        opacity: levelOpacity(c.count),
                      }} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 10, color: 'var(--color-text-muted)' }}>
              Меньше
              {[0, 1, 2, 4].map(l => (
                <span key={l} style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-accent)', opacity: levelOpacity(l) }} />
              ))}
              Больше
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              }}>
                <Trophy size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>Уровень {profile.level}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {profile.totalXp} всего XP · {profile.level >= LEVELS[LEVELS.length - 1].level ? 'Максимальный уровень' : `Текущий XP: ${profile.xp}`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <TabBar />
    </div>
  )
}
