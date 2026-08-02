import { useState, useEffect, useRef } from 'react'
import { Send, CheckSquare2, Edit2 } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { mockAIResponse } from '../utils/aiMock'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  tasks?: ParsedTask[]
  timestamp: number
}

interface ParsedTask {
  title: string
  points: number
  timeStart?: string
  timeEnd?: string
  date?: string
  confirmed: boolean
  editing: boolean
}

export function AIScreen() {
  const { addTask } = useApp()

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Напиши, что нужно сделать, и я добавлю в список дел.', timestamp: Date.now() - 1000 },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')
    setSending(true)

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg, timestamp: Date.now() }])

    setTimeout(() => {
      const { text, tasks } = mockAIResponse(userMsg)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        tasks: tasks.map(t => ({ ...t, confirmed: false, editing: false })),
        timestamp: Date.now(),
      }])
      setSending(false)
    }, 800)
  }

  const handleConfirmTask = (msgId: string, taskIndex: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.tasks) return m
      const task = m.tasks![taskIndex]
      addTask({
        title: task.title,
        points: task.points,
        timeStart: task.timeStart || '09:00',
        timeEnd: task.timeEnd || '10:00',
        date: task.date || new Date().toISOString().split('T')[0],
        repeat: { type: 'none', daysOfWeek: [], endDate: '' },
        completed: false,
      })
      return { ...m, tasks: m.tasks!.map((t, i) => i === taskIndex ? { ...t, confirmed: true } : t) }
    }))
  }

  const handleEditTask = (msgId: string, taskIndex: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.tasks) return m
      return { ...m, tasks: m.tasks!.map((t, i) => i === taskIndex ? { ...t, editing: true } : t) }
    }))
  }

  const handleSaveEdit = (msgId: string, taskIndex: number, newTitle: string, newPoints: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId || !m.tasks) return m
      return { ...m, tasks: m.tasks!.map((t, i) => i === taskIndex ? { ...t, title: newTitle, points: newPoints, editing: false } : t) }
    }))
  }

  return (
    <div className="page">
      <PageHeader title="ИИ-ассистент" showBack />

      <main style={{ flex: 1, padding: '16px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 8, maxWidth: '85%',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--radius)',
              background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: msg.role === 'user' ? 'white' : 'var(--color-text)',
              border: msg.role === 'user' ? 'none' : '0.5px solid var(--color-border)',
              fontSize: '15px',
            }}>
              {msg.content}
            </div>

            {msg.tasks && msg.tasks.length > 0 && (
              <Card style={{ width: '100%', marginTop: 4 }}>
                {msg.tasks.map((task, i) => (
                  <div key={i} style={{ padding: '12px', borderBottom: i < msg.tasks!.length - 1 ? '0.5px solid var(--color-border)' : 'none' }}>
                    {task.editing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Input value={task.title} onChange={e => handleSaveEdit(msg.id, i, e.target.value, task.points)} autoFocus />
                        <Input label="Баллы" type="number" value={task.points} onChange={e => handleSaveEdit(msg.id, i, task.title, Number(e.target.value))} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button variant="primary" size="sm" onClick={() => handleSaveEdit(msg.id, i, task.title, task.points)}>Сохранить</Button>
                          <Button variant="ghost" size="sm" onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, tasks: m.tasks!.map((t, j) => j === i ? { ...t, editing: false } : t) } : m))}>Отмена</Button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '15px' }}>{task.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            +{task.points} {task.timeStart && task.timeEnd ? `· ${task.timeStart}–${task.timeEnd}` : ''}
                          </div>
                        </div>
                        {task.confirmed ? (
                          <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>Добавлено</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Button variant="secondary" size="sm" onClick={() => handleConfirmTask(msg.id, i)}>
                              <CheckSquare2 size={14} /> Добавить
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditTask(msg.id, i)}>
                              <Edit2 size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <div style={{ padding: '16px', borderTop: '0.5px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Input value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Напиши..."
              aria-label="Сообщение"
              disabled={sending}
            />
          </div>
          <Button variant="primary" size="md" onClick={handleSend} disabled={!input.trim() || sending} aria-label="Отправить">
            <Send size={20} />
          </Button>
        </div>
      </div>

      <TabBar />
    </div>
  )
}