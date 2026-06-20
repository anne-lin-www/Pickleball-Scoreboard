import { DoublesGame } from './doubles/DoublesGame.js'
import { SinglesGame } from './singles/SinglesGame.js'
import type { SetupConfig } from '../screens/SetupScreen.js'

export function createGame(config: SetupConfig): DoublesGame | SinglesGame {
  if (config.mode === 'doubles') {
    return new DoublesGame(config.firstServingTeam)
  }
  // Singles: first constructor arg is the initial server
  const [firstPlayerId, secondPlayerId] =
    config.firstServingTeam === 'TEAM_A'
      ? ['TEAM_A_P1', 'TEAM_B_P1']
      : ['TEAM_B_P1', 'TEAM_A_P1']
  return new SinglesGame(firstPlayerId, secondPlayerId)
}
