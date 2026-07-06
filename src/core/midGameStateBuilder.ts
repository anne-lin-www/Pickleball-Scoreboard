import type { TeamId } from './types.js'
import { DoublesGame, type SerializedDoublesGame } from './doubles/DoublesGame.js'
import { SinglesGame, type SerializedSinglesGame } from './singles/SinglesGame.js'

export interface MidGameDoublesInput {
  mode: 'doubles'
  teamAName: string
  teamBName: string
  topTeamId: TeamId
  servingTeamId: TeamId
  topLeftPlayerName: string    // Player 1 of top team (left cell)
  topRightPlayerName: string   // Player 2 of top team (right cell)
  bottomLeftPlayerName: string // Player 1 of bottom team (left cell)
  bottomRightPlayerName: string// Player 2 of bottom team (right cell)
  servingTeamScore: number
  receivingTeamScore: number
  serverNumber: 1 | 2
}

export interface MidGameSinglesInput {
  mode: 'singles'
  teamAName: string
  teamBName: string
  topTeamId: TeamId
  servingTeamId: TeamId
  topPlayerName: string
  bottomPlayerName: string
  servingTeamScore: number
  receivingTeamScore: number
}

export type MidGameInput = MidGameDoublesInput | MidGameSinglesInput

export function buildMidGameState(input: MidGameInput): DoublesGame | SinglesGame {
  return input.mode === 'doubles' ? buildDoubles(input) : buildSingles(input)
}

function buildDoubles(input: MidGameDoublesInput): DoublesGame {
  const { servingTeamId, servingTeamScore, receivingTeamScore, serverNumber } = input
  const servingEven = servingTeamScore % 2 === 0

  function makeTeam(teamId: TeamId) {
    const p1Id = `${teamId}_P1`
    const p2Id = `${teamId}_P2`
    const isServing = teamId === servingTeamId

    // Serving team: even score → right-cell (P2) is anchor; odd → left-cell (P1) is anchor
    // Receiving team: safe default: right (P2) = anchor
    const p1Anchor = isServing ? !servingEven : false
    const p2Anchor = isServing ? servingEven : true

    // Current server of serving team: even → P2 (right), odd → P1 (left)
    const currentServingPlayerId = isServing
      ? (servingEven ? p2Id : p1Id)
      : p2Id

    return {
      id: teamId,
      score: isServing ? servingTeamScore : receivingTeamScore,
      serverNumber: isServing ? serverNumber : 2,
      currentServingPlayerId,
      players: [
        { id: p1Id, isStartingRight: p1Anchor, currentSide: 'LEFT' as const },
        { id: p2Id, isStartingRight: p2Anchor, currentSide: 'RIGHT' as const },
      ] as [{ id: string; isStartingRight: boolean; currentSide: 'LEFT' }, { id: string; isStartingRight: boolean; currentSide: 'RIGHT' }],
    }
  }

  const serialized: SerializedDoublesGame = {
    type: 'doubles',
    initialServingTeamId: servingTeamId,
    servingTeamId,
    isFirstServe: false,
    status: 'IN_PROGRESS',
    winner: null,
    history: [],
    teamA: makeTeam('TEAM_A'),
    teamB: makeTeam('TEAM_B'),
  }

  return DoublesGame.fromSerialized(serialized)
}

function buildSingles(input: MidGameSinglesInput): SinglesGame {
  const { servingTeamId, servingTeamScore, receivingTeamScore } = input
  const receivingTeamId: TeamId = servingTeamId === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A'

  const servingPlayerId = `${servingTeamId}_P1`
  const playerAId = 'TEAM_A_P1'
  const playerBId = 'TEAM_B_P1'
  const teamAScore = servingTeamId === 'TEAM_A' ? servingTeamScore : receivingTeamScore
  const teamBScore = servingTeamId === 'TEAM_B' ? servingTeamScore : receivingTeamScore

  const serialized: SerializedSinglesGame = {
    type: 'singles',
    initialServingPlayerId: servingPlayerId,
    servingPlayerId,
    status: 'IN_PROGRESS',
    winner: null,
    history: [],
    playerA: {
      id: playerAId,
      score: teamAScore,
      currentSide: teamAScore % 2 === 0 ? 'RIGHT' : 'LEFT',
    },
    playerB: {
      id: playerBId,
      score: teamBScore,
      currentSide: teamBScore % 2 === 0 ? 'RIGHT' : 'LEFT',
    },
  }

  void receivingTeamId
  return SinglesGame.fromSerialized(serialized)
}
