import { describe, expect, it } from 'vitest'
import { createGame, resetGame, scorePoint, undoLastPoint } from '../src/core/game'

describe('Undo', () => {
  it('undoLastPoint restores previous state', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const scored = scorePoint(state, 'A')

    expect(scored.history).toHaveLength(1)
    expect(undoLastPoint(scored)).toEqual(state)
  })

  it('undo at game start does nothing (no history)', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(undoLastPoint(state)).toBe(state)
  })
})

describe('Game state machine', () => {
  it('appends current state to history before updating and recalculates positions', () => {
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

  it('limits history depth to 50 states', () => {
    let state = createGame(
      { mode: 'doubles', winScore: 101, winByTwo: false },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    for (let index = 0; index < 55; index += 1) {
      state = scorePoint(state, state.servingTeam)
    }

    expect(state.history).toHaveLength(50)
  })

  it('resetGame resets scores and positions, keeps settings and player names', () => {
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
