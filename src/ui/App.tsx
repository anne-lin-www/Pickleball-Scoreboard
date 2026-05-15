import { useEffect, useMemo, useState } from 'react'
import { createGame, handOut, scorePoint, undoLastPoint } from '../core/game'
import type { GameState } from '../core/types'
import { en } from '../i18n/en'
import { zhTW } from '../i18n/zh-TW'
import {
  clearGameState,
  loadGameState,
  saveGameState,
} from '../store/persistence'
import { Controls } from './components/Controls'
import { CourtDiagram } from './components/CourtDiagram'
import { GameSetup } from './components/GameSetup'
import { ScoreDisplay } from './components/ScoreDisplay'
import styles from './App.module.css'

type Language = 'en' | 'zh-TW'

const LANGUAGE_STORAGE_KEY = 'pickleball_lang'
const translations = { en, 'zh-TW': zhTW } as const

const detectLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh-TW') {
    return stored
  }

  return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh-TW' : 'en'
}

function App() {
  const [language, setLanguage] = useState<Language>(detectLanguage)
  const [game, setGame] = useState<GameState | null>(null)
  const [resumeCandidate, setResumeCandidate] = useState<GameState | null>(() => {
    const savedGame = loadGameState()
    return savedGame && !savedGame.gameOver ? savedGame : null
  })

  const labels = translations[language]

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (!game) {
      return undefined
    }

    if (game.gameOver) {
      clearGameState()
      return undefined
    }

    saveGameState(game)
    return undefined
  }, [game])

  useEffect(() => {
    if (!game || game.gameOver) {
      return undefined
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [game])

  const teamLabels = useMemo(() => {
    if (!game) {
      return { A: labels.teamA, B: labels.teamB }
    }

    if (game.settings.mode === 'singles') {
      return {
        A: game.players.find((player) => player.id === 'A1')?.name || labels.teamA,
        B: game.players.find((player) => player.id === 'B1')?.name || labels.teamB,
      }
    }

    return { A: labels.teamA, B: labels.teamB }
  }, [game, labels.teamA, labels.teamB])

  const startNewGame = () => {
    clearGameState()
    setGame(null)
    setResumeCandidate(null)
  }

  if (!game && resumeCandidate) {
    return (
      <main className={styles.appShell}>
        <div className={styles.resumeCard}>
          <button
            type="button"
            className={styles.languageToggle}
            onClick={() => setLanguage((current) => (current === 'en' ? 'zh-TW' : 'en'))}
          >
            {labels.language}: {language === 'en' ? '繁中' : 'EN'}
          </button>
          <h1>{labels.appTitle}</h1>
          <p>{labels.resumeGame}</p>
          <div className={styles.resumeActions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => {
                setGame(resumeCandidate)
                setResumeCandidate(null)
              }}
            >
              {labels.resume}
            </button>
            <button type="button" className={styles.secondaryAction} onClick={startNewGame}>
              {labels.newGame}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!game) {
    return (
      <main className={styles.appShell}>
        <GameSetup
          language={language}
          labels={labels}
          onLanguageChange={setLanguage}
          onStart={(settings, playerNames, startingTeam) => {
            clearGameState()
            setResumeCandidate(null)
            setGame(createGame(settings, playerNames, startingTeam))
          }}
        />
      </main>
    )
  }

  return (
    <main className={styles.appShell}>
      <div className={styles.gameScreen}>
        <header className={styles.topBar}>
          <div>
            <p className={styles.title}>{labels.appTitle}</p>
            {game.gameOver ? (
              <p className={styles.subtitle}>
                {teamLabels[game.winner ?? 'A']} {labels.wins}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.languageToggle}
            onClick={() => setLanguage((current) => (current === 'en' ? 'zh-TW' : 'en'))}
          >
            {labels.language}: {language === 'en' ? '繁中' : 'EN'}
          </button>
        </header>

        <ScoreDisplay state={game} labels={labels} teamLabels={teamLabels} />
        <CourtDiagram
          state={game}
          labels={labels}
          teamLabels={teamLabels}
          onScore={(team) => setGame((current) => (current ? scorePoint(current, team) : current))}
        />
        <Controls
          canHandOut={
            !game.gameOver &&
            game.settings.mode === 'doubles' &&
            !game.isFirstServe &&
            game.serverNumber === 1
          }
          gameOver={game.gameOver}
          labels={labels}
          teamLabels={teamLabels}
          onHandOut={() => setGame((current) => (current ? handOut(current) : current))}
          onNewGame={startNewGame}
          onScore={(team) => setGame((current) => (current ? scorePoint(current, team) : current))}
          onUndo={() => setGame((current) => (current ? undoLastPoint(current) : current))}
        />
      </div>
    </main>
  )
}

export default App
