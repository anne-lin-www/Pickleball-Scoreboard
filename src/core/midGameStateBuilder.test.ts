import { describe, it, expect } from 'vitest'
import { buildMidGameState, type MidGameDoublesInput, type MidGameSinglesInput } from './midGameStateBuilder.js'
import { DoublesGame } from './doubles/DoublesGame.js'
import { SinglesGame } from './singles/SinglesGame.js'
import { deriveViewModel } from './gameViewModel.js'
import type { SetupConfig } from '../screens/SetupScreen.js'

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeDoublesInput(overrides: Partial<MidGameDoublesInput> = {}): MidGameDoublesInput {
  return {
    mode: 'doubles',
    teamAName: 'Team A',
    teamBName: 'Team B',
    topTeamId: 'TEAM_A',
    servingTeamId: 'TEAM_A',
    topLeftPlayerName: 'Alice',
    topRightPlayerName: 'Bob',
    bottomLeftPlayerName: 'Carol',
    bottomRightPlayerName: 'Dave',
    servingTeamScore: 0,
    receivingTeamScore: 0,
    serverNumber: 2,
    ...overrides,
  }
}

function makeSinglesInput(overrides: Partial<MidGameSinglesInput> = {}): MidGameSinglesInput {
  return {
    mode: 'singles',
    teamAName: 'Team A',
    teamBName: 'Team B',
    topTeamId: 'TEAM_A',
    servingTeamId: 'TEAM_A',
    topPlayerName: 'Alice',
    bottomPlayerName: 'Bob',
    servingTeamScore: 0,
    receivingTeamScore: 0,
    ...overrides,
  }
}

// ── Task 1.2: Doubles serving player derivation ───────────────────────────

describe('buildMidGameState — doubles serving player derivation', () => {
  it('even serving score → right-cell player (P2) is serving', () => {
    // GIVEN: Team A serving with score 4 (even)
    const game = buildMidGameState(makeDoublesInput({ servingTeamScore: 4, servingTeamId: 'TEAM_A' }))
    expect(game).toBeInstanceOf(DoublesGame)
    // THEN: serving player is TEAM_A_P2 (right cell)
    expect((game as DoublesGame).getServingPlayerId()).toBe('TEAM_A_P2')
  })

  it('odd serving score → left-cell player (P1) is serving', () => {
    // GIVEN: Team A serving with score 3 (odd)
    const game = buildMidGameState(makeDoublesInput({ servingTeamScore: 3, servingTeamId: 'TEAM_A' }))
    expect(game).toBeInstanceOf(DoublesGame)
    // THEN: serving player is TEAM_A_P1 (left cell)
    expect((game as DoublesGame).getServingPlayerId()).toBe('TEAM_A_P1')
  })

  it('isFirstServe is always false', () => {
    const game = buildMidGameState(makeDoublesInput({ servingTeamScore: 0 })) as DoublesGame
    // If isFirstServe were true, getServingPlayerId would return the anchor (P2), not currentServingPlayerId
    // For score 0 (even), both give P2 — use score 3 (odd) where they diverge
    const gameOdd = buildMidGameState(makeDoublesInput({ servingTeamScore: 3 })) as DoublesGame
    // If isFirstServe=true, it would return P2 (anchor); if false, returns P1 (current server)
    expect(gameOdd.getServingPlayerId()).toBe('TEAM_A_P1')
  })

  it('history is always empty — undo has no effect', () => {
    const game = buildMidGameState(makeDoublesInput({ servingTeamScore: 4 })) as DoublesGame
    const servingBefore = game.getServingTeam()
    const scoreBefore = game.getScoreCall()
    game.undo()
    expect(game.getServingTeam()).toBe(servingBefore)
    expect(game.getScoreCall()).toBe(scoreBefore)
  })

  // Example table from spec: Doubles serving player derivation
  it.each([
    { servingTeamScore: 0, expectedServer: 'TEAM_A_P2' }, // even → right
    { servingTeamScore: 3, expectedServer: 'TEAM_A_P1' }, // odd → left
    { servingTeamScore: 6, expectedServer: 'TEAM_A_P2' }, // even → right
    { servingTeamScore: 7, expectedServer: 'TEAM_A_P1' }, // odd → left
  ])('score $servingTeamScore → server $expectedServer', ({ servingTeamScore, expectedServer }) => {
    const game = buildMidGameState(makeDoublesInput({ servingTeamScore, servingTeamId: 'TEAM_A' })) as DoublesGame
    expect(game.getServingPlayerId()).toBe(expectedServer)
  })
})

