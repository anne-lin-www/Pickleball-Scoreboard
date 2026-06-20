import React, { useState } from 'react'
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

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  if (screen === 'game' && config !== null) {
    return <GameScreen config={config} onReset={handleReset} />
  }

  return <GameOverScreen winner={winner} onRematch={handleRematch} />
}
