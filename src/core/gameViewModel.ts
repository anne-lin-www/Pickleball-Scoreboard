import type { CourtSide, GameStatus, TeamId, PlayerId } from './types.js'
import type { DoublesGame } from './doubles/DoublesGame.js'
import type { SinglesGame } from './singles/SinglesGame.js'
import type { SetupConfig } from '../screens/SetupScreen.js'

export interface PlayerView {
  id: PlayerId
  name: string
  side: CourtSide
}

export interface TeamView {
  id: TeamId
  name: string
  score: number
  players: PlayerView[]
}

export interface GameViewModel {
  topTeam: TeamView
  bottomTeam: TeamView
  servingTeamId: TeamId
  serverNumber: 1 | 2
  servingPlayerId: PlayerId
  status: GameStatus
  winnerName: string | null
  mode: 'doubles' | 'singles'
}

function parseScores(scoreCall: string): { servingScore: number; receivingScore: number } {
  const parts = scoreCall.split('-')
  const s = parts[0]
  const r = parts[1]
  if (parts.length < 2 || s === undefined || r === undefined) {
    throw new Error(`Unexpected score call format: "${scoreCall}"`)
  }
  const servingScore = parseInt(s, 10)
  const receivingScore = parseInt(r, 10)
  if (isNaN(servingScore) || isNaN(receivingScore)) {
    throw new Error(`Unexpected score call format: "${scoreCall}"`)
  }
  return { servingScore, receivingScore }
}

function playerIdToTeamId(playerId: PlayerId): TeamId {
  if (playerId.startsWith('TEAM_A_')) return 'TEAM_A'
  if (playerId.startsWith('TEAM_B_')) return 'TEAM_B'
  throw new Error(`Cannot derive TeamId from PlayerId: "${playerId}"`)
}

function resolveWinnerName(
  winnerId: TeamId | PlayerId | null,
  config: SetupConfig,
  mode: 'doubles' | 'singles'
): string | null {
  if (winnerId === null) return null
  if (mode === 'doubles') {
    return winnerId === 'TEAM_A' ? config.teamAName : config.teamBName
  }
  return playerIdToTeamId(winnerId as PlayerId) === 'TEAM_A'
    ? config.teamAPlayer1
    : config.teamBPlayer1
}

export function deriveViewModel(
  game: DoublesGame | SinglesGame,
  config: SetupConfig
): GameViewModel {
  const mode = config.mode
  const status = game.getStatus()

  if (mode === 'doubles') {
    const doubles = game as DoublesGame
    const servingTeamId = doubles.getServingTeam()
    const serverNumber = doubles.getServerNumber()
    const { servingScore, receivingScore } = parseScores(doubles.getScoreCall())

    const buildTeam = (teamId: TeamId): TeamView => {
      const positions = doubles.getTeamPositions(teamId)
      const isServing = teamId === servingTeamId
      const score = isServing ? servingScore : receivingScore
      const teamName = teamId === 'TEAM_A' ? config.teamAName : config.teamBName
      const playerNames =
        teamId === 'TEAM_A'
          ? { TEAM_A_P1: config.teamAPlayer1, TEAM_A_P2: config.teamAPlayer2 }
          : { TEAM_B_P1: config.teamBPlayer1, TEAM_B_P2: config.teamBPlayer2 }
      const players: PlayerView[] = Object.entries(positions).map(([id, side]) => ({
        id,
        name: playerNames[id as keyof typeof playerNames] || (id.endsWith('_P2') ? 'P2' : 'P1'),
        side: side as CourtSide,
      }))
      return { id: teamId, name: teamName, score, players }
    }

    const topTeam = buildTeam(config.topTeamId)
    const bottomTeamId: TeamId = config.topTeamId === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A'
    const bottomTeam = buildTeam(bottomTeamId)

    return {
      topTeam,
      bottomTeam,
      servingTeamId,
      serverNumber,
      servingPlayerId: doubles.getServingPlayerId(),
      status,
      winnerName: resolveWinnerName(doubles.getWinner(), config, 'doubles'),
      mode: 'doubles',
    }
  } else {
    const singles = game as SinglesGame
    const servingPlayerId = singles.getServingPlayer()
    const servingTeamId = playerIdToTeamId(servingPlayerId)
    const { servingScore, receivingScore } = parseScores(singles.getScoreCall())

    const buildSinglesTeam = (teamId: TeamId): TeamView => {
      const playerId: PlayerId = `${teamId}_P1`
      const isServing = teamId === servingTeamId
      const score = isServing ? servingScore : receivingScore
      const teamName = teamId === 'TEAM_A' ? config.teamAName : config.teamBName
      const playerName = teamId === 'TEAM_A' ? config.teamAPlayer1 : config.teamBPlayer1
      const side = singles.getPlayerSide(playerId)
      return {
        id: teamId,
        name: teamName,
        score,
        players: [{ id: playerId, name: playerName, side }],
      }
    }

    const topTeam = buildSinglesTeam(config.topTeamId)
    const bottomTeamId: TeamId = config.topTeamId === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A'
    const bottomTeam = buildSinglesTeam(bottomTeamId)

    return {
      topTeam,
      bottomTeam,
      servingTeamId,
      serverNumber: 1,
      servingPlayerId,
      status,
      winnerName: resolveWinnerName(singles.getWinner(), config, 'singles'),
      mode: 'singles',
    }
  }
}
