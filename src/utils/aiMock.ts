import { ParsedTask } from '../types'
import { localDateKey } from './progression'

type TaskTemplate = { title: string; points: number; timeStart: string; timeEnd: string }

const KEYWORD_TASKS: Record<string, TaskTemplate[]> = {
  'уборка': [{ title: 'УБОРКА', points: 10, timeStart: '10:00', timeEnd: '11:00' }],
  'обед': [{ title: 'ОБЕД', points: 5, timeStart: '12:00', timeEnd: '13:00' }],
  'спорт': [{ title: 'СПОРТ', points: 15, timeStart: '18:00', timeEnd: '19:30' }],
  'тренировка': [{ title: 'ТРЕНИРОВКА', points: 15, timeStart: '18:00', timeEnd: '19:30' }],
  'работа': [{ title: 'РАБОТА', points: 20, timeStart: '09:00', timeEnd: '18:00' }],
  'занятие': [{ title: 'ЗАНЯТИЕ', points: 20, timeStart: '14:00', timeEnd: '15:30' }],
  'учеба': [{ title: 'УЧЁБА', points: 15, timeStart: '19:00', timeEnd: '20:30' }],
  'чтение': [{ title: 'ЧТЕНИЕ', points: 10, timeStart: '21:00', timeEnd: '22:00' }],
  'прогулка': [{ title: 'ПРОГУЛКА', points: 10, timeStart: '17:00', timeEnd: '18:00' }],
  'покупки': [{ title: 'ПОКУПКИ', points: 10, timeStart: '14:00', timeEnd: '15:00' }],
  'врач': [{ title: 'ВРАЧ', points: 15, timeStart: '10:00', timeEnd: '11:00' }],
  'встреча': [{ title: 'ВСТРЕЧА', points: 15, timeStart: '15:00', timeEnd: '16:00' }],
  'звонок': [{ title: 'ЗВОНОК', points: 5, timeStart: '13:00', timeEnd: '13:30' }],
  'отчёт': [{ title: 'ОТЧЁТ', points: 20, timeStart: '09:00', timeEnd: '11:00' }],
  'дедлайн': [{ title: 'ДЕДЛАЙН', points: 25, timeStart: '09:00', timeEnd: '18:00' }],
  'спортзал': [{ title: 'СПОРТЗАЛ', points: 20, timeStart: '18:00', timeEnd: '20:00' }],
  'бег': [{ title: 'БЕГ', points: 15, timeStart: '07:00', timeEnd: '08:00' }],
  'йога': [{ title: 'ЙОГА', points: 15, timeStart: '08:00', timeEnd: '09:00' }],
  'медитация': [{ title: 'МЕДИТАЦИЯ', points: 10, timeStart: '07:00', timeEnd: '07:20' }],
}

export function mockAIResponse(userInput: string): { text: string; tasks: ParsedTask[] } {
  const input = userInput.toLowerCase()
  const today = localDateKey(new Date())
  const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = localDateKey(tomorrowDate)
  const dayAfterDate = new Date(); dayAfterDate.setDate(dayAfterDate.getDate() + 2)
  const dayAfter = localDateKey(dayAfterDate)

  const dateWord = input.includes('сегодня') || input.includes('сейчас') ? today
    : input.includes('послезавтра') ? dayAfter
    : tomorrow

  const matchedTasks: ParsedTask[] = []

  Object.entries(KEYWORD_TASKS).forEach(([keyword, tasks]) => {
    if (input.includes(keyword)) {
      tasks.forEach(template => {
        matchedTasks.push({
          title: template.title,
          points: template.points,
          timeStart: template.timeStart,
          timeEnd: template.timeEnd,
          date: dateWord,
          confirmed: false,
          editing: false,
        })
      })
    }
  })

  const uniqueTasks = matchedTasks.filter((task, index, self) =>
    index === self.findIndex(t => t.title === task.title && t.timeStart === task.timeStart)
  ).slice(0, 3)

  const responseText = uniqueTasks.length > 0
    ? (dateWord === today ? 'ОТЛИЧНО, ВНЕСУ В СПИСОК ДЕЛ НА СЕГОДНЯ.' : 'ОТЛИЧНО, ВНЕСУ В СПИСОК ДЕЛ НА ЗАВТРА.')
    : 'ПОНЯЛ. НАПИШИ КОНКРЕТНЕЕ: НАЗВАНИЕ, ВРЕМЯ, БАЛЛЫ.'

  return { text: responseText, tasks: uniqueTasks }
}