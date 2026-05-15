import { describe, expect, it } from 'vitest'
import { createGame } from '../src/core/game'
import { calculatePositions, getCourtLayout, getServerPlayer } from '../src/core/rotation'

describe('初始位置', () => {
  it('A1 初始在偶數邊（右側），A2 在奇數邊（左側）', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'A2')?.position).toBe('odd')
  })

  it('B1 初始在偶數邊（右側），B2 在奇數邊（左側）', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

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
    const players = calculatePositions(state.players, 1, 0)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'A2')?.position).toBe('even')
  })

  it('A 再得分：A1 與 A2 交換回原位', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const players = calculatePositions(state.players, 2, 0)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'A2')?.position).toBe('odd')
  })

  it('B 得分：B 與 A 的位置皆不變', () => {
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
    expect(layout.bottomLeft?.id).toBe('B2')
    expect(layout.bottomRight?.id).toBe('B1')
  })

  it('getServerPlayer 回傳正確的發球者', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(getServerPlayer(state).id).toBe('A1')
  })
})
