import type { GameState, ServerNumber, Team } from './types'

const getTeamScore = (state: GameState, team: Team): number =>
  team === 'A' ? state.scoreA : state.scoreB

export function scorePoint(state: GameState, scoringTeam: Team): GameState {
  if (state.gameOver) {
    return state
  }

  if (scoringTeam === state.servingTeam) {
    const serverNumber: ServerNumber =
      state.settings.mode === 'doubles'
        ? state.serverNumber === 1
          ? 2
          : 1
        : state.serverNumber

    return {
      ...state,
      scoreA: scoringTeam === 'A' ? state.scoreA + 1 : state.scoreA,
      scoreB: scoringTeam === 'B' ? state.scoreB + 1 : state.scoreB,
      serverNumber,
    }
  }

  return {
    ...state,
    servingTeam: scoringTeam,
    serverNumber: 1,
    isFirstServe: false,
  }
}

export function checkWinCondition(state: GameState): {
  gameOver: boolean
  winner: Team | null
} {
  const { winByTwo, winScore } = state.settings
  const lead = Math.abs(state.scoreA - state.scoreB)

  if (state.scoreA < winScore && state.scoreB < winScore) {
    return { gameOver: false, winner: null }
  }

  if (winByTwo && lead < 2) {
    return { gameOver: false, winner: null }
  }

  if (!winByTwo && state.scoreA >= winScore) {
    return { gameOver: true, winner: 'A' }
  }

  if (!winByTwo && state.scoreB >= winScore) {
    return { gameOver: true, winner: 'B' }
  }

  if (state.scoreA >= winScore && state.scoreA - state.scoreB >= 2) {
    return { gameOver: true, winner: 'A' }
  }

  if (state.scoreB >= winScore && state.scoreB - state.scoreA >= 2) {
    return { gameOver: true, winner: 'B' }
  }

  return { gameOver: false, winner: null }
}

export function getDisplayScore(state: GameState): {
  leftScore: number
  rightScore: number
  serverNumber: ServerNumber
} {
  return {
    leftScore: getTeamScore(state, state.servingTeam),
    rightScore: getTeamScore(state, state.servingTeam === 'A' ? 'B' : 'A'),
    serverNumber: state.serverNumber,
  }
}
