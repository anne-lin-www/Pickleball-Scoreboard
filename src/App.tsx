import React, { useState } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import { LocaleProvider } from './i18n/LocaleContext'
import SetupScreen, { type SetupConfig } from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import { createGame } from './core/gameInit'
import type { DoublesGame } from './core/doubles/DoublesGame'
import type { SinglesGame } from './core/singles/SinglesGame'

type Screen = 'setup' | 'game' | 'game-over'

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [config, setConfig] = useState<SetupConfig | null>(null)
  const [game, setGame] = useState<DoublesGame | SinglesGame | null>(null)
  const [winner, setWinner] = useState<string>('')

  function handleStart(cfg: SetupConfig) {
    setConfig(cfg)
    setGame(createGame(cfg))
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
        {screen === 'game' && config !== null && game !== null && (
          <GameScreen game={game} config={config} onReset={handleReset} />
        )}
        {(screen === 'game-over' || (screen === 'game' && (config === null || game === null))) && (
          <GameOverScreen winner={winner} onRematch={handleRematch} />
        )}
      </LocaleProvider>
    </ThemeProvider>
  )
}
