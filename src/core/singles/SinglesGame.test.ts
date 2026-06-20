import { describe, it, expect } from 'vitest'
import { SinglesGame } from './SinglesGame.js'

describe('SinglesGame — initial game state (S1.1)', () => {
  it('starts at 0-0', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getScoreCall()).toBe('0-0')
  })

  it('server is on RIGHT at start (score 0 = even)', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getPlayerSide('A')).toBe('RIGHT')
  })

  it('status is IN_PROGRESS at start', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getStatus()).toBe('IN_PROGRESS')
  })

  it('winner is null at start', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getWinner()).toBeNull()
  })

  it('serving player is A at start', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getServingPlayer()).toBe('A')
  })
})

describe('SinglesGame — no first-server exception (S1.2)', () => {
  it('fault immediately transfers serve to B', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('B')
    expect(game.getServingPlayer()).toBe('B')
    expect(game.getPlayerSide('B')).toBe('RIGHT') // B score 0 = even
    expect(game.getScoreCall()).toBe('0-0')
  })
})

describe('SinglesGame — serve side determined by score parity (S2.1–S2.3)', () => {
  it('score 0 (even) → RIGHT (S2.1)', () => {
    const game = new SinglesGame('A', 'B')
    expect(game.getPlayerSide('A')).toBe('RIGHT')
  })

  it('score 1 (odd) → LEFT after first rally (S2.1)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A')
    expect(game.getPlayerSide('A')).toBe('LEFT')
  })

  it('score 2 (even) → RIGHT after second rally (S2.2)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A')
    game.winRally('A')
    expect(game.getPlayerSide('A')).toBe('RIGHT')
  })

  it.each([
    [0, 'RIGHT'],
    [1, 'LEFT'],
    [2, 'RIGHT'],
    [9, 'LEFT'],
    [10, 'RIGHT'],
    [11, 'LEFT'],
  ])('score %i → %s (S2.3 parity table)', (score, expected) => {
    const game = new SinglesGame('A', 'B')
    for (let i = 0; i < score; i++) game.winRally('A')
    expect(game.getPlayerSide('A')).toBe(expected)
  })
})

describe('SinglesGame — rally scoring and serve transfer (S3.1–S3.3)', () => {
  it('serving player scores and switches side (S3.1)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A: 0→1, RIGHT→LEFT
    expect(game.getScoreCall()).toBe('1-0')
    expect(game.getPlayerSide('A')).toBe('LEFT')
  })

  it('fault transfers serve, new server side from their own score (S3.1)', () => {
    // Build state: A=2, B=1, A serving → A faults → B serves with B score=1 (odd) → LEFT
    const game = new SinglesGame('A', 'B')
    game.winRally('B')    // A faults → B serves
    game.winRally('B')    // B scores → B=1
    game.winRally('A')    // B faults → A serves
    game.winRally('A')    // A scores → A=1
    game.winRally('A')    // A scores → A=2
    // State: A=2 (RIGHT, serving), B=1
    game.winRally('B')    // A faults → B serves, B score=1 (odd) → LEFT
    expect(game.getServingPlayer()).toBe('B')
    expect(game.getPlayerSide('B')).toBe('LEFT')
    expect(game.getScoreCall()).toBe('1-2')
  })

  it('receiving team win gives serve without scoring (S3.2)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A=1
    game.winRally('A') // A=2
    game.winRally('A') // A=3
    // Now A=3, B=0; B wins rally (A faults) → B gets serve, B score=0 (even) → RIGHT
    game.winRally('B')
    expect(game.getServingPlayer()).toBe('B')
    expect(game.getPlayerSide('B')).toBe('RIGHT') // B score 0 = even
    expect(game.getScoreCall()).toBe('0-3')
  })

  it('score call flips on serve transfer (S3.3)', () => {
    const game = new SinglesGame('A', 'B')
    // Build A=3, B=7 with B serving
    for (let i = 0; i < 7; i++) game.winRally('B') // but B isn't serving at start...
    // Actually: start fresh, A serves. Score A to 3, then transfer to B, B scores to 7
    const g2 = new SinglesGame('A', 'B')
    for (let i = 0; i < 3; i++) g2.winRally('A') // A=3
    g2.winRally('B') // transfer to B (B score=0 → RIGHT)
    for (let i = 0; i < 7; i++) g2.winRally('B') // B=7
    // Now B serves, B=7, A=3
    expect(g2.getScoreCall()).toBe('7-3')
    g2.winRally('A') // B faults → A gets serve back
    expect(g2.getServingPlayer()).toBe('A')
    expect(g2.getScoreCall()).toBe('3-7')
  })

  // Spec example table: [serverScore, receiverScore, serverId, receiverId, expectedSide]
  // receiverScore = score the receiver already has; after fault they become new server
  it.each([
    [2, 1, 'A', 'B', 'LEFT'],  // A faults (A=2), B score=1 (odd) → LEFT
    [2, 3, 'B', 'A', 'LEFT'],  // B faults (B=2), A score=3 (odd) → LEFT
    [4, 0, 'A', 'B', 'RIGHT'], // A faults (A=4), B score=0 (even) → RIGHT
  ])(
    'serve transfer: %s(score=%i) faults → %s(score=%i) serves from %s',
    (serverScore, receiverScore, serverId, receiverId, expectedSide) => {
      const game = new SinglesGame(serverId, receiverId)
      for (let i = 0; i < serverScore; i++) game.winRally(serverId)
      game.winRally(receiverId) // fault → receiver gets serve
      for (let i = 0; i < receiverScore; i++) game.winRally(receiverId)
      game.winRally(serverId) // fault back to original server
      game.winRally(receiverId) // original server faults → receiver becomes new server
      expect(game.getServingPlayer()).toBe(receiverId)
      expect(game.getPlayerSide(receiverId)).toBe(expectedSide)
    }
  )
})

