import { useState, useMemo, useRef, FormEvent, useEffect } from 'react'
import { Plus, Pencil, Clock, Check, ClipboardList, Trash2, MoreHorizontal, X } from 'lucide-react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input, Select } from '../components/Input'
import { Modal } from '../components/Modal'
import { TabBar } from '../components/TabBar'
import { PageHeader } from '../components/PageHeader'
import { useApp } from '../context/AppContext'
import { Task, RepeatConfig } from '../types'
import { TASK_TEMPLATES } from '../constants/taskTemplates'
import { isCompletedOn, localDateKey } from '../utils/progression'

export function TasksScreen() {
  const { state, getTasksForDate, addTask, dispatch } = useApp()
  const { selectedDate } = state

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formErrors, setFormErrors] = useState<{ title?: string; points?: string; time?: string }>({})
  const [form, setForm] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '', points: 10, timeStart: '09:00', timeEnd: '10:00', date: selectedDate,
    repeat: { type: 'none', daysOfWeek: [], endDate: '' },
    completed: false,
  })

  const tasksForDate = useMemo(() =>
    getTasksForDate(selectedDate).slice().sort((a, b) => (a.timeStart || '00:00').localeCompare(b.timeStart || '00:00')),
    [selectedDate, state.tasks])

  const handleAdd = () => {
    setEditingTask(null); setFormErrors({})
    setForm({ title: '', points: 10, timeStart: '09:00', timeEnd: '10:00', date: selectedDate, repeat: { type: 'none', daysOfWeek: [], endDate: '' }, completed: false })
    setModalOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task); setFormErrors({})
    setForm({ title: task.title, points: task.points, timeStart: task.timeStart, timeEnd: task.timeEnd, date: task.date, repeat: task.repeat, completed: task.completed })
    setModalOpen(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errors: { title?: string; points?: string; time?: string } = {}
    if (!form.title.trim()) errors.title = 'Введите название'
    const pts = Number(form.points)
    if (isNaN(pts) || pts < 1) errors.points = 'Минимум 1'
    else if (pts > 1000) errors.points = 'Максимум 1000'
    if (form.timeStart && form.timeEnd && form.timeStart >= form.timeEnd) errors.time = 'Время начала должно быть раньше конца'
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    if (editingTask) dispatch({ type: 'UPDATE_TASK', payload: { ...editingTask, ...form, points: pts } })
    else addTask({ ...form, points: pts })
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
    setConfirmDeleteId(null)
  }
  const handleToggle = (id: string) => dispatch({ type: 'TOGGLE_TASK', payload: { id, date: selectedDate } })
  const handleRename = (id: string, title: string) => {
    const t = state.tasks.find(x => x.id === id)
    if (t) dispatch({ type: 'UPDATE_TASK', payload: { ...t, title } })
  }

  const today = new Date()
  const calendarDays = useMemo(() => {
    const days = []; const start = new Date(today.getFullYear(), today.getMonth(), 1)
    start.setDate(start.getDate() - 7)
    for (let i = 0; i < 44; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(localDateKey(d)) }
    return days
  }, [])

  const formatDay = (dateStr: string) => new Date(dateStr + 'T00:00:00').getDate().toString()
  const getDayName = (dateStr: string) => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date(dateStr + 'T00:00:00').getDay()]

  return (
    <div className="page">
      <PageHeader title="Дела" showBack />

      <div style={{
        marginTop: 'var(--header-height)', padding: '10px 16px 6px', overflowX: 'auto',
        display: 'flex', gap: 6, flexShrink: 0, background: 'var(--color-surface)',
        borderBottom: '0.5px solid var(--color-border)',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {calendarDays.map(day => {
          const isSelected = day === selectedDate; const isToday = day === localDateKey(today)
          return (
            <button key={day} onClick={() => dispatch({ type: 'SET_SELECTED_DATE', payload: day })}
              style={{
                minWidth: 44, height: 48, borderRadius: 'var(--radius)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, padding: '6px 4px', border: 'none',
                background: isSelected ? 'var(--color-accent)' : 'transparent',
                color: isSelected ? 'white' : isToday ? 'var(--color-accent)' : 'var(--color-text)',
                fontWeight: isSelected || isToday ? 500 : 400, fontSize: '13px',
                transition: 'var(--transition)', flexShrink: 0, cursor: 'pointer',
              }} aria-pressed={isSelected} aria-label={`${getDayName(day)}, ${formatDay(day)}`}
            >
              <span style={{ fontSize: '10px', opacity: isSelected ? 0.9 : 0.5 }}>{getDayName(day)}</span>
              <span style={{ fontSize: '16px' }}>{formatDay(day)}</span>
            </button>
          )
        })}
      </div>

      <main style={{ flex: 1, padding: '16px', overflow: 'auto' }} aria-live="polite">
        {tasksForDate.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--color-text-muted)' }}>
            <ClipboardList size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: 6, color: 'var(--color-text-secondary)' }}>Задач пока нет</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Нажми кнопку ниже, чтобы добавить</p>
          </div>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasksForDate.map(task => (
              <TaskCard key={task.id} task={task}
                completed={isCompletedOn(task, selectedDate)}
                onToggle={() => handleToggle(task.id)}
                onEdit={() => handleEdit(task)}
                onDelete={() => setConfirmDeleteId(task.id)}
                onRename={(t) => handleRename(task.id, t)}
              />
            ))}
          </ul>
        )}
      </main>

      <div style={{ padding: '0 16px 12px' }}>
        <Button variant="primary" size="md" fullWidth onClick={handleAdd}>
          <Plus size={16} /> Добавить
        </Button>
      </div>

      <TabBar />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Редактировать' : 'Новое дело'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
          <Input label="Название" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Например: Уборка" required error={formErrors.title} />
          {!editingTask && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TASK_TEMPLATES.map(tpl => {
                const active = form.title === tpl.title
                return (
                  <button key={tpl.title} type="button" onClick={() => setForm({ ...form, title: tpl.title, points: tpl.points, timeStart: tpl.timeStart, timeEnd: tpl.timeEnd })}
                    style={{
                      padding: '6px 12px', borderRadius: '9999px', border: '0.5px solid var(--color-border)', cursor: 'pointer',
                      background: active ? 'var(--color-accent-light)' : 'var(--color-surface)',
                      color: active ? 'var(--color-accent)' : 'var(--color-text)',
                      fontSize: '12px', fontWeight: 500, transition: 'var(--transition)',
                    }}
                  >{tpl.title} · {tpl.points}</button>
                )
              })}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input label="Баллы" type="number" min="1" max="1000" value={form.points}
              onChange={e => setForm({ ...form, points: e.target.value === '' ? 0 : Number(e.target.value) })}
              inputMode="numeric" error={formErrors.points} />
            <Input label="Дата" type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input label="От" type="time" value={form.timeStart} onChange={e => setForm({ ...form, timeStart: e.target.value })} />
            <Input label="До" type="time" value={form.timeEnd} onChange={e => setForm({ ...form, timeEnd: e.target.value })} />
          </div>
          {formErrors.time && <span style={{ fontSize: '12px', color: 'var(--color-danger)', display: 'block' }}>{formErrors.time}</span>}
          <Card>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: '11px', fontWeight: 500, marginBottom: 10, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Повторение</p>
              <Select label="Тип" value={form.repeat.type}
                onChange={e => setForm({ ...form, repeat: { ...form.repeat, type: e.target.value as RepeatConfig['type'] } })}
                options={[{ value: 'none', label: 'Без повтора' }, { value: 'daily', label: 'Ежедневно' }, { value: 'weekly', label: 'По дням недели' }]} />
              {form.repeat.type === 'weekly' && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 10px', borderRadius: '9999px', border: '0.5px solid var(--color-border)', background: form.repeat.daysOfWeek?.includes(i + 1) ? 'var(--color-accent-light)' : 'var(--color-surface)', color: form.repeat.daysOfWeek?.includes(i + 1) ? 'var(--color-accent)' : 'var(--color-text)', fontSize: '12px' }}>
                      <input type="checkbox" checked={form.repeat.daysOfWeek?.includes(i + 1)} onChange={e => {
                        const days = form.repeat.daysOfWeek || []
                        setForm({ ...form, repeat: { ...form.repeat, daysOfWeek: e.target.checked ? [...days, i + 1] : days.filter(x => x !== i + 1) } })
                      }} /> {d}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} flex={1}>Отмена</Button>
            <Button variant="primary" type="submit" flex={1}>{editingTask ? 'Сохранить' : 'Добавить'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Удалить задачу">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Задача будет удалена безвозвратно. Продолжить?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" type="button" onClick={() => setConfirmDeleteId(null)} flex={1}>Отмена</Button>
            <Button variant="danger" type="button" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)} flex={1}>Удалить</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function TaskCard({ task, completed, onToggle, onEdit, onDelete, onRename }: {
  task: Task; completed: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; onRename: (title: string) => void
}) {
  const isCompleted = completed
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(task.title)
  const [menuOpen, setMenuOpen] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const offsetRef = useRef(0)
  const startX = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const setOffset = (v: number) => { offsetRef.current = v; setSwipeOffset(v) }

  const onTouchStart = (e: React.TouchEvent) => {
    if (isCompleted || renaming) return
    startX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const dx = e.touches[0].clientX - startX.current
    setOffset(Math.max(-80, Math.min(80, dx)))
  }
  const onTouchEnd = () => {
    if (startX.current == null) return
    startX.current = null
    const o = offsetRef.current
    if (o <= -60) onEdit()
    else if (o >= 60) onDelete()
    setOffset(0)
  }

  useEffect(() => { if (renaming) inputRef.current?.focus(); inputRef.current?.select() }, [renaming])
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  const commitRename = () => {
    if (renameVal.trim() && renameVal !== task.title) onRename(renameVal.trim())
    setRenaming(false)
  }

  return (
    <li
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
      background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)', opacity: isCompleted ? 0.4 : 1,
      transition: 'opacity 0.3s ease, transform 0.3s ease', position: 'relative',
      transform: `translateX(${swipeOffset}px)`,
      animation: isCompleted ? 'fadeIn 0.3s ease' : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
        <button onClick={onToggle}
          style={{
            width: 22, height: 22, borderRadius: 5, flexShrink: 0,
            border: isCompleted ? 'none' : '1px solid var(--color-border)',
            background: isCompleted ? 'var(--color-accent)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
          aria-label={isCompleted ? 'Отменить' : 'Выполнить'}
        >
          <Check size={12} color={isCompleted ? 'white' : 'transparent'} strokeWidth={3} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {renaming ? (
            <input ref={inputRef} value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenaming(false); setRenameVal(task.title) } }}
              style={{
                width: '100%', padding: '2px 4px', fontSize: '14px', fontWeight: 500,
                border: '0.5px solid var(--color-accent)', borderRadius: 4,
                background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none',
              }}
            />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h3 style={{
                  fontSize: '14px', fontWeight: 500, color: 'var(--color-text)',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  cursor: 'default',
                }}
                  onDoubleClick={() => { if (!isCompleted) { setRenameVal(task.title); setRenaming(true) } }}
                  title="Двойной клик — переименовать"
                >
                  {task.title}
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-accent)', background: 'var(--color-accent-light)', padding: '1px 6px', borderRadius: '9999px' }}>
                  +{task.points}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> {task.timeStart}–{task.timeEnd}</span>
                {task.repeat.type !== 'none' && (
                  <span style={{ fontSize: '10px', padding: '1px 4px', borderRadius: '9999px', background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                    {task.repeat.type === 'daily' ? 'Ежедневно' : 'По неделям'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            aria-label="Действия"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div ref={menuRef} style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 50,
              background: 'var(--color-surface)', border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', padding: 4, minWidth: 140,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}>
              <button onClick={() => { onEdit(); setMenuOpen(false) }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, fontSize: '13px', color: 'var(--color-text)', cursor: 'pointer', border: 'none', background: 'transparent', textAlign: 'left' }}>
                <Pencil size={14} /> Редактировать
              </button>
              <button onClick={() => { onDelete(); setMenuOpen(false) }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, fontSize: '13px', color: 'var(--color-danger)', cursor: 'pointer', border: 'none', background: 'transparent', textAlign: 'left' }}>
                <Trash2 size={14} /> Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}