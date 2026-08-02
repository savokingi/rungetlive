import type { Task } from '../types'

export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getDaysInGame(createdAt: number): number {
  const now = new Date()
  const start = new Date(createdAt)
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const b = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  return Math.max(1, Math.floor((a - b) / 86400000) + 1)
}

export function collectCompletedDates(tasks: Task[]): Set<string> {
  const out = new Set<string>()
  for (const t of tasks) {
    if (t.completed) out.add(t.date)
    for (const d of t.completedDates || []) out.add(d)
  }
  return out
}

export function isCompletedOn(task: Task, date: string): boolean {
  if (task.repeat.type === 'none') return task.completed && task.date === date
  return (task.completedDates || []).includes(date)
}

export function computeStreak(dates: Iterable<string>, today = localDateKey(new Date())): number {
  const set = new Set(dates)
  const cursor = new Date(today + 'T00:00:00')
  if (!set.has(today)) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (set.has(localDateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}