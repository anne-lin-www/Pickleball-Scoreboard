import { describe, it, expect } from 'vitest'
import { createGame } from './gameInit.js'
import { DoublesGame } from './doubles/DoublesGame.js'
import { SinglesGame } from './singles/SinglesGame.js'
import type { SetupConfig } from '../screens/SetupScreen.js'

const baseConfig: SetupConfig = {
  mode: 'doubles',
  topTeamId: 'TEAM_A',
  teamAName: 'Team A',
  teamBName: 'Team B',
  teamAPlayer1: 'Alice',
  teamAPlayer2: 'Bob',
  teamBPlayer1: 'Carol',
  teamBPlayer2: 'Dave',
  firstServingTeam: 'TEAM_A',
  gamesCount: 1,
}

describe('createGame', () => {
  describe('doubles mode', () => {
    it('returns a DoublesGame instance', () => {
      const game = createGame({ ...baseConfig, mode: 'doubles' })
      expect(game).toBeInstanceOf(DoublesGame)
    })

    it('TEAM_A serves first when firstServingTeam is TEAM_A', () => {
      const game = createGame({ ...baseConfig, mode: 'doubles', firstServingTeam: 'TEAM_A' }) as DoublesGame
      expect(game.getServingTeam()).toBe('TEAM_A')
    })

    it('TEAM_B serves first when firstServingTeam is TEAM_B', () => {
      const game = createGame({ ...baseConfig, mode: 'doubles', firstServingTeam: 'TEAM_B' }) as DoublesGame
      expect(game.getServingTeam()).toBe('TEAM_B')
    })
  })

  describe('singles mode', () => {
    it('returns a SinglesGame instance', () => {
      const game = createGame({ ...baseConfig, mode: 'singles' })
      expect(game).toBeInstanceOf(SinglesGame)
    })

    it('TEAM_A_P1 serves first when firstServingTeam is TEAM_A', () => {
      const game = createGame({ ...baseConfig, mode: 'singles', firstServingTeam: 'TEAM_A' }) as SinglesGame
      expect(game.getServingPlayer()).toBe('TEAM_A_P1')
    })

    it('TEAM_B_P1 serves first when firstServingTeam is TEAM_B', () => {
      const game = createGame({ ...baseConfig, mode: 'singles', firstServingTeam: 'TEAM_B' }) as SinglesGame
      expect(game.getServingPlayer()).toBe('TEAM_B_P1')
    })
  })
})
