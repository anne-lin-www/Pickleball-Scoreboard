import { useEffect, useRef, useState } from 'react'
import { getDisplayScore } from '../../core/rules'
import type { GameState } from '../../core/types'
import styles from './ScoreDisplay.module.css'

type Labels = {
  serving: string
  server: string
  gameOver: string
  wins: string
}

type TeamLabels = {
  A: string
  B: string
}

type Props = {
  state: GameState
  labels: Labels
  teamLabels: TeamLabels
}

export function ScoreDisplay({ state, labels, teamLabels }: Props) {
  const nextDisplay = getDisplayScore(state)
  const [display, setDisplay] = useState(nextDisplay)
  const [fadeState, setFadeState] = useState<'idle' | 'fadeOut' | 'fadeIn'>('idle')
  const [isBouncing, setIsBouncing] = useState(false)
  const previous = useRef({ servingTeam: state.servingTeam, display: nextDisplay })

  useEffect(() => {
    const servingChanged = previous.current.servingTeam !== state.servingTeam
    const scoreChanged =
      previous.current.display.leftScore !== nextDisplay.leftScore ||
      previous.current.display.rightScore !== nextDisplay.rightScore

    if (servingChanged) {
      setFadeState('fadeOut')
      const swapTimeout = window.setTimeout(() => {
        setDisplay(nextDisplay)
        setFadeState('fadeIn')
        setIsBouncing(true)
      }, 150)
      const clearTimeoutId = window.setTimeout(() => {
        setFadeState('idle')
        setIsBouncing(false)
      }, 300)

      previous.current = { servingTeam: state.servingTeam, display: nextDisplay }
      return () => {
        window.clearTimeout(swapTimeout)
        window.clearTimeout(clearTimeoutId)
      }
    }

    setDisplay(nextDisplay)
    if (scoreChanged) {
      setIsBouncing(true)
      const timeoutId = window.setTimeout(() => setIsBouncing(false), 200)
      previous.current = { servingTeam: state.servingTeam, display: nextDisplay }
      return () => window.clearTimeout(timeoutId)
    }

    previous.current = { servingTeam: state.servingTeam, display: nextDisplay }
    return undefined
  }, [nextDisplay, state.servingTeam])

  const servingTeamLabel = teamLabels[state.servingTeam]
  const receivingTeam = state.servingTeam === 'A' ? 'B' : 'A'
  const winnerDisplayTeam = state.winner ?? state.servingTeam
  const winnerOnLeft = winnerDisplayTeam === state.servingTeam

  return (
    <section
      className={styles.scoreboard}
      style={{
        ['--serving-color' as string]: state.servingTeam === 'A' ? '#1a7fc1' : '#c46a00',
      }}
    >
      <div className={styles.panelActive}>
        <div className={styles.teamMeta}>
          <span>{servingTeamLabel}</span>
          <span>{labels.serving}</span>
        </div>
        <div className={styles.scoreRow}>
          <span
            className={[
              styles.scoreValue,
              isBouncing ? styles.bounce : '',
              fadeState === 'fadeOut' ? styles.fadeOut : '',
              fadeState === 'fadeIn' ? styles.fadeIn : '',
              state.gameOver && winnerOnLeft ? styles.winnerPulse : '',
            ].join(' ')}
          >
            {display.leftScore}
          </span>
          <span className={styles.dash}>—</span>
          <span
            className={[
              styles.scoreValue,
              styles.inactiveScore,
              isBouncing ? styles.bounce : '',
              fadeState === 'fadeOut' ? styles.fadeOut : '',
              fadeState === 'fadeIn' ? styles.fadeIn : '',
              state.gameOver && !winnerOnLeft ? styles.winnerPulse : '',
            ].join(' ')}
          >
            {display.rightScore}
          </span>
          <div className={styles.serverPill}>
            <span className={styles.serverLabel}>{labels.server}</span>
            <span className={styles.serverValue}>{display.serverNumber}</span>
          </div>
        </div>
      </div>
      <div className={styles.panelInactive}>
        <span>{teamLabels[receivingTeam]}</span>
        {state.gameOver ? (
          <span className={styles.gameOverText}>
            {labels.gameOver} · {teamLabels[state.winner ?? 'A']} {labels.wins}
          </span>
        ) : null}
      </div>
    </section>
  )
}
