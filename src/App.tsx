import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import { LocaleProvider } from './i18n/LocaleContext'
import SetupScreen, { type SetupConfig } from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'
import { ResumeDialog } from './components/ResumeDialog'
import { createGame } from './core/gameInit'
import { DoublesGame } from './core/doubles/DoublesGame'
import { SinglesGame } from './core/singles/SinglesGame'
import { useGamePersistence, type PersistedGameState } from './hooks/useGamePersistence'

type Screen = 'setup' | 'game' | 'game-over'

function rehydrateGame(persisted: PersistedGameState): DoublesGame | SinglesGame {
  return persisted.game.type === 'singles'
    ? SinglesGame.fromSerialized(persisted.game)
    : DoublesGame.fromSerialized(persisted.game)
}

export default function App() {
  const { loadPersistedState, saveGameState, clearGameState, markSessionActive, isSessionActive } = useGamePersistence()

  const [screen, setScreen] = useState<Screen>(() => {
    const persisted = loadPersistedState()
    return (persisted && isSessionActive()) ? 'game' : 'setup'
  })
  const [config, setConfig] = useState<SetupConfig | null>(() => {
    const persisted = loadPersistedState()
    return (persisted && isSessionActive()) ? persisted.config : null
  })
  const [game, setGame] = useState<DoublesGame | SinglesGame | null>(() => {
    const persisted = loadPersistedState()
    return (persisted && isSessionActive()) ? rehydrateGame(persisted) : null
  })
  const [winner, setWinner] = useState<string>('')
  const [pendingResume, setPendingResume] = useState<PersistedGameState | null>(() => {
    const persisted = loadPersistedState()
    return (persisted && !isSessionActive()) ? persisted : null
  })

  useEffect(() => {
    if (screen === 'game' && game !== null && config !== null) {
      saveGameState(config, game)
    }
  }, [screen, game])

  function handleStart(cfg: SetupConfig) {
    setConfig(cfg)
    setGame(createGame(cfg))
    setScreen('game')
    markSessionActive()
  }

  function handleReset(winnerName: string) {
    setWinner(winnerName)
    setScreen('game-over')
  }

  function handleRematch() {
    clearGameState()
    setScreen('setup')
  }

  function handleResume() {
    if (!pendingResume) return
    setConfig(pendingResume.config)
    setGame(rehydrateGame(pendingResume))
    setScreen('game')
    markSessionActive()
    setPendingResume(null)
  }

  function handleNewGame() {
    clearGameState()
    setPendingResume(null)
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
        {pendingResume !== null && (
          <ResumeDialog
            config={pendingResume.config}
            onResume={handleResume}
            onNewGame={handleNewGame}
            defaultAction={Date.now() - pendingResume.savedAt < 30 * 60 * 1000 ? 'resume' : 'new-game'}
          />
        )}
      </LocaleProvider>
    </ThemeProvider>
  )
}