describe('SinglesGame — win condition (S4.1–S4.5)', () => {
  function gameWithScore(aScore: number, bScore: number): SinglesGame {
    const game = new SinglesGame('A', 'B')
    for (let i = 0; i < aScore; i++) game.winRally('A')
    game.winRally('B') // fault → B serves
    for (let i = 0; i < bScore; i++) game.winRally('B')
    game.winRally('A') // fault → A serves
    return game
  }

  it('normal win at 11 (S4.1)', () => {
    const game = gameWithScore(10, 8)
    expect(game.getStatus()).toBe('IN_PROGRESS')
    game.winRally('A')
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('A')
  })

  it('Deuce at 10-10 does not win (S4.2)', () => {
    const game = gameWithScore(10, 10)
    game.winRally('A')
    expect(game.getStatus()).toBe('IN_PROGRESS')
    expect(game.getScoreCall()).toMatch(/^11-10/)
  })

  it('extended play win at 12-10 (S4.3)', () => {
    const game = gameWithScore(10, 10)
    game.winRally('A') // 11-10
    game.winRally('A') // 12-10
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('A')
  })

  it('Deuce: serve transfers, opponent wins (S4.4)', () => {
    // Build 11-10 with A serving, then fault to B, B ties at 11-11, B wins 13-11
    // Note: Test_Cases.md S4.4 says "12-11 B wins" but that's only a 1-pt lead;
    // correct win requires ≥2 pt lead (13-11).
    const game = gameWithScore(10, 10)
    game.winRally('A') // A=11, B=10 (lead=1, IN_PROGRESS)
    game.winRally('B') // A faults → B serves
    game.winRally('B') // B scores → B=11, A=11 (deuce)
    game.winRally('B') // B scores → B=12, A=11 (lead=1, IN_PROGRESS)
    expect(game.getStatus()).toBe('IN_PROGRESS')
    game.winRally('B') // B scores → B=13, A=11 (lead=2, FINISHED)
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('B')
  })

  it('long extended play wins at 16-14 (S4.5)', () => {
    const game = gameWithScore(15, 14)
    game.winRally('A')
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('A')
  })

  it.each([
    [10, 8,  'A', 'FINISHED'],
    [10, 10, 'A', 'IN_PROGRESS'],
    [11, 10, 'A', 'FINISHED'],
    [15, 14, 'A', 'FINISHED'],
  ])('score %i-%i, A scores → status=%s', (aScore, bScore, scorer, expectedStatus) => {
    const game = gameWithScore(aScore, bScore)
    game.winRally(scorer)
    expect(game.getStatus()).toBe(expectedStatus)
  })
})

describe('SinglesGame — position assertion using score parity (S5.1, S5.2)', () => {
  it('correct position passes — even score on RIGHT (S5.1)', () => {
    const game = new SinglesGame('A', 'B')
    // A score=0 (even), currentSide=RIGHT → correct
    expect(() => game.runPositionAssertion()).not.toThrow()
  })

  it('correct position passes — odd score on LEFT', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A=1, LEFT
    expect(() => game.runPositionAssertion()).not.toThrow()
  })

  it('wrong position throws — odd score but on RIGHT (S5.2)', () => {
    const game = new SinglesGame('A', 'B') as unknown as {
      playerA: { score: number; currentSide: string }
      runPositionAssertion: () => void
    }
    game.playerA.score = 3        // odd
    game.playerA.currentSide = 'RIGHT' // wrong
    expect(() => (game as unknown as { runPositionAssertion(): void }).runPositionAssertion()).toThrow()
  })

  it('wrong position throws — even score but on LEFT', () => {
    const game = new SinglesGame('A', 'B') as unknown as {
      playerA: { score: number; currentSide: string }
      runPositionAssertion: () => void
    }
    game.playerA.score = 4        // even
    game.playerA.currentSide = 'LEFT' // wrong
    expect(() => (game as unknown as { runPositionAssertion(): void }).runPositionAssertion()).toThrow()
  })
})

describe('SinglesGame — undo restores previous state (S6.1, S6.2)', () => {
  it('undo after score restores score and side (S6.1)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A=1, LEFT
    game.winRally('A') // A=2, RIGHT
    game.undo()
    expect(game.getScoreCall()).toBe('1-0')
    expect(game.getPlayerSide('A')).toBe('LEFT') // back to score=1 (odd)
  })

  it('undo after serve transfer restores serving player and scoreCall (S6.2)', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A=1
    game.winRally('A') // A=2
    game.winRally('A') // A=3
    game.winRally('B') // A faults → B serves; scoreCall was "3-0" before fault
    expect(game.getServingPlayer()).toBe('B')
    expect(game.getScoreCall()).toBe('0-3')
    game.undo()
    expect(game.getServingPlayer()).toBe('A')
    expect(game.getScoreCall()).toBe('3-0')
  })

  it('undo on empty history is a no-op (S6)', () => {
    const game = new SinglesGame('A', 'B')
    expect(() => game.undo()).not.toThrow()
    expect(game.getScoreCall()).toBe('0-0')
  })

  it('multiple undo steps restore each state', () => {
    const game = new SinglesGame('A', 'B')
    game.winRally('A') // A=1
    game.winRally('A') // A=2
    game.winRally('A') // A=3
    game.undo()
    expect(game.getScoreCall()).toBe('2-0')
    game.undo()
    expect(game.getScoreCall()).toBe('1-0')
    game.undo()
    expect(game.getScoreCall()).toBe('0-0')
  })
})