// ── Task 1.3: Singles player side derivation ────────────────────────────

describe('buildMidGameState — singles player side derivation', () => {
  // Example table from spec: Singles side derivation
  it.each([
    { servingScore: 0, receivingScore: 0, servingSide: 'RIGHT', receivingSide: 'RIGHT' },
    { servingScore: 3, receivingScore: 2, servingSide: 'LEFT', receivingSide: 'RIGHT' },
    { servingScore: 6, receivingScore: 5, servingSide: 'RIGHT', receivingSide: 'LEFT' },
  ])(
    'servingScore=$servingScore, receivingScore=$receivingScore → serving=$servingSide, receiving=$receivingSide',
    ({ servingScore, receivingScore, servingSide, receivingSide }) => {
      const game = buildMidGameState(makeSinglesInput({
        servingTeamId: 'TEAM_A',
        servingTeamScore: servingScore,
        receivingTeamScore: receivingScore,
      })) as SinglesGame

      expect(game.getPlayerSide('TEAM_A_P1')).toBe(servingSide)
      expect(game.getPlayerSide('TEAM_B_P1')).toBe(receivingSide)
    }
  )

  it('isFirstServe is irrelevant for singles — score call is correct', () => {
    const game = buildMidGameState(makeSinglesInput({
      servingTeamId: 'TEAM_A',
      servingTeamScore: 5,
      receivingTeamScore: 3,
    })) as SinglesGame
    expect(game.getScoreCall()).toBe('5-3')
  })

  it('history is always empty — undo has no effect', () => {
    const game = buildMidGameState(makeSinglesInput({ servingTeamScore: 3 })) as SinglesGame
    const before = game.getScoreCall()
    game.undo()
    expect(game.getScoreCall()).toBe(before)
  })
})

// ── Task 1.4: Integration — buildMidGameState + deriveViewModel ──────────

describe('buildMidGameState — deriveViewModel integration', () => {
  it('doubles: deriveViewModel returns correct servingTeamId and serverNumber', () => {
    const input = makeDoublesInput({
      servingTeamId: 'TEAM_A',
      servingTeamScore: 5,
      receivingTeamScore: 3,
      serverNumber: 2,
    })
    const game = buildMidGameState(input) as DoublesGame

    const config: SetupConfig = {
      mode: 'doubles',
      topTeamId: input.topTeamId,
      teamAName: input.teamAName,
      teamBName: input.teamBName,
      teamAPlayer1: input.topLeftPlayerName,
      teamAPlayer2: input.topRightPlayerName,
      teamBPlayer1: input.bottomLeftPlayerName,
      teamBPlayer2: input.bottomRightPlayerName,
      firstServingTeam: input.servingTeamId,
      gamesCount: 1,
    }

    const vm = deriveViewModel(game, config)
    expect(vm.servingTeamId).toBe('TEAM_A')
    expect(vm.serverNumber).toBe(2)
  })

  it('singles: deriveViewModel returns correct servingTeamId', () => {
    const input = makeSinglesInput({ servingTeamId: 'TEAM_B', servingTeamScore: 4, receivingTeamScore: 2 })
    const game = buildMidGameState(input) as SinglesGame

    const config: SetupConfig = {
      mode: 'singles',
      topTeamId: input.topTeamId,
      teamAName: input.teamAName,
      teamBName: input.teamBName,
      teamAPlayer1: input.topPlayerName,
      teamAPlayer2: '',
      teamBPlayer1: input.bottomPlayerName,
      teamBPlayer2: '',
      firstServingTeam: input.servingTeamId,
      gamesCount: 1,
    }

    const vm = deriveViewModel(game, config)
    expect(vm.servingTeamId).toBe('TEAM_B')
  })

  it('doubles: score call matches input scores', () => {
    const game = buildMidGameState(makeDoublesInput({
      servingTeamScore: 7,
      receivingTeamScore: 5,
      serverNumber: 1,
    })) as DoublesGame
    expect(game.getScoreCall()).toBe('7-5-1')
  })
})
