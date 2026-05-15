import { useMemo, useState, type FormEvent } from 'react'
import type { GameSettings, Team } from '../../core/types'
import styles from './GameSetup.module.css'

type SetupFormState = {
  a1: string
  a2: string
  b1: string
  b2: string
}

type Labels = {
  appTitle: string
  singles: string
  doubles: string
  startGame: string
  winScore: string
  winByTwo: string
  teamA: string
  teamB: string
  playerName: string
  language: string
  startingTeam: string
  teamServesFirst: string
}

type Props = {
  language: 'en' | 'zh-TW'
  labels: Labels
  onLanguageChange: (language: 'en' | 'zh-TW') => void
  onStart: (
    settings: GameSettings,
    playerNames: { a1: string; a2: string; b1: string; b2: string },
    startingTeam: Team,
  ) => void
}

const DEFAULT_PLAYERS: Record<'singles' | 'doubles', SetupFormState> = {
  singles: { a1: 'A', a2: '', b1: 'B', b2: '' },
  doubles: { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
}

export function GameSetup({ language, labels, onLanguageChange, onStart }: Props) {
  const [mode, setMode] = useState<'singles' | 'doubles'>('doubles')
  const [players, setPlayers] = useState<SetupFormState>(DEFAULT_PLAYERS.doubles)
  const [winScoreOption, setWinScoreOption] = useState<'11' | '15' | '21' | 'custom'>('11')
  const [customWinScore, setCustomWinScore] = useState('11')
  const [winByTwo, setWinByTwo] = useState(true)
  const [startingTeam, setStartingTeam] = useState<Team>('A')

  const resolvedWinScore = useMemo(() => {
    if (winScoreOption === 'custom') {
      return Math.max(1, Number.parseInt(customWinScore, 10) || 11)
    }

    return Number.parseInt(winScoreOption, 10)
  }, [customWinScore, winScoreOption])

  const updatePlayer = (field: keyof SetupFormState, value: string) => {
    setPlayers((current) => ({ ...current, [field]: value }))
  }

  const changeMode = (nextMode: 'singles' | 'doubles') => {
    setMode(nextMode)
    setPlayers((current) => {
      const defaults = DEFAULT_PLAYERS[nextMode]
      return {
        a1: current.a1 || defaults.a1,
        a2: nextMode === 'doubles' ? current.a2 || defaults.a2 : '',
        b1: current.b1 || defaults.b1,
        b2: nextMode === 'doubles' ? current.b2 || defaults.b2 : '',
      }
    })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onStart(
      {
        mode,
        winScore: resolvedWinScore,
        winByTwo,
      },
      {
        a1: players.a1.trim() || DEFAULT_PLAYERS[mode].a1,
        a2: mode === 'doubles' ? players.a2.trim() || 'A2' : '',
        b1: players.b1.trim() || DEFAULT_PLAYERS[mode].b1,
        b2: mode === 'doubles' ? players.b2.trim() || 'B2' : '',
      },
      startingTeam,
    )
  }

  return (
    <form className={styles.setup} onSubmit={submit}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>React 18 · Vite · Vitest</p>
          <h1 className={styles.title}>{labels.appTitle}</h1>
        </div>
        <button
          type="button"
          className={styles.languageToggle}
          onClick={() => onLanguageChange(language === 'en' ? 'zh-TW' : 'en')}
        >
          {labels.language}: {language === 'en' ? '繁中' : 'EN'}
        </button>
      </header>

      <section className={styles.card}>
        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={mode === 'singles' ? styles.segmentActive : styles.segment}
            onClick={() => changeMode('singles')}
          >
            {labels.singles}
          </button>
          <button
            type="button"
            className={mode === 'doubles' ? styles.segmentActive : styles.segment}
            onClick={() => changeMode('doubles')}
          >
            {labels.doubles}
          </button>
        </div>

        <div className={styles.fields}>
          <label className={styles.field}>
            <span>{mode === 'singles' ? labels.teamA : 'A1'}</span>
            <input
              value={players.a1}
              onChange={(event) => updatePlayer('a1', event.target.value)}
              placeholder={`${labels.playerName} A1`}
            />
          </label>
          {mode === 'doubles' ? (
            <label className={styles.field}>
              <span>A2</span>
              <input
                value={players.a2}
                onChange={(event) => updatePlayer('a2', event.target.value)}
                placeholder={`${labels.playerName} A2`}
              />
            </label>
          ) : null}
          <label className={styles.field}>
            <span>{mode === 'singles' ? labels.teamB : 'B1'}</span>
            <input
              value={players.b1}
              onChange={(event) => updatePlayer('b1', event.target.value)}
              placeholder={`${labels.playerName} B1`}
            />
          </label>
          {mode === 'doubles' ? (
            <label className={styles.field}>
              <span>B2</span>
              <input
                value={players.b2}
                onChange={(event) => updatePlayer('b2', event.target.value)}
                placeholder={`${labels.playerName} B2`}
              />
            </label>
          ) : null}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.settingsRow}>
          <label className={styles.field}>
            <span>{labels.winScore}</span>
            <select
              value={winScoreOption}
              onChange={(event) => setWinScoreOption(event.target.value as '11' | '15' | '21' | 'custom')}
            >
              <option value="11">11</option>
              <option value="15">15</option>
              <option value="21">21</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {winScoreOption === 'custom' ? (
            <label className={styles.field}>
              <span>{labels.winScore}</span>
              <input
                type="number"
                min="1"
                value={customWinScore}
                onChange={(event) => setCustomWinScore(event.target.value)}
              />
            </label>
          ) : null}
        </div>

        <label className={styles.field}>
          <span>{labels.startingTeam}</span>
          <select
            value={startingTeam}
            onChange={(event) => setStartingTeam(event.target.value as Team)}
          >
            <option value="A">
              {labels.teamA} {labels.teamServesFirst}
            </option>
            <option value="B">
              {labels.teamB} {labels.teamServesFirst}
            </option>
          </select>
        </label>

        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={winByTwo}
            onChange={(event) => setWinByTwo(event.target.checked)}
          />
          <span>{labels.winByTwo}</span>
        </label>
      </section>

      <button type="submit" className={styles.startButton}>
        {labels.startGame}
      </button>
    </form>
  )
}
