export interface Strings {
  gameMode: string
  doublesMode: string
  singlesMode: string
  setupInputMode: string
  formMode: string
  diagramMode: string
  teamName: string
  player1: string
  player2: string
  player1Label: string
  player2Label: string
  playerNamePlaceholder: string
  initialServer: string
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
  midGamePrompt: string
  midGameCta: string
  servingScore: string
  receivingScore: string
  serverNumber: string
  resumeScoring: string
  backToSetup: string
}

export type Locale = 'zh-TW' | 'en'

export const STRINGS: Record<Locale, Strings> = {
  'zh-TW': {
    gameMode: '遊戲模式',
    doublesMode: '雙打',
    singlesMode: '單打',
    setupInputMode: '輸入方式',
    formMode: '表單',
    diagramMode: '球場圖',
    teamName: '隊伍名稱',
    player1: '球員 1',
    player2: '球員 2',
    player1Label: '球員一（1位）',
    player2Label: '球員二（2位）',
    playerNamePlaceholder: '球員名字',
    initialServer: '開局發球者：{team} 球員二（Player 2）',
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
    midGamePrompt: '比賽已開始？',
    midGameCta: '中途接續現況計分',
    servingScore: '發球方得分',
    receivingScore: '接球方得分',
    serverNumber: '發球序號',
    resumeScoring: '開始接續計分',
    backToSetup: '← 返回設定',
  },
  'en': {
    gameMode: 'Game Mode',
    doublesMode: 'Doubles',
    singlesMode: 'Singles',
    setupInputMode: 'Input Mode',
    formMode: 'Form',
    diagramMode: 'Court',
    teamName: 'Team Name',
    player1: 'Player 1',
    player2: 'Player 2',
    player1Label: 'Player 1',
    player2Label: 'Player 2',
    playerNamePlaceholder: 'Player name',
    initialServer: 'Opening server: {team} Player 2',
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
    midGamePrompt: 'Game already started?',
    midGameCta: 'Resume Mid-Game',
    servingScore: 'Serving Score',
    receivingScore: 'Receiving Score',
    serverNumber: 'Server #',
    resumeScoring: 'Resume Scoring',
    backToSetup: '← Back to Setup',
  },
}
