import { useRef, useState } from 'react'
import { Moon, Sun, Key, Shield, Bell, Music, Download, Upload, RefreshCw, Info } from 'lucide-react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TabBar } from '../components/TabBar'
import { useApp, STORAGE_KEY } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { AIConfig, ThemeMode, AccentColor } from '../types'
import type { SettingsState } from '../context/AppContext'
import { isCompletedOn, localDateKey } from '../utils/progression'

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob(['\ufeff' + content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function SettingsScreen() {
  const { state, dispatch } = useApp()
  const { config, setMode, setAccent } = useTheme()

  const [aiConfig, setAiConfig] = useState<AIConfig>(state.aiConfig)
  const { settings } = state

  const [pendingImport, setPendingImport] = useState<any>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setSetting = (patch: Partial<SettingsState>) => dispatch({ type: 'SET_SETTINGS', payload: patch })

  const handleAiChange = (key: keyof AIConfig, value: any) => {
    const newConfig = { ...aiConfig, [key]: value }
    setAiConfig(newConfig)
    dispatch({ type: 'SET_AI_CONFIG', payload: newConfig })
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!data || typeof data !== 'object' || !Array.isArray(data.tasks)) {
          throw new Error('Неверный формат файла')
        }
        setPendingImport(data)
        setImportError(null)
      } catch {
        setImportError('Не удалось прочитать файл: это не корректный экспорт RunGetLive.')
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = () => {
    const data = pendingImport
    if (!data) return
    const patch: Record<string, unknown> = {}
    if (data.profile) patch.profile = data.profile
    if (Array.isArray(data.tasks)) patch.tasks = data.tasks
    if (Array.isArray(data.achievements)) patch.achievements = data.achievements
    if (Array.isArray(data.skins)) patch.skins = data.skins
    if (data.aiConfig) patch.aiConfig = data.aiConfig
    if (typeof data.selectedSkinId === 'string') patch.selectedSkinId = data.selectedSkinId
    dispatch({ type: 'LOAD', payload: patch })
    try {
      const merged = { ...state, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    } catch { }
    setAiConfig({ ...aiConfig, ...(data.aiConfig || {}) })
    setPendingImport(null)
    setImportError('Данные импортированы.')
    setTimeout(() => setImportError(null), 4000)
  }

  const handleExportJson = () => {
    downloadFile(
      JSON.stringify({
        exportedAt: new Date().toISOString(),
        profile: state.profile,
        tasks: state.tasks,
        achievements: state.achievements,
        aiConfig: state.aiConfig,
        skins: state.skins,
      }, null, 2),
      'rungetlive-data.json',
      'application/json'
    )
  }

  const handleExportCsv = () => {
    const header = 'Название;Баллы;Дата;Время;Повторение;Выполнено'
    const rows = state.tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.points,
      t.date,
      `${t.timeStart}-${t.timeEnd}`,
      t.repeat.type,
      isCompletedOn(t, localDateKey(new Date())) ? 'да' : 'нет',
    ].join(';'))
    downloadFile([header, ...rows].join('\r\n'), 'rungetlive-tasks.csv', 'text/csv')
  }

  const handleReset = () => {
    if (window.confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
      localStorage.removeItem('rungetlive-state')
      localStorage.removeItem('rungetlive-theme')
      window.location.reload()
    }
  }

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Светлая', icon: <Sun size={20} /> },
    { value: 'dark', label: 'Тёмная', icon: <Moon size={20} /> },
  ]

  const accentOptions: { value: AccentColor; label: string }[] = [
    { value: 'green', label: 'Зелёный' },
    { value: 'blue', label: 'Голубой' },
    { value: 'red', label: 'Красный' },
    { value: 'purple', label: 'Фиолетовый' },
    { value: 'orange', label: 'Оранжевый' },
  ]

  const aiProviderOptions = [
    { value: 'custom', label: 'Gemini (свой API-ключ)', icon: <Key size={18} /> },
    { value: 'disabled', label: 'Отключить ИИ', icon: <Shield size={18} /> },
  ]

  return (
    <div className="page">
      <PageHeader title="Настройки" showBack />

      <main style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <Card>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-border))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-accent)', fontWeight: 700, fontSize: '18px',
              }}>
                {state.profile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-text)' }}>{state.profile.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  <span>Уровень {state.profile.level} · {state.profile.xp} XP · {state.profile.daysInGame} дн.</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Оформление</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {themeOptions.map(opt => (
                <button key={opt.value} onClick={() => setMode(opt.value)} style={{
                  flex: 1, padding: '16px 12px', borderRadius: 'var(--radius)',
                  border: `1px solid ${config.mode === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: config.mode === opt.value ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  color: config.mode === opt.value ? 'var(--color-accent)' : 'var(--color-text)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Акцентный цвет</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {accentOptions.map(opt => (
                  <button key={opt.value} onClick={() => setAccent(opt.value)} style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${config.accent === opt.value ? 'var(--color-accent)' : 'transparent'}`,
                    background: `var(--color-accent)`, cursor: 'pointer',
                    transition: 'var(--transition)', outline: 'none',
                  }} aria-label={opt.label} aria-pressed={config.accent === opt.value} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>ИИ-ассистент</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiProviderOptions.map(opt => (
                <button key={opt.value} onClick={() => handleAiChange('type', opt.value)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius)',
                  border: `1px solid ${aiConfig.type === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: aiConfig.type === opt.value ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  color: 'var(--color-text)', cursor: 'pointer', transition: 'var(--transition)',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: aiConfig.type === opt.value ? 'var(--color-accent)' : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: aiConfig.type === opt.value ? 'white' : 'var(--color-text-secondary)', flexShrink: 0 }}>
                    {opt.icon}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{opt.label}</span>
                </button>
              ))}
              {aiConfig.type === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, paddingLeft: 48 }}>
                  <Input label="API Key (Gemini)" type="password" value={aiConfig.customApiKey} onChange={e => handleAiChange('customApiKey', e.target.value)} placeholder="AIza..." />
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                    Запросы идут напрямую в Google из браузера. Ключ хранится только на вашем устройстве.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Уведомления</p>
            <SettingItem icon={<Bell size={20} />} label="Включить напоминания"
              trailing={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {settings.notifications.enabled && (
                    <input type="time" value={settings.notifications.time}
                      onChange={e => setSetting({ notifications: { ...settings.notifications, time: e.target.value } })} />
                  )}
                  <Switch checked={settings.notifications.enabled} onChange={v => setSetting({ notifications: { ...settings.notifications, enabled: v } })} />
                </div>
              } />
          </div>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Другое</p>
            <SettingItem icon={<Music size={20} />} label="Звуки" trailing={<Switch checked={settings.sounds} onChange={v => setSetting({ sounds: v })} />} />
            <SettingItem icon={<Download size={20} />} label="Экспорт данных" trailing={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={handleExportJson}>JSON</Button>
                <Button variant="secondary" size="sm" onClick={handleExportCsv}>CSV</Button>
              </div>
            } />
            <SettingItem icon={<Upload size={20} />} label="Импорт из JSON" trailing={
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Выбрать файл</Button>
            } />
            <SettingItem icon={<RefreshCw size={20} />} label="Сброс прогресса" variant="danger"
              trailing={<Button variant="danger" size="sm" onClick={handleReset}>Сбросить</Button>} />
            <SettingItem icon={<Info size={20} />} label="О приложении" trailing={<span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>v0.1.0</span>} />
          </div>
        </Card>

        {importError && (
          <p style={{
            marginTop: 12, fontSize: '13px', textAlign: 'center',
            color: 'var(--color-accent)', padding: '8px 12px',
            background: 'var(--color-accent-light)', borderRadius: 'var(--radius-sm)',
          }}>{importError}</p>
        )}
      </main>

      <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileSelected} style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />

      <Modal isOpen={pendingImport !== null} onClose={() => setPendingImport(null)} title="Импорт данных">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Текущий прогресс будет заменён данными из файла. Продолжить?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" type="button" onClick={() => setPendingImport(null)} flex={1}>Отмена</Button>
            <Button variant="primary" type="button" onClick={handleConfirmImport} flex={1}>Импортировать</Button>
          </div>
        </div>
      </Modal>

      <TabBar />
    </div>
  )
}

function SettingItem({ icon, label, trailing, variant }: { icon: React.ReactNode; label: string; trailing?: React.ReactNode; variant?: 'danger' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '0.5px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: variant === 'danger' ? 'var(--color-danger-light)' : 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)' }}>
          {icon}
        </div>
        <span style={{ fontSize: '15px', fontWeight: 500, color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-text)' }}>{label}</span>
      </div>
      {trailing}
    </div>
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: checked ? 'var(--color-accent)' : 'var(--color-border)',
      position: 'relative', transition: 'var(--transition)',
    }} aria-checked={checked} aria-label="Toggle">
      <span style={{
        position: 'absolute', top: 2, left: checked ? 20 : 2, width: 22, height: 22,
        borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s ease',
      }} />
    </button>
  )
}