export type GameMode = 'singles' | 'doubles'
export type Team = 'A' | 'B'
export type ServerNumber = 1 | 2
export type PlayerPosition = 'even' | 'odd'

export interface Player {
  id: string
  name: string
  team: Team
  position: PlayerPosition
}

export interface GameSettings {
  mode: GameMode
  winScore: number
  winByTwo: boolean
}

export interface GameState {
  scoreA: number
  scoreB: number
  servingTeam: Team
  serverNumber: ServerNumber
  players: Player[]
  history: GameState[]
  gameOver: boolean
  winner: Team | null
  settings: GameSettings
  isFirstServe: boolean
}
