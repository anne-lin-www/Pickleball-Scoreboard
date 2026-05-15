import { describe, expect, it } from 'vitest'
import { createGame } from '../src/core/game'
import { calculatePositions, getCourtLayout, getServerPlayer } from '../src/core/rotation'

describe('Initial positions', () => {
  it('A1 starts on even side (right), A2 on odd side (left)', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'A2')?.position).toBe('odd')
  })

  it('B1 starts on even side (right), B2 on odd side (left)', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(state.players.find((player) => player.id === 'B1')?.position).toBe('even')
    expect(state.players.find((player) => player.id === 'B2')?.position).toBe('odd')
  })
})

describe('Position after scoring', () => {
  it('A scores: A1 and A2 swap positions', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const players = calculatePositions(state.players, 1, 0)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'A2')?.position).toBe('even')
  })

  it('A scores again: A1 and A2 swap back', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )
    const players = calculatePositions(state.players, 2, 0)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'A2')?.position).toBe('odd')
  })

  it('B scores: B positions unchanged, A positions unchanged', () => {
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

describe('Deterministic position calculation', () => {
  it('even team score = original positions', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 4, 2)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('even')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('even')
  })

  it('odd team score = swapped positions', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 3, 1)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('odd')
  })

  it('can reconstruct positions from any scoreA/scoreB values', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    const players = calculatePositions(state.players, 7, 4)

    expect(players.find((player) => player.id === 'A1')?.position).toBe('odd')
    expect(players.find((player) => player.id === 'B1')?.position).toBe('even')
  })
})

describe('Court layout', () => {
  it('getCourtLayout returns correct 4-position layout', () => {
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

  it('getServerPlayer returns the correct serving player', () => {
    const state = createGame(
      { mode: 'doubles', winScore: 11, winByTwo: true },
      { a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2' },
    )

    expect(getServerPlayer(state).id).toBe('A1')
  })
})
