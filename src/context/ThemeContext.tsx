import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { ThemeConfig, ThemeMode, AccentColor } from '../types'

interface ThemeContextType {
  config: ThemeConfig
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  toggleMode: () => void
}

const THEME_STORAGE_KEY = 'rungetlive-theme'

const defaultConfig: ThemeConfig = {
  mode: 'dark',
  accent: 'green',
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultConfig
    } catch {
      return defaultConfig
    }
  })

  const applyTheme = useCallback((cfg: ThemeConfig) => {
    const root = document.documentElement
    root.setAttribute('data-theme', cfg.mode)
    root.setAttribute('data-accent', cfg.accent)
  }, [])

  useEffect(() => {
    applyTheme(config)
    try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config)) } catch { }
  }, [config, applyTheme])

  const setMode = (mode: ThemeMode) => setConfig(prev => ({ ...prev, mode }))
  const setAccent = (accent: AccentColor) => setConfig(prev => ({ ...prev, accent }))
  const toggleMode = () => setConfig(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }))

  return (
    <ThemeContext.Provider value={{ config, setMode, setAccent, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}