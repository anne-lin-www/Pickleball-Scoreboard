import type { SetupConfig } from '../screens/SetupScreen.js'
import type { DoublesGame, SerializedDoublesGame } from '../core/doubles/DoublesGame.js'
import type { SinglesGame, SerializedSinglesGame } from '../core/singles/SinglesGame.js'

export const STORAGE_KEY = 'pickleball_game'
export const SESSION_KEY = 'pickleball_session'

export interface PersistedGameState {
  config: SetupConfig
  game: SerializedSinglesGame | SerializedDoublesGame
  savedAt: number
}

export function useGamePersistence() {
  function loadPersistedState(): PersistedGameState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as PersistedGameState
    } catch {
      try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
      return null
    }
  }

  function saveGameState(config: SetupConfig, game: DoublesGame | SinglesGame): void {
    try {
      const data: PersistedGameState = { config, game: game.serialize(), savedAt: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch { /* silently ignore quota or access errors */ }
  }

  function clearGameState(): void {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* silently ignore */ }
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* silently ignore */ }
  }

  function markSessionActive(): void {
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* silently ignore */ }
  }

  function isSessionActive(): boolean {
    try { return sessionStorage.getItem(SESSION_KEY) !== null } catch { return false }
  }

  return { loadPersistedState, saveGameState, clearGameState, markSessionActive, isSessionActive }
}
