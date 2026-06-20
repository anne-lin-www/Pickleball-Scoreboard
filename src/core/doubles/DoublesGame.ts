import type { CourtSide, GameStatus, TeamId, PlayerId } from '../types.js'

export type { CourtSide, GameStatus, TeamId, PlayerId }

export interface IDoublesScoreboard {
  winRally(winner: TeamId): void
  undo(): void
  reset(): void
  getScoreCall(): string
  getServingTeam(): TeamId
  getServerNumber(): 1 | 2
  getServingPlayerId(): PlayerId
  getTeamPositions(id: TeamId): Record<PlayerId, CourtSide>
  getStatus(): GameStatus
  getWinner(): TeamId | null
  runPositionAssertion(): void
}

interface Player {
  readonly id: PlayerId
  readonly isStartingRight: boolean
  currentSide: CourtSide
}

interface DoublesTeamState {
  readonly id: TeamId
  score: number
  serverNumber: 1 | 2
  currentServingPlayerId: PlayerId
  players: [Player, Player]
}

interface GameSnapshot {
  teamA: DoublesTeamState
  teamB: DoublesTeamState
  servingTeamId: TeamId
  isFirstServe: boolean
  status: GameStatus
  winner: TeamId | null
}

export interface SerializedDoublesGame {
  type: 'doubles'
  initialServingTeamId: TeamId
  teamA: DoublesTeamState
  teamB: DoublesTeamState
  servingTeamId: TeamId
  isFirstServe: boolean
  status: GameStatus
  winner: TeamId | null
  history: GameSnapshot[]
}

function makePlayer(id: PlayerId, isStartingRight: boolean): Player {
  return { id, isStartingRight, currentSide: isStartingRight ? 'RIGHT' : 'LEFT' }
}

function makeTeam(id: TeamId): DoublesTeamState {
  return {
    id,
    score: 0,
    serverNumber: 2,
    currentServingPlayerId: `${id}_P2`,
    players: [makePlayer(`${id}_P1`, false), makePlayer(`${id}_P2`, true)],
  }
}

function cloneTeam(t: DoublesTeamState): DoublesTeamState {
  return {
    id: t.id,
    score: t.score,
    serverNumber: t.serverNumber,
    currentServingPlayerId: t.currentServingPlayerId,
    players: [
      { ...t.players[0] },
      { ...t.players[1] },
    ],
  }
}

function rightPlayer(team: DoublesTeamState): Player {
  return team.players.find(p => p.currentSide === 'RIGHT')!
}

function switchSides(team: DoublesTeamState): void {
  for (const p of team.players) {
    p.currentSide = p.currentSide === 'RIGHT' ? 'LEFT' : 'RIGHT'
  }
}

function resetToFirstServer(team: DoublesTeamState): void {
  team.serverNumber = 1
  team.currentServingPlayerId = rightPlayer(team).id
}

function checkWin(scoring: DoublesTeamState, other: DoublesTeamState): boolean {
  return scoring.score >= 11 && scoring.score - other.score >= 2
}

export class DoublesGame implements IDoublesScoreboard {
  private readonly initialServingTeamId: TeamId
  private teamA: DoublesTeamState
  private teamB: DoublesTeamState
  private servingTeamId: TeamId
  private isFirstServe: boolean
  private status: GameStatus
  private winner: TeamId | null
  private history: GameSnapshot[]

  constructor(firstServingTeam: TeamId) {
    this.initialServingTeamId = firstServingTeam
    this.teamA = makeTeam('TEAM_A')
    this.teamB = makeTeam('TEAM_B')
    this.servingTeamId = firstServingTeam
    this.isFirstServe = true
    this.status = 'IN_PROGRESS'
    this.winner = null
    this.history = []
  }

  private get servingTeam(): DoublesTeamState {
    return this.servingTeamId === 'TEAM_A' ? this.teamA : this.teamB
  }

  private get receivingTeam(): DoublesTeamState {
    return this.servingTeamId === 'TEAM_A' ? this.teamB : this.teamA
  }

  private snapshot(): GameSnapshot {
    return {
      teamA: cloneTeam(this.teamA),
      teamB: cloneTeam(this.teamB),
      servingTeamId: this.servingTeamId,
      isFirstServe: this.isFirstServe,
      status: this.status,
      winner: this.winner,
    }
  }

