import { describe, expect, it } from 'vitest'
import { createGame, handOut, scorePoint } from '../src/core/game'
import { calculatePositions, getCourtLayout, getServerPlayer } from '../src/core/rotation'
import type { GameState } from '../src/core/types'

const createState = (overrides: Partial<GameState> = {}): GameState => {
  const base = createGame(
    { mode: 'doubles', winScore: 11, winByTwo: true },
    { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
  )
  const merged = { ...base, ...overrides }

  return {
    ...merged,
    players:
      overrides.players ??
      calculatePositions(base.players, merged.scoreA, merged.scoreB),
  }
}

describe('初始位置', () => {
  it("A1 初始在 'even'（右側/偶數位），A2 在 'odd'（左側/奇數位）", () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'A2')?.position).toBe('odd')
    expect(state.servingPlayerId).toBe('A1')
  })

  it("B1 初始在 'even'（右側/偶數位），B2 在 'odd'（左側/奇數位）", () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.players.find((player) => player.id === 'B1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'B2')?.position).toBe('odd')
    expect(state.servingPlayerId).toBe('A1')
  })

  it('B 先發開局：B1 是發球員，其他初始站位不變', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
      'B',
    )

    expect(state.servingTeam).toBe('B')
    expect(state.servingPlayerId).toBe('B1')
    expect(state.serverNumber).toBe(2)
    expect(state.players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'A2')?.position).toBe('odd')
    expect(state.players.find((player) => player.id === 'B1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'B2')?.position).toBe('odd')
  })
})

describe('得分後的位置', () => {
  it('A 得分：A1 與 A2 交換位置', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const next = scorePoint(state, 'A')

    expect(next.players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(next.players.find((player) => player.id === 'A2')?.position).toBe('even')
    expect(next.servingPlayerId).toBe('A1')
  })

  it('A 再得分：A1 與 A2 交換回原位', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const next = scorePoint(scorePoint(state, 'A'), 'A')

    expect(next.players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(next.players.find((player) => player.id === 'A2')?.position).toBe('odd')
    expect(next.servingPlayerId).toBe('A1')
  })

  it('A 失誤（side-out）：雙方站位不變，因兩隊 score 均未變動', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const players = calculatePositions(state.players, 0, 0)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'A2')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'B2')?.position).toBe('odd')
  })

  it('A 得分後，getServerPlayer 仍回傳 A1（換位後繼續發球）', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const next = scorePoint(state, 'A')

    expect(getServerPlayer(next).id).toBe('A1')
  })

  it('hand-out 後，getServerPlayer 回傳 A2', () => {
    const state = createState({
      scoreA: 1,
      servingTeam: 'A',
      serverNumber: 1,
      isFirstServe: false,
      servingPlayerId: 'A1',
    })
    const next = handOut(state)

    expect(getServerPlayer(next).id).toBe('A2')
  })
})

describe('確定性的位置計算', () => {
  it('隊伍分數為偶數時 = 原始位置', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 4, 2)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('even')
  })

  it('隊伍分數為奇數時 = 交換位置', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 3, 1)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('odd')
  })

  it('可從任意 scoreA/scoreB 值重建位置', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 7, 4)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('even')
  })
})

describe('場上佈局', () => {
  it('getCourtLayout 回傳正確的四個位置佈局', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const layout = getCourtLayout(state)

    expect(layout.topLeft?.id).toBe('A2')
    expect(layout.topRight?.id).toBe('A1')
    // B 面向上方，B 的右側（even）在圖的左側
    expect(layout.bottomLeft?.id).toBe('B1')
    expect(layout.bottomRight?.id).toBe('B2')
  })

  it('getServerPlayer 回傳正確的發球者', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(getServerPlayer(state).id).toBe('A1')
  })
})
