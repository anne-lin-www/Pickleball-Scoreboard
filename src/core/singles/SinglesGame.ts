import type { CourtSide, GameStatus, PlayerId } from '../types.js'

export type { CourtSide, GameStatus, PlayerId }

export interface ISinglesScoreboard {
  winRally(winner: PlayerId): void
  undo(): void
  reset(): void
  getScoreCall(): string
  getServingPlayer(): PlayerId
  getPlayerSide(id: PlayerId): CourtSide
  getStatus(): GameStatus
  getWinner(): PlayerId | null
  runPositionAssertion(): void
}

interface SinglesPlayerState {
  readonly id: PlayerId
  score: number
  currentSide: CourtSide
}

interface GameSnapshot {
  playerA: SinglesPlayerState
  playerB: SinglesPlayerState
  servingPlayerId: PlayerId
  status: GameStatus
  winner: PlayerId | null
}

function expectedSide(score: number): CourtSide {
  return score % 2 === 0 ? 'RIGHT' : 'LEFT'
}

function clonePlayer(p: SinglesPlayerState): SinglesPlayerState {
  return { ...p }
}

function checkWin(scorer: SinglesPlayerState, other: SinglesPlayerState): boolean {
  return scorer.score >= 11 && scorer.score - other.score >= 2
}

export class SinglesGame implements ISinglesScoreboard {
  private readonly initialServingPlayerId: PlayerId
  private playerA: SinglesPlayerState
  private playerB: SinglesPlayerState
  private servingPlayerId: PlayerId
  private status: GameStatus
  private winner: PlayerId | null
  private history: GameSnapshot[]

  constructor(playerAId: PlayerId, playerBId: PlayerId) {
    this.initialServingPlayerId = playerAId
    this.playerA = { id: playerAId, score: 0, currentSide: 'RIGHT' }
    this.playerB = { id: playerBId, score: 0, currentSide: 'RIGHT' }
    this.servingPlayerId = playerAId
    this.status = 'IN_PROGRESS'
    this.winner = null
    this.history = []
  }

  private get server(): SinglesPlayerState {
    return this.playerA.id === this.servingPlayerId ? this.playerA : this.playerB
  }

  private get receiver(): SinglesPlayerState {
    return this.playerA.id === this.servingPlayerId ? this.playerB : this.playerA
  }

  private snapshot(): GameSnapshot {
    return {
      playerA: clonePlayer(this.playerA),
      playerB: clonePlayer(this.playerB),
      servingPlayerId: this.servingPlayerId,
      status: this.status,
      winner: this.winner,
    }
  }

  private restore(snap: GameSnapshot): void {
    this.playerA = snap.playerA
    this.playerB = snap.playerB
    this.servingPlayerId = snap.servingPlayerId
    this.status = snap.status
    this.winner = snap.winner
  }

  winRally(winner: PlayerId): void {
    if (this.status === 'FINISHED') return
    this.history.push(this.snapshot())

    const serving = this.server
    const receiving = this.receiver

    if (winner === serving.id) {
      serving.score++
      serving.currentSide = expectedSide(serving.score)
      if (checkWin(serving, receiving)) {
        this.status = 'FINISHED'
        this.winner = serving.id
      }
    } else {
      // serve transfer — new server's side is based on their own current score
      this.servingPlayerId = receiving.id
      receiving.currentSide = expectedSide(receiving.score)
    }
  }

  undo(): void {
    const snap = this.history.pop()
    if (snap) this.restore(snap)
  }

  reset(): void {
    this.playerA = { id: this.playerA.id, score: 0, currentSide: 'RIGHT' }
    this.playerB = { id: this.playerB.id, score: 0, currentSide: 'RIGHT' }
    this.servingPlayerId = this.initialServingPlayerId
    this.status = 'IN_PROGRESS'
    this.winner = null
    this.history = []
  }

  getScoreCall(): string {
    return `${this.server.score}-${this.receiver.score}`
  }

  getServingPlayer(): PlayerId {
    return this.servingPlayerId
  }

  getPlayerSide(id: PlayerId): CourtSide {
    return this.playerA.id === id ? this.playerA.currentSide : this.playerB.currentSide
  }

  getStatus(): GameStatus {
    return this.status
  }

  getWinner(): PlayerId | null {
    return this.winner
  }

  runPositionAssertion(): void {
    const serving = this.server
    const expected = expectedSide(serving.score)
    if (serving.currentSide !== expected) {
      throw new Error(
        `Position Error: ${serving.id} should be on ${expected} (score ${serving.score} is ${serving.score % 2 === 0 ? 'even' : 'odd'}), but is on ${serving.currentSide}`
      )
    }
  }
}
