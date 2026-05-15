import { calculatePositions } from './rotation'
import { checkWinCondition, handOut as handOutByRules, scorePoint as scoreByRules } from './rules'
import type { GameSettings, GameState, Player, Team } from './types'

const HISTORY_LIMIT = 50

const cloneState = (state: GameState): GameState => ({
  ...state,
  players: state.players.map((player) => ({ ...player })),
  history: [...state.history],
  settings: { ...state.settings },
})

const createPlayers = (
  settings: GameSettings,
  playerNames: { a1: string; a2: string; b1: string; b2: string },
): Player[] => {
  if (settings.mode === 'singles') {
    return [
      { id: 'A1', name: playerNames.a1, team: 'A', position: 'even' },
      { id: 'B1', name: playerNames.b1, team: 'B', position: 'even' },
    ]
  }

  return [
    { id: 'A1', name: playerNames.a1, team: 'A', position: 'even' },
    { id: 'A2', name: playerNames.a2, team: 'A', position: 'odd' },
    { id: 'B1', name: playerNames.b1, team: 'B', position: 'even' },
    { id: 'B2', name: playerNames.b2, team: 'B', position: 'odd' },
  ]
}

const getPlayerNames = (
  state: GameState,
): { a1: string; a2: string; b1: string; b2: string } => ({
  a1: state.players.find((player) => player.id === 'A1')?.name ?? 'A1',
  a2: state.players.find((player) => player.id === 'A2')?.name ?? 'A2',
  b1: state.players.find((player) => player.id === 'B1')?.name ?? 'B1',
  b2: state.players.find((player) => player.id === 'B2')?.name ?? 'B2',
})

export function createGame(
  settings: GameSettings,
  playerNames: { a1: string; a2: string; b1: string; b2: string },
  startingTeam: Team = 'A',
): GameState {
  const players = createPlayers(settings, playerNames)
  const servingPlayerId =
    players.find((player) => player.team === startingTeam && player.position === 'even')?.id ??
    players[0]?.id ??
    'A1'

  return {
    scoreA: 0,
    scoreB: 0,
    servingTeam: startingTeam,
    serverNumber: 2,
    servingPlayerId,
    players,
    history: [],
    gameOver: false,
    winner: null,
    settings,
    isFirstServe: true,
  }
}

export function scorePoint(state: GameState, scoringTeam: 'A' | 'B'): GameState {
  if (state.gameOver) {
    return state
  }

  const next = scoreByRules(state, scoringTeam)
  const resolvedState = {
    ...next,
    players: calculatePositions(next.players, next.scoreA, next.scoreB),
  }
  const outcome = checkWinCondition(resolvedState)

  return {
    ...resolvedState,
    history: [...state.history, cloneState(state)].slice(-HISTORY_LIMIT),
    ...outcome,
  }
}

export function handOut(state: GameState): GameState {
  const next = handOutByRules(state)

  if (next === state) {
    return state
  }

  return {
    ...next,
    players: calculatePositions(next.players, next.scoreA, next.scoreB),
    history: [...state.history, cloneState(state)].slice(-HISTORY_LIMIT),
  }
}

export function undoLastPoint(state: GameState): GameState {
  return state.history.at(-1) ?? state
}

export function resetGame(state: GameState): GameState {
  return createGame(state.settings, getPlayerNames(state))
}
