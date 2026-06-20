import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'midnight-pro' | 'court-day'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = 'pb-theme'
const DEFAULT_THEME: Theme = 'midnight-pro'

function isValidTheme(v: string | null): v is Theme {
  return v === 'midnight-pro' || v === 'court-day'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem(STORAGE_KEY)
  const initial: Theme = isValidTheme(stored) ? stored : DEFAULT_THEME

  const [theme, setTheme] = useState<Theme>(initial)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'midnight-pro' ? 'court-day' : 'midnight-pro'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
