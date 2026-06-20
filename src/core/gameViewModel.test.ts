import { describe, it, expect } from 'vitest'
import { deriveViewModel } from './gameViewModel.js'
import { DoublesGame } from './doubles/DoublesGame.js'
import { SinglesGame } from './singles/SinglesGame.js'
import type { SetupConfig } from '../screens/SetupScreen.js'

const baseConfig: SetupConfig = {
  mode: 'doubles',
  topTeamId: 'TEAM_A',
  teamAName: 'Eagles',
  teamBName: 'Hawks',
  teamAPlayer1: 'Alice',
  teamAPlayer2: 'Bob',
  teamBPlayer1: 'Carol',
  teamBPlayer2: 'Dave',
  firstServingTeam: 'TEAM_A',
  gamesCount: 1,
}

describe('deriveViewModel — doubles', () => {
  it('topTeam corresponds to config.topTeamId', () => {
    const game = new DoublesGame('TEAM_A')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.topTeam.id).toBe('TEAM_A')
    expect(vm.bottomTeam.id).toBe('TEAM_B')
  })

  it('topTeam is TEAM_B when config.topTeamId is TEAM_B', () => {
    const game = new DoublesGame('TEAM_A')
    const vm = deriveViewModel(game, { ...baseConfig, topTeamId: 'TEAM_B' })
    expect(vm.topTeam.id).toBe('TEAM_B')
    expect(vm.bottomTeam.id).toBe('TEAM_A')
  })

  it('servingTeamId equals game.getServingTeam()', () => {
    const game = new DoublesGame('TEAM_B')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.servingTeamId).toBe('TEAM_B')
  })

  it('serverNumber equals game.getServerNumber()', () => {
    const game = new DoublesGame('TEAM_A')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.serverNumber).toBe(game.getServerNumber())
  })

  it('score parsing: TEAM_A scores 3, TEAM_B scores 0, TEAM_A serving', () => {
    // Doubles starts at 0-0-2 (first-server exception), so 3 TEAM_A wins → 3-0-2
    const game = new DoublesGame('TEAM_A')
    game.winRally('TEAM_A')
    game.winRally('TEAM_A')
    game.winRally('TEAM_A')
    expect(game.getScoreCall()).toBe('3-0-2')
    const vm = deriveViewModel(game, { ...baseConfig, topTeamId: 'TEAM_A' })
    expect(vm.topTeam.score).toBe(3)
    expect(vm.bottomTeam.score).toBe(0)
    expect(vm.serverNumber).toBe(2)
    expect(vm.servingTeamId).toBe('TEAM_A')
  })

  it('players have correct sides from getTeamPositions', () => {
    const game = new DoublesGame('TEAM_A')
    const positions = game.getTeamPositions('TEAM_A')
    const vm = deriveViewModel(game, baseConfig)
    const topPlayers = vm.topTeam.players
    for (const p of topPlayers) {
      expect(p.side).toBe(positions[p.id])
    }
  })

  it('team names come from config', () => {
    const game = new DoublesGame('TEAM_A')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.topTeam.name).toBe('Eagles')
    expect(vm.bottomTeam.name).toBe('Hawks')
  })

  it('winnerName is null when game is in progress', () => {
    const game = new DoublesGame('TEAM_A')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.winnerName).toBeNull()
  })

  it('winnerName resolves to teamAName when TEAM_A wins', () => {
    const game = new DoublesGame('TEAM_A')
    for (let i = 0; i < 11; i++) game.winRally('TEAM_A')
    expect(game.getStatus()).toBe('FINISHED')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.winnerName).toBe('Eagles')
  })

  it('winnerName resolves to teamBName when TEAM_B wins', () => {
    const game = new DoublesGame('TEAM_A')
    // Side out first to give TEAM_B chance to score
    game.winRally('TEAM_B')
    for (let i = 0; i < 11; i++) game.winRally('TEAM_B')
    expect(game.getStatus()).toBe('FINISHED')
    const vm = deriveViewModel(game, baseConfig)
    expect(vm.winnerName).toBe('Hawks')
  })
})

describe('deriveViewModel — singles', () => {
  const singlesConfig: SetupConfig = {
    ...baseConfig,
    mode: 'singles',
  }

  it('each team has exactly one player', () => {
    const game = new SinglesGame('TEAM_A_P1', 'TEAM_B_P1')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.topTeam.players).toHaveLength(1)
    expect(vm.bottomTeam.players).toHaveLength(1)
  })

  it('servingTeamId is TEAM_A when TEAM_A_P1 serves', () => {
    const game = new SinglesGame('TEAM_A_P1', 'TEAM_B_P1')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.servingTeamId).toBe('TEAM_A')
  })

  it('servingTeamId is TEAM_B when TEAM_B_P1 serves first', () => {
    const game = new SinglesGame('TEAM_B_P1', 'TEAM_A_P1')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.servingTeamId).toBe('TEAM_B')
  })

  it('serverNumber is always 1 for singles', () => {
    const game = new SinglesGame('TEAM_A_P1', 'TEAM_B_P1')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.serverNumber).toBe(1)
  })

  it('winnerName resolves to teamAPlayer1 when TEAM_A_P1 wins', () => {
    const game = new SinglesGame('TEAM_A_P1', 'TEAM_B_P1')
    for (let i = 0; i < 11; i++) game.winRally('TEAM_A_P1')
    expect(game.getStatus()).toBe('FINISHED')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.winnerName).toBe('Alice')
  })

  it('winnerName resolves to teamBPlayer1 when TEAM_B_P1 wins', () => {
    const game = new SinglesGame('TEAM_B_P1', 'TEAM_A_P1')
    for (let i = 0; i < 11; i++) game.winRally('TEAM_B_P1')
    expect(game.getStatus()).toBe('FINISHED')
    const vm = deriveViewModel(game, singlesConfig)
    expect(vm.winnerName).toBe('Carol')
  })
})
