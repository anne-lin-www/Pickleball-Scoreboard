import { describe, expect, it } from 'vitest'
import { createGame, resetGame, scorePoint, undoLastPoint } from '../src/core/game'

describe('復原', () => {
  it('undoLastPoint 應還原到先前的遊戲狀態', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const scored = scorePoint(state, 'A')

    expect(scored.history).toHaveLength(1)
    expect(undoLastPoint(scored)).toEqual(state)
  })

  it('遊戲開始時執行 undo 不應改變狀態（無歷史紀錄）', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(undoLastPoint(state)).toBe(state)
  })
})

describe('遊戲狀態機', () => {
  it('在更新前將當前狀態加入歷史，並重新計算位置', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const next = scorePoint(state, 'A')

    expect(next.history).toHaveLength(1)
    expect(next.history[0]).toEqual(state)
    expect(next.players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(next.players.find((player) => player.id === 'A2')?.position).toBe('even')
  })

  it('限制歷史紀錄深度為 50', () => {
    let state = createGame(
      { mode: 'doubles', winScore: 101, winByTwo: false },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    for (let index = 0; index < 55; index += 1) {
      state = scorePoint(state, state.servingTeam)
    }

    expect(state.history).toHaveLength(50)
  })

  it('resetGame 會重設比分與位置，但保留設定與玩家名稱', () => {
    const state = scorePoint(
      createGame(
        { mode: 'doubles', winScore: 15, winByTwo: true },
        { a1: 'Anne', a2: 'Lin', b1: 'Chris', b2: 'Pat' },
      ),
      'A',
    )

    const reset = resetGame(state)

    expect(reset.scoreA).toBe(0)
    expect(reset.scoreB).toBe(0)
    expect(reset.serverNumber).toBe(2)
    expect(reset.settings).toEqual(state.settings)
    expect(reset.players.map((player) => player.name)).toEqual(['Anne', 'Lin', 'Chris', 'Pat'])
    expect(reset.players.find((player) => player.id === 'A1')?.position).toBe('even')
  })
})
