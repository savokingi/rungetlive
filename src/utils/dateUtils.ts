import { localDateKey } from './progression'

export function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()]
}

export function generateWeekDates(selectedDate: string): string[] {
  const d = new Date(selectedDate + 'T00:00:00')
  const day = d.getDay() || 7
  const start = new Date(d)
  start.setDate(d.getDate() - day + 1) // Monday
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(localDateKey(date))
  }
  return dates
}

export function generateMonthDates(baseDate: string): string[] {
  const d = new Date(baseDate + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const dates: string[] = []
  const startOffset = firstDay.getDay() || 7
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - startOffset + 1)
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(localDateKey(date))
  }
  return dates
}