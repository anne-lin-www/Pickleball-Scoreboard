import { describe, expect, it } from 'vitest'
import { createGame } from '../src/core/game'
import { checkWinCondition, getDisplayScore, scorePoint } from '../src/core/rules'
import type { GameState } from '../src/core/types'

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...createGame(
    { mode: 'doubles', winScore: 11, winByTwo: true },
    { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
  ),
  ...overrides,
})

describe('Game initialization', () => {
  it('starts at 0-0-2 with team A serving', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.scoreA).toBe(0)
    expect(state.scoreB).toBe(0)
    expect(state.servingTeam).toBe('A')
    expect(state.serverNumber).toBe(2)
  })

  it('isFirstServe is true at game start', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.isFirstServe).toBe(true)
  })
})

describe('Scoring', () => {
  it('serving team scores: same team keeps serving', () => {
    const next = scorePoint(createState(), 'A')

    expect(next.scoreA).toBe(1)
    expect(next.servingTeam).toBe('A')
  })

  it('serving team scores in doubles: server number toggles within team', () => {
    const next = scorePoint(createState(), 'A')

    expect(next.serverNumber).toBe(1)
  })

  it('serving team faults: serve passes to other team with server 1', () => {
    const next = scorePoint(createState({ isFirstServe: false, serverNumber: 1 }), 'B')

    expect(next.scoreA).toBe(0)
    expect(next.scoreB).toBe(0)
    expect(next.servingTeam).toBe('B')
    expect(next.serverNumber).toBe(1)
  })

  it('at game start (0-0-2), initial team faults: serve passes to other team as server 1, isFirstServe becomes false', () => {
    const next = scorePoint(createState(), 'B')

    expect(next.servingTeam).toBe('B')
    expect(next.serverNumber).toBe(1)
    expect(next.isFirstServe).toBe(false)
  })
})

describe('Win condition', () => {
  it('team wins when reaching winScore with 2+ point lead', () => {
    expect(checkWinCondition(createState({ scoreA: 11, scoreB: 9 }))).toEqual({
      gameOver: true,
      winner: 'A',
    })
  })

  it('team does NOT win at winScore if lead is only 1 point', () => {
    expect(checkWinCondition(createState({ scoreA: 11, scoreB: 10 }))).toEqual({
      gameOver: false,
      winner: null,
    })
  })

  it('deuce at 10-10: continues until 2 point lead', () => {
    expect(checkWinCondition(createState({ scoreA: 10, scoreB: 10 }))).toEqual({
      gameOver: false,
      winner: null,
    })
    expect(checkWinCondition(createState({ scoreA: 12, scoreB: 10 }))).toEqual({
      gameOver: true,
      winner: 'A',
    })
  })

  it('winScore can be customized (e.g. 15 or 21)', () => {
    expect(
      checkWinCondition(createState({ settings: { mode: 'doubles', winScore: 15, winByTwo: true }, scoreA: 15, scoreB: 13 })),
    ).toEqual({ gameOver: true, winner: 'A' })
    expect(
      checkWinCondition(createState({ settings: { mode: 'doubles', winScore: 21, winByTwo: false }, scoreB: 21, scoreA: 20 })),
    ).toEqual({ gameOver: true, winner: 'B' })
  })
})

describe('Score display order', () => {
  it('getDisplayScore returns serving team score as leftScore', () => {
    expect(getDisplayScore(createState({ scoreA: 7, scoreB: 5, servingTeam: 'A' }))).toEqual({
      leftScore: 7,
      rightScore: 5,
      serverNumber: 2,
    })
  })

  it('getDisplayScore swaps left/right when serving team changes', () => {
    expect(getDisplayScore(createState({ scoreA: 7, scoreB: 5, servingTeam: 'B', serverNumber: 1 }))).toEqual({
      leftScore: 5,
      rightScore: 7,
      serverNumber: 1,
    })
  })
})

