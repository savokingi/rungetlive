import { localDateKey } from './progression'

const MODEL = 'gemini-flash-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export interface GeminiTask {
  title: string
  points: number
  timeStart?: string
  timeEnd?: string
  date?: string
}

export interface GeminiResult {
  text: string
  tasks: GeminiTask[]
}

const SYSTEM_PROMPT = `Ты — планировщик задач в игровом приложении для продуктивности. Из сообщения пользователя извлеки от 1 до 5 задач.
Верни строго JSON без пояснений в формате:
{"reply":"короткий ответ пользователю по-русски","tasks":[{"title":"название","points":число от 1 до 1000,"timeStart":"ЧЧ:ММ","timeEnd":"ЧЧ:ММ","date":"ГГГГ-ММ-ДД"}]}
Если понятных задач нет — верни {"reply":"короткий уточняющий вопрос","tasks":[]}.
date: если пользователь говорит "сегодня" — сегодняшняя дата, иначе — завтрашняя. Используй только текущую реальную дату.
timeStart/timeEnd: если время не указано, поставь пустые строки.`

const tomorrowKey = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return localDateKey(d)
}

function sanitizeTask(raw: any): GeminiTask | null {
  const title = typeof raw?.title === 'string' ? raw.title.trim().slice(0, 100) : ''
  if (!title) return null
  const points = Math.max(1, Math.min(1000, Number(raw?.points) || 10))
  const time = (v: unknown) => (typeof v === 'string' && /^\d{2}:\d{2}$/.test(v) ? v : '')
  const date = typeof raw?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date) ? raw.date : tomorrowKey()
  return { title, points, timeStart: time(raw?.timeStart) || undefined, timeEnd: time(raw?.timeEnd) || undefined, date }
}

export async function askGemini(userInput: string, apiKey: string): Promise<GeminiResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 25000)
  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nСообщение пользователя: ${userInput}` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Gemini HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`)
    }
    const data = await res.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error('Gemini: пустой ответ')
    let parsed: any
    try {
      parsed = JSON.parse(rawText)
    } catch {
      parsed = { reply: rawText, tasks: [] }
    }
    const tasks = (Array.isArray(parsed?.tasks) ? parsed.tasks : [])
      .map(sanitizeTask)
      .filter((t: GeminiTask | null): t is GeminiTask => t !== null)
      .slice(0, 5)
    const text = typeof parsed?.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim()
      : tasks.length > 0
        ? 'Готово, внёс в список дел.'
        : 'Не понял, что добавить. Напиши конкретнее: что, когда и за сколько баллов.'
    return { text, tasks }
  } finally {
    clearTimeout(timer)
  }
}
