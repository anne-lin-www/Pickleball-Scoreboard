import React from 'react'
import { useTheme } from '../theme/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className="btn btn-ghost btn-sm px-2"
      onClick={toggleTheme}
      aria-label="切換主題"
    >
      {theme === 'midnight-pro' ? '🌙' : '☀️'}
    </button>
  )
}
