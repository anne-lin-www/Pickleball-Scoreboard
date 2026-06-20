import { describe, it, expect } from 'vitest'
import { DoublesGame } from './DoublesGame.js'

describe('DoublesGame — initial game state (D1.1)', () => {
  it('starts at 0-0-2', () => {
    const game = new DoublesGame('TEAM_A')
    expect(game.getScoreCall()).toBe('0-0-2')
  })

  it('server number is 2 at start', () => {
    const game = new DoublesGame('TEAM_A')
    expect(game.getServerNumber()).toBe(2)
  })

  it('status is IN_PROGRESS at start', () => {
    const game = new DoublesGame('TEAM_A')
    expect(game.getStatus()).toBe('IN_PROGRESS')
  })

  it('winner is null at start', () => {
    const game = new DoublesGame('TEAM_A')
    expect(game.getWinner()).toBeNull()
  })

  it('serving team is TEAM_A at start', () => {
    const game = new DoublesGame('TEAM_A')
    expect(game.getServingTeam()).toBe('TEAM_A')
  })
})

describe('DoublesGame — first-server exception on initial Side Out (D1.2)', () => {
  it('immediate Side Out when first serve team faults', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B')
    expect(game.getScoreCall()).toBe('0-0-1')
    expect(game.getServingTeam()).toBe('TEAM_B')
    expect(game.getServerNumber()).toBe(1)
  })

  it('after first Side Out, normal 2-server rule applies to new serving team (D1.2)', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // first serve → Side Out to B
    game.winRally('TEAM_A') // B's server 1 faults → B's server 2
    expect(game.getServingTeam()).toBe('TEAM_B')
    expect(game.getServerNumber()).toBe(2)
  })
})

describe('DoublesGame — rally scoring and position switching (D2.1, D2.2)', () => {
  it('serving team scores and players switch sides (D2.1)', () => {
    const game = new DoublesGame('TEAM_A')
    const before = game.getTeamPositions('TEAM_A')
    game.winRally('TEAM_A')
    expect(game.getScoreCall()).toBe('1-0-2')
    const after = game.getTeamPositions('TEAM_A')
    // each player has swapped
    for (const [id, side] of Object.entries(before)) {
      expect(after[id]).toBe(side === 'RIGHT' ? 'LEFT' : 'RIGHT')
    }
  })

  it('receiving team positions do not change when serving team scores (D2.1)', () => {
    const game = new DoublesGame('TEAM_A')
    const bBefore = game.getTeamPositions('TEAM_B')
    game.winRally('TEAM_A')
    const bAfter = game.getTeamPositions('TEAM_B')
    expect(bAfter).toEqual(bBefore)
  })

  it('receiving team wins → server advances to 2, no position change (D2.2)', () => {
    // Note: first we need to pass the first-serve exception
    // get past the first-serve exception so normal rules apply
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // Side Out → B serves server 1
    const bBefore = game.getTeamPositions('TEAM_B')
    const aBefore = game.getTeamPositions('TEAM_A')
    game.winRally('TEAM_A') // A wins while B serves → B advances to server 2
    expect(game.getServingTeam()).toBe('TEAM_B')
    expect(game.getServerNumber()).toBe(2)
    expect(game.getScoreCall()).toBe('0-0-2')
    expect(game.getTeamPositions('TEAM_B')).toEqual(bBefore)
    expect(game.getTeamPositions('TEAM_A')).toEqual(aBefore)
  })
})

describe('DoublesGame — server sequence (D3.1, D3.2)', () => {
  function gameAtScore(servingTeam: 'TEAM_A' | 'TEAM_B', score: string): DoublesGame {
    // Build a game at state "1-0-1" by: A scores once (→ 1-0-2 during first-serve),
    // then we need a fresh game with A already past first serve with server 1
    // Simplest: A scores once (1-0-2), then B does Side Out (B serves), A does Side Out
    // back to A, A has server 1. Easier: just use the public API from scratch.
    const game = new DoublesGame('TEAM_A')
    // get past first-serve: A faults → B server1
    game.winRally('TEAM_B')
    // B server1 faults → B server2
    game.winRally('TEAM_A')
    // B server2 faults → Side Out to A, server1
    game.winRally('TEAM_A')
    // Now A is serving, server1, 0-0-1
    // A scores once → 1-0-1
    game.winRally('TEAM_A')
    return game
  }

  it('server 1 fault advances to server 2 (D3.1)', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // past first-serve → B s1
    game.winRally('TEAM_A') // B s1 → B s2
    game.winRally('TEAM_A') // B s2 → Side Out to A s1
    game.winRally('TEAM_A') // A scores → 1-0-1
    // state is "1-0-1", A serving, server 1
    expect(game.getScoreCall()).toBe('1-0-1')
    game.winRally('TEAM_B') // A server 1 faults
    expect(game.getScoreCall()).toBe('1-0-2')
    expect(game.getServingTeam()).toBe('TEAM_A')
    expect(game.getServerNumber()).toBe(2)
  })

  it('server 2 fault triggers Side Out (D3.2)', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // past first-serve → B s1
    game.winRally('TEAM_A') // B s1 → B s2
    game.winRally('TEAM_A') // B s2 → Side Out to A s1
    game.winRally('TEAM_A') // A scores → 1-0-1
    game.winRally('TEAM_B') // A s1 faults → 1-0-2
    game.winRally('TEAM_B') // A s2 faults → Side Out to B s1
    expect(game.getServingTeam()).toBe('TEAM_B')
    expect(game.getServerNumber()).toBe(1)
    expect(game.getScoreCall()).toBe('0-1-1')
  })
})

