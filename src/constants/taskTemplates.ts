export interface TaskTemplate {
  title: string
  points: number
  timeStart: string
  timeEnd: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  { title: 'Уборка', points: 10, timeStart: '10:00', timeEnd: '11:00' },
  { title: 'Спорт', points: 15, timeStart: '18:00', timeEnd: '19:30' },
  { title: 'Работа', points: 20, timeStart: '09:00', timeEnd: '18:00' },
  { title: 'Учёба', points: 15, timeStart: '19:00', timeEnd: '20:30' },
  { title: 'Чтение', points: 10, timeStart: '21:00', timeEnd: '22:00' },
  { title: 'Прогулка', points: 10, timeStart: '17:00', timeEnd: '18:00' },
  { title: 'Медитация', points: 10, timeStart: '07:00', timeEnd: '07:20' },
  { title: 'Звонок', points: 5, timeStart: '13:00', timeEnd: '13:30' },
]
