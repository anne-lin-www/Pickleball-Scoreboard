export interface Strings {
  gameMode: string
  doublesMode: string
  singlesMode: string
  teamName: string
  player1: string
  player2: string
  firstServe: string
  courtOrientation: string
  topTeam: string
  gamesCount: string
  oneGame: string
  bestOfThree: string
  startGame: string
  net: string
  serving: string
  scoreLabel: string
  undo: string
  reset: string
  winnerLabel: string
  rematch: string
}

export type Locale = 'zh-TW' | 'en'

export const STRINGS: Record<Locale, Strings> = {
  'zh-TW': {
    gameMode: '遊戲模式',
    doublesMode: '雙打',
    singlesMode: '單打',
    teamName: '隊伍名稱',
    player1: '球員 1',
    player2: '球員 2',
    firstServe: '首先發球',
    courtOrientation: '球場方向（上半場）',
    topTeam: '在上',
    gamesCount: '局數',
    oneGame: '1 局',
    bestOfThree: '三局兩勝',
    startGame: '開始比賽',
    net: '球網',
    serving: '發球中',
    scoreLabel: '發球方 – 接球方 – 發球序號',
    undo: '↩ 復原',
    reset: '重設',
    winnerLabel: '勝利隊伍',
    rematch: '再來一局',
  },
  'en': {
    gameMode: 'Game Mode',
    doublesMode: 'Doubles',
    singlesMode: 'Singles',
    teamName: 'Team Name',
    player1: 'Player 1',
    player2: 'Player 2',
    firstServe: 'First Serve',
    courtOrientation: 'Court Orientation (Top Half)',
    topTeam: 'on Top',
    gamesCount: 'Games',
    oneGame: '1 Game',
    bestOfThree: 'Best of 3',
    startGame: 'Start Match',
    net: 'Net',
    serving: 'Serving',
    scoreLabel: 'Serving – Receiving – Server #',
    undo: '↩ Undo',
    reset: 'Reset',
    winnerLabel: 'Winner',
    rematch: 'Rematch',
  },
}
