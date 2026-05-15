import type { GameState, ServerNumber, Team } from './types'

const getTeamScore = (state: GameState, team: Team): number =>
  team === 'A' ? state.scoreA : state.scoreB

export function scorePoint(state: GameState, scoringTeam: Team): GameState {
  if (state.gameOver) {
    return state
  }

  if (scoringTeam === state.servingTeam) {
    return {
      ...state,
      scoreA: scoringTeam === 'A' ? state.scoreA + 1 : state.scoreA,
      scoreB: scoringTeam === 'B' ? state.scoreB + 1 : state.scoreB,
    }
  }

  if (state.settings.mode === 'doubles' && !state.isFirstServe && state.serverNumber === 1) {
    return handOut(state)
  }

  const servingTeam = scoringTeam
  const servingPlayerId =
    state.players.find((player) => player.team === servingTeam && player.position === 'even')?.id ??
    state.servingPlayerId

  return {
    ...state,
    servingTeam,
    serverNumber: 1,
    servingPlayerId,
    isFirstServe: false,
  }
}

export function handOut(state: GameState): GameState {
  if (
    state.gameOver ||
    state.isFirstServe ||
    state.serverNumber !== 1 ||
    state.settings.mode !== 'doubles'
  ) {
    return state
  }

  const servingPlayerId =
    state.players.find(
      (player) => player.team === state.servingTeam && player.id !== state.servingPlayerId,
    )?.id ?? state.servingPlayerId

  const serverNumber: ServerNumber = 2

  return {
    ...state,
    serverNumber,
    servingPlayerId,
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