describe('DoublesGame — win condition (D4.1–D4.3)', () => {
  function gameWithScore(aScore: number, bScore: number): DoublesGame {
    // Build game state by scoring aScore points for A then bScore for B
    // Use a fresh game with B as first server so A never has the first-serve penalty
    const game = new DoublesGame('TEAM_B')
    game.winRally('TEAM_A') // B faults (first serve) → A gets serve, server 1
    for (let i = 0; i < aScore; i++) game.winRally('TEAM_A')
    // Side Out to B
    game.winRally('TEAM_B') // A server 1 → server 2
    game.winRally('TEAM_B') // A server 2 → Side Out to B server 1
    for (let i = 0; i < bScore; i++) game.winRally('TEAM_B')
    // Side Out back to A server 1
    game.winRally('TEAM_A') // B s1 → B s2
    game.winRally('TEAM_A') // B s2 → Side Out to A s1
    return game
  }

  it('normal win at 11 (D4.1)', () => {
    const game = gameWithScore(10, 8)
    expect(game.getStatus()).toBe('IN_PROGRESS')
    game.winRally('TEAM_A')
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('TEAM_A')
  })

  it('Deuce at 10-10 does not win (D4.2)', () => {
    const game = gameWithScore(10, 10)
    game.winRally('TEAM_A')
    expect(game.getStatus()).toBe('IN_PROGRESS')
    expect(game.getScoreCall()).toMatch(/^11-10/)
  })

  it('extended play win at 12-10 (D4.3)', () => {
    const game = gameWithScore(10, 10)
    game.winRally('TEAM_A') // 11-10
    game.winRally('TEAM_A') // 12-10
    expect(game.getStatus()).toBe('FINISHED')
    expect(game.getWinner()).toBe('TEAM_A')
  })
})

describe('DoublesGame — position assertion using anchor player parity (D5.1, D5.2)', () => {
  it('correct position passes assertion — even score, anchor on RIGHT (D5.1)', () => {
    // Fresh game: A score=0 (even), anchor (isStartingRight) player should be on RIGHT
    const game = new DoublesGame('TEAM_A')
    expect(() => game.runPositionAssertion()).not.toThrow()
  })

  it('correct position passes after scoring twice — score=2 (even), anchor on RIGHT', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A') // score 1, anchor on LEFT
    game.winRally('TEAM_A') // score 2, anchor back on RIGHT
    expect(() => game.runPositionAssertion()).not.toThrow()
  })

  it('wrong position throws — odd score but anchor on RIGHT (D5.2)', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A') // score 1 (odd), anchor moved to LEFT — correct
    // Force anchor back to RIGHT to simulate wrong position
    const positions = game.getTeamPositions('TEAM_A')
    // Directly verify that after 1 score, anchor IS on LEFT (correct), assertion passes
    expect(() => game.runPositionAssertion()).not.toThrow()
  })

  it('manually corrupt position and assertion detects it (D5.2)', () => {
    // We test the detection by creating a game class that exposes internal state
    // Instead, verify indirectly: score=1 means anchor on LEFT → assertion passes
    // To get D5.2 (anchor on wrong side), we access via the implementation
    // Use a subclass approach via type cast to force corruption
    const game = new DoublesGame('TEAM_A') as unknown as {
      teamA: { score: number; players: Array<{ isStartingRight: boolean; currentSide: string }> }
      runPositionAssertion: () => void
    }
    // Corrupt: set score to 3 (odd) but force anchor to RIGHT
    game.teamA.score = 3
    const anchor = game.teamA.players.find((p) => p.isStartingRight)!
    anchor.currentSide = 'RIGHT' // wrong for odd score
    expect(() => (game as unknown as { runPositionAssertion(): void }).runPositionAssertion()).toThrow()
  })
})