  private restore(snap: GameSnapshot): void {
    this.teamA = snap.teamA
    this.teamB = snap.teamB
    this.servingTeamId = snap.servingTeamId
    this.isFirstServe = snap.isFirstServe
    this.status = snap.status
    this.winner = snap.winner
  }

  private sideOut(): void {
    const newServing = this.receivingTeam
    this.servingTeamId = newServing.id
    resetToFirstServer(newServing)
  }

  winRally(winner: TeamId): void {
    if (this.status === 'FINISHED') return
    this.history.push(this.snapshot())

    const serving = this.servingTeam
    const receiving = this.receivingTeam

    if (winner === serving.id) {
      // serving team wins → score + switch sides
      serving.score++
      switchSides(serving)
      if (checkWin(serving, receiving)) {
        this.status = 'FINISHED'
        this.winner = serving.id
      }
    } else {
      // receiving team wins → advance server or side out
      if (this.isFirstServe) {
        this.isFirstServe = false
        this.sideOut()
      } else if (serving.serverNumber === 1) {
        // server #2 is the partner of server #1
        serving.currentServingPlayerId = serving.players.find(p => p.id !== serving.currentServingPlayerId)!.id
        serving.serverNumber = 2
      } else {
        this.sideOut()
      }
    }
  }

  undo(): void {
    const snap = this.history.pop()
    if (snap) this.restore(snap)
  }

  reset(): void {
    this.teamA = makeTeam('TEAM_A')
    this.teamB = makeTeam('TEAM_B')
    this.servingTeamId = this.initialServingTeamId
    this.isFirstServe = true
    this.status = 'IN_PROGRESS'
    this.winner = null
    this.history = []
  }

  getScoreCall(): string {
    const s = this.servingTeam
    const r = this.receivingTeam
    return `${s.score}-${r.score}-${s.serverNumber}`
  }

  getServingTeam(): TeamId {
    return this.servingTeamId
  }

  getServerNumber(): 1 | 2 {
    return this.servingTeam.serverNumber
  }

  getServingPlayerId(): PlayerId {
    // First-serve exception: anchor player (isStartingRight) serves regardless of serverNumber
    if (this.isFirstServe) {
      return this.servingTeam.players.find(p => p.isStartingRight)!.id
    }
    return this.servingTeam.currentServingPlayerId
  }

  getTeamPositions(id: TeamId): Record<PlayerId, CourtSide> {
    const team = id === 'TEAM_A' ? this.teamA : this.teamB
    return Object.fromEntries(team.players.map(p => [p.id, p.currentSide]))
  }

  getStatus(): GameStatus {
    return this.status
  }

  getWinner(): TeamId | null {
    return this.winner
  }

  runPositionAssertion(): void {
    const team = this.servingTeam
    const anchor = team.players.find(p => p.isStartingRight)!
    const expected: CourtSide = team.score % 2 === 0 ? 'RIGHT' : 'LEFT'
    if (anchor.currentSide !== expected) {
      throw new Error(
        `Position Error: ${anchor.id} should be on ${expected} (score ${team.score} is ${team.score % 2 === 0 ? 'even' : 'odd'}), but is on ${anchor.currentSide}`
      )
    }
  }

  serialize(): SerializedDoublesGame {
    return {
      type: 'doubles',
      initialServingTeamId: this.initialServingTeamId,
      teamA: cloneTeam(this.teamA),
      teamB: cloneTeam(this.teamB),
      servingTeamId: this.servingTeamId,
      isFirstServe: this.isFirstServe,
      status: this.status,
      winner: this.winner,
      history: this.history.map(snap => ({
        teamA: cloneTeam(snap.teamA),
        teamB: cloneTeam(snap.teamB),
        servingTeamId: snap.servingTeamId,
        isFirstServe: snap.isFirstServe,
        status: snap.status,
        winner: snap.winner,
      })),
    }
  }

  static fromSerialized(data: SerializedDoublesGame): DoublesGame {
    const game = new DoublesGame(data.initialServingTeamId)
    game.teamA = cloneTeam(data.teamA)
    game.teamB = cloneTeam(data.teamB)
    game.servingTeamId = data.servingTeamId
    game.isFirstServe = data.isFirstServe
    game.status = data.status
    game.winner = data.winner
    game.history = data.history.map(snap => ({
      teamA: cloneTeam(snap.teamA),
      teamB: cloneTeam(snap.teamB),
      servingTeamId: snap.servingTeamId,
      isFirstServe: snap.isFirstServe,
      status: snap.status,
      winner: snap.winner,
    }))
    return game
  }
}
