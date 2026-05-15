import type { GameState, Player, PlayerPosition, Team } from './types'

const getOriginalPosition = (
  teamPlayers: Player[],
  player: Player,
): PlayerPosition => (teamPlayers[0]?.id === player.id ? 'even' : 'odd')

const getTeamScore = (scoreA: number, scoreB: number, team: Team): number =>
  team === 'A' ? scoreA : scoreB

export function calculatePositions(
  players: Player[],
  scoreA: number,
  scoreB: number,
): Player[] {
  return players.map((player) => {
    const teamPlayers = players.filter((candidate) => candidate.team === player.team)

    if (teamPlayers.length < 2) {
      return {
        ...player,
        position: 'even',
      }
    }

    const originalPosition = getOriginalPosition(teamPlayers, player)
    const teamScore = getTeamScore(scoreA, scoreB, player.team)
    const isSwapped = teamScore % 2 === 1

    return {
      ...player,
      position: isSwapped
        ? originalPosition === 'even'
          ? 'odd'
          : 'even'
        : originalPosition,
    }
  })
}

export function getServerPlayer(state: GameState): Player {
  return state.players.find((player) => player.id === state.servingPlayerId) ?? state.players[0]!
}

export function getCourtLayout(state: GameState): {
  topLeft: Player | null
  topRight: Player | null
  bottomLeft: Player | null
  bottomRight: Player | null
} {
  const teamA = state.players.filter((player) => player.team === 'A')
  const teamB = state.players.filter((player) => player.team === 'B')

  return {
    topLeft: teamA.find((player) => player.position === 'odd') ?? null,
    topRight: teamA.find((player) => player.position === 'even') ?? null,
    bottomLeft: teamB.find((player) => player.position === 'even') ?? null,
    bottomRight: teamB.find((player) => player.position === 'odd') ?? null,
  }
}