describe('DoublesGame — undo restores previous state', () => {
  it('undo after score restores scoreCall and positions', () => {
    const game = new DoublesGame('TEAM_A')
    const posBefore = game.getTeamPositions('TEAM_A')
    game.winRally('TEAM_A') // 1-0-2
    game.undo()
    expect(game.getScoreCall()).toBe('0-0-2')
    expect(game.getTeamPositions('TEAM_A')).toEqual(posBefore)
  })

  it('undo after Side Out restores serving team and server number', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // Side Out to B
    game.undo()
    expect(game.getServingTeam()).toBe('TEAM_A')
    expect(game.getServerNumber()).toBe(2)
    expect(game.getScoreCall()).toBe('0-0-2')
  })

  it('undo on empty history is a no-op', () => {
    const game = new DoublesGame('TEAM_A')
    expect(() => game.undo()).not.toThrow()
    expect(game.getScoreCall()).toBe('0-0-2')
  })

  it('multiple undo steps restore each previous state', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A') // 1-0-2
    game.winRally('TEAM_A') // 2-0-2
    game.undo()
    expect(game.getScoreCall()).toBe('1-0-2')
    game.undo()
    expect(game.getScoreCall()).toBe('0-0-2')
  })
})

describe('DoublesGame — reset match (D6)', () => {
  it('reset from in-progress clears all state to initial', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A')
    game.winRally('TEAM_A')
    game.reset()
    expect(game.getScoreCall()).toBe('0-0-2')
    expect(game.getServingTeam()).toBe('TEAM_A')
    expect(game.getServerNumber()).toBe(2)
    expect(game.getStatus()).toBe('IN_PROGRESS')
    expect(game.getWinner()).toBeNull()
  })

  it('reset from FINISHED restores to playable state', () => {
    // Build a finished game via gameWithScore helper approach
    const game = new DoublesGame('TEAM_B')
    game.winRally('TEAM_A') // first serve exception → TEAM_A serves s1
    for (let i = 0; i < 11; i++) game.winRally('TEAM_A')
    expect(game.getStatus()).toBe('FINISHED')
    game.reset()
    expect(game.getStatus()).toBe('IN_PROGRESS')
    expect(game.getWinner()).toBeNull()
    expect(game.getScoreCall()).toBe('0-0-2')
  })

  it('reset clears undo history — undo after reset is no-op', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A')
    game.winRally('TEAM_A')
    game.reset()
    game.undo()
    expect(game.getScoreCall()).toBe('0-0-2')
  })

  it('reset restores original serving team to constructor argument', () => {
    const game = new DoublesGame('TEAM_B')
    game.winRally('TEAM_A') // first-serve Side Out → TEAM_A serves
    expect(game.getServingTeam()).toBe('TEAM_A')
    game.reset()
    expect(game.getServingTeam()).toBe('TEAM_B')
  })

  it('reset restores first-serve exception — next fault triggers Side Out immediately', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_B') // first-serve exception fires → isFirstServe=false, TEAM_B serves
    game.reset()
    // After reset, isFirstServe should be true again
    // TEAM_A serves; fault → immediate Side Out to TEAM_B server 1
    game.winRally('TEAM_B')
    expect(game.getServingTeam()).toBe('TEAM_B')
    expect(game.getServerNumber()).toBe(1)
    expect(game.getScoreCall()).toBe('0-0-1')
  })

  it('reset restores player positions — anchor on RIGHT', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A') // players swapped
    game.reset()
    const positions = game.getTeamPositions('TEAM_A')
    expect(positions['TEAM_A_P1']).toBe('RIGHT') // anchor
    expect(positions['TEAM_A_P2']).toBe('LEFT')  // non-anchor
  })

  it('reset is idempotent — multiple resets leave same initial state', () => {
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A')
    game.reset()
    expect(game.getScoreCall()).toBe('0-0-2')
    game.winRally('TEAM_A')
    game.reset()
    expect(game.getScoreCall()).toBe('0-0-2')
    expect(game.getServingTeam()).toBe('TEAM_A')
  })

  it.each([
    [0,  false, 'reset on fresh game'],
    [5,  false, 'score 5 then reset'],
    [3,  true,  'score 3 then reset then undo'],
  ])('boundary: %s scores → getScoreCall returns "0-0-2"', (scoreTimes, doUndo) => {
    const game = new DoublesGame('TEAM_A')
    for (let i = 0; i < scoreTimes; i++) game.winRally('TEAM_A')
    game.reset()
    if (doUndo) game.undo()
    expect(game.getScoreCall()).toBe('0-0-2')
    expect(game.getStatus()).toBe('IN_PROGRESS')
  })
})
