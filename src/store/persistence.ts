import type { GameState, GameSettings, Player, PlayerPosition, Team } from '../core/types'

export const STORAGE_KEY = 'pickleball_game_state'

const isTeam = (value: unknown): value is Team => value === 'A' || value === 'B'
const isPosition = (value: unknown): value is PlayerPosition =>
  value === 'even' || value === 'odd'

const isPlayer = (value: unknown): value is Player => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const player = value as Record<string, unknown>
  return (
    typeof player.id === 'string' &&
    typeof player.name === 'string' &&
    isTeam(player.team) &&
    isPosition(player.position)
  )
}

const isSettings = (value: unknown): value is GameSettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as Record<string, unknown>
  return (
    (settings.mode === 'singles' || settings.mode === 'doubles') &&
    typeof settings.winScore === 'number' &&
    Number.isFinite(settings.winScore) &&
    settings.winScore > 0 &&
    typeof settings.winByTwo === 'boolean'
  )
}

const isGameState = (value: unknown): value is GameState => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as Record<string, unknown>
  return (
    typeof state.scoreA === 'number' &&
    typeof state.scoreB === 'number' &&
    isTeam(state.servingTeam) &&
    (state.serverNumber === 1 || state.serverNumber === 2) &&
    typeof state.servingPlayerId === 'string' &&
    state.servingPlayerId.length > 0 &&
    Array.isArray(state.players) &&
    state.players.every(isPlayer) &&
    Array.isArray(state.history) &&
    typeof state.gameOver === 'boolean' &&
    (state.winner === null || isTeam(state.winner)) &&
    isSettings(state.settings) &&
    typeof state.isFirstServe === 'boolean'
  )
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors in private browsing or quota failures.
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as unknown
    return isGameState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage errors in private browsing or quota failures.
  }
}
