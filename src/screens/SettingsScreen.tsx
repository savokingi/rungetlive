import { useState } from 'react'
import { Moon, Sun, Bot, Key, Shield, Bell, Globe, Music, Download, RefreshCw, Info, Palette } from 'lucide-react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { PageHeader } from '../components/PageHeader'
import { TabBar } from '../components/TabBar'
import { useApp } from '../context/AppContext'
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

  const setSetting = (patch: Partial<SettingsState>) => dispatch({ type: 'SET_SETTINGS', payload: patch })

  const handleAiChange = (key: keyof AIConfig, value: any) => {
    const newConfig = { ...aiConfig, [key]: value }
    setAiConfig(newConfig)
    dispatch({ type: 'SET_AI_CONFIG', payload: newConfig })
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
    { value: 'subscription', label: 'По подписке (мой API)', icon: <Shield size={18} /> },
    { value: 'custom', label: 'Свой API-ключ', icon: <Key size={18} /> },
    { value: 'disabled', label: 'Отключить ИИ', icon: <Bot size={18} /> },
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
                  <Input label="API Key" type="password" value={aiConfig.customApiKey} onChange={e => handleAiChange('customApiKey', e.target.value)} placeholder="sk-..." />
                  <Input label="Base URL (опционально)" value={aiConfig.customBaseUrl} onChange={e => handleAiChange('customBaseUrl', e.target.value)} placeholder="https://api.openai.com/v1" />
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
            <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 12 }}>Язык</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }].map(opt => (
                <button key={opt.value} onClick={() => setSetting({ language: opt.value as 'ru' | 'en' })} style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius)',
                  border: `1px solid ${settings.language === opt.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: settings.language === opt.value ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  color: settings.language === opt.value ? 'var(--color-accent)' : 'var(--color-text)',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)',
                }}
                  aria-pressed={settings.language === opt.value}
                >{opt.label}</button>
              ))}
            </div>
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
            <SettingItem icon={<RefreshCw size={20} />} label="Сброс прогресса" variant="danger"
              trailing={<Button variant="danger" size="sm" onClick={handleReset}>Сбросить</Button>} />
            <SettingItem icon={<Info size={20} />} label="О приложении" trailing={<span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>v0.1.0</span>} />
          </div>
        </Card>
      </main>

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