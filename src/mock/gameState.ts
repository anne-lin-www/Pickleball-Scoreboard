import type { CourtSide, GameStatus, TeamId, PlayerId } from '../core/types.js'

export interface MockPlayer {
  id: PlayerId
  name: string
  isStartingRight: boolean
  currentSide: CourtSide
}

export interface MockTeam {
  id: TeamId
  name: string
  score: number
  players: [MockPlayer, MockPlayer]
}

export interface MockDoublesState {
  topTeam: MockTeam
  bottomTeam: MockTeam
  servingTeamId: TeamId
  serverNumber: 1 | 2
  status: GameStatus
  winner: TeamId | null
  tapCourtEnabled: boolean
}

export const mockDoublesState: MockDoublesState = {
  topTeam: {
    id: 'TEAM_A',
    name: 'Team A',
    score: 6,
    players: [
      { id: 'TEAM_A_P1', name: 'Alice', isStartingRight: true, currentSide: 'RIGHT' },
      { id: 'TEAM_A_P2', name: 'Bob', isStartingRight: false, currentSide: 'LEFT' },
    ],
  },
  bottomTeam: {
    id: 'TEAM_B',
    name: 'Team B',
    score: 4,
    players: [
      { id: 'TEAM_B_P1', name: 'Carol', isStartingRight: true, currentSide: 'RIGHT' },
      { id: 'TEAM_B_P2', name: 'Dave', isStartingRight: false, currentSide: 'LEFT' },
    ],
  },
  servingTeamId: 'TEAM_A',
  serverNumber: 1,
  status: 'IN_PROGRESS',
  winner: null,
  tapCourtEnabled: false,
}
