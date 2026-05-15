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

describe('遊戲初始化', () => {
  it('起始為 0-0-2，由 A 隊發球', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.scoreA).toBe(0)
    expect(state.scoreB).toBe(0)
    expect(state.servingTeam).toBe('A')
    expect(state.serverNumber).toBe(2)
  })

  it('遊戲開始時 isFirstServe（第一次發球標記）為 true', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.isFirstServe).toBe(true)
  })
})

describe('得分規則', () => {
  it('發球隊得分：同隊繼續發球', () => {
    const next = scorePoint(createState(), 'A')

    expect(next.scoreA).toBe(1)
    expect(next.servingTeam).toBe('A')
  })

  it('雙打情況下發球隊得分：隊內發球編號切換', () => {
    const next = scorePoint(createState(), 'A')

    expect(next.serverNumber).toBe(1)
  })

  it('發球隊失誤：發球權移給對方，serverNumber 設為 1', () => {
    const next = scorePoint(createState({ isFirstServe: false, serverNumber: 1 }), 'B')

    expect(next.scoreA).toBe(0)
    expect(next.scoreB).toBe(0)
    expect(next.servingTeam).toBe('B')
    expect(next.serverNumber).toBe(1)
  })

  it('在比賽開始（0-0-2）時，若首發隊失誤：發球權移給對方成為 server 1，且 isFirstServe 變為 false', () => {
    const next = scorePoint(createState(), 'B')

    expect(next.servingTeam).toBe('B')
    expect(next.serverNumber).toBe(1)
    expect(next.isFirstServe).toBe(false)
  })
})

describe('勝負條件', () => {
  it('隊伍達到 winScore 且領先至少 2 分時勝出', () => {
    expect(checkWinCondition(createState({ scoreA: 11, scoreB: 9 }))).toEqual({
      gameOver: true,
      winner: 'A',
    })
  })

  it('若達到 winScore 但僅領先 1 分，則不算勝利', () => {
    expect(checkWinCondition(createState({ scoreA: 11, scoreB: 10 }))).toEqual({
      gameOver: false,
      winner: null,
    })
  })

  it('在 10-10 平手時（延長賽），比賽持續至領先 2 分為止', () => {
    expect(checkWinCondition(createState({ scoreA: 10, scoreB: 10 }))).toEqual({
      gameOver: false,
      winner: null,
    })
    expect(checkWinCondition(createState({ scoreA: 12, scoreB: 10 }))).toEqual({
      gameOver: true,
      winner: 'A',
    })
  })

  it('winScore 可自訂（例如 15 或 21）', () => {
    expect(
      checkWinCondition(createState({ settings: { mode: 'doubles', winScore: 15, winByTwo: true }, scoreA: 15, scoreB: 13 })),
    ).toEqual({ gameOver: true, winner: 'A' })
    expect(
      checkWinCondition(createState({ settings: { mode: 'doubles', winScore: 21, winByTwo: false }, scoreB: 21, scoreA: 20 })),
    ).toEqual({ gameOver: true, winner: 'B' })
  })
})

describe('比分顯示順序', () => {
  it('getDisplayScore 會將發球隊的分數顯示在 leftScore', () => {
    expect(getDisplayScore(createState({ scoreA: 7, scoreB: 5, servingTeam: 'A' }))).toEqual({
      leftScore: 7,
      rightScore: 5,
      serverNumber: 2,
    })
  })

  it('當發球隊改變時，getDisplayScore 會交換左右顯示', () => {
    expect(getDisplayScore(createState({ scoreA: 7, scoreB: 5, servingTeam: 'B', serverNumber: 1 }))).toEqual({
      leftScore: 5,
      rightScore: 7,
      serverNumber: 1,
    })
  })
})



