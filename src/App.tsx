import React, { useState } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import { LocaleProvider } from './i18n/LocaleContext'
import SetupScreen, { type SetupConfig } from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'

type Screen = 'setup' | 'game' | 'game-over'

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [config, setConfig] = useState<SetupConfig | null>(null)
  const [winner, setWinner] = useState<string>('')

  function handleStart(cfg: SetupConfig) {
    setConfig(cfg)
    setScreen('game')
  }

  function handleReset(winnerName: string) {
    setWinner(winnerName)
    setScreen('game-over')
  }

  function handleRematch() {
    setScreen('setup')
  }

  return (
    <ThemeProvider>
      <LocaleProvider>
        {screen === 'setup' && <SetupScreen onStart={handleStart} />}
        {screen === 'game' && config !== null && (
          <GameScreen config={config} onReset={handleReset} />
        )}
        {(screen === 'game-over' || (screen === 'game' && config === null)) && (
          <GameOverScreen winner={winner} onRematch={handleRematch} />
        )}
      </LocaleProvider>
    </ThemeProvider>
  )
}
