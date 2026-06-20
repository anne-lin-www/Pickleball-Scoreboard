## 1. 建立 gameViewModel.ts（TDD）

- [x] 1.1 先撰寫 `src/core/gameViewModel.test.ts` 測試案例（TDD）：涵蓋 doubles 模式在 TEAM_A 與 TEAM_B 各自服務時 topTeam/bottomTeam score 與 servingTeamId 正確；singles 模式 servingTeamId 由 getServingPlayer() 正確反推 TeamId；winner name resolution 的 doubles（TeamId → teamName）與 singles（PlayerId → playerName）映射。驗收：測試先跑失敗（red phase 確認）。

- [x] 1.2 建立 `src/core/gameViewModel.ts`：GameViewModel 作為轉接層，統一 Doubles/Singles 不同 API。實作 `GameViewModel` 型別定義（含 `TeamView`）與 `deriveViewModel(game: DoublesGame | SinglesGame, config: SetupConfig): GameViewModel` 函式。doubles 用 `getTeamPositions()`，singles 用 `getPlayerSide()`；分數解析：從 `getScoreCall()` 字串解析分數（Doubles "X-Y-Z"，Singles "X-Y"），格式不符時拋出明確錯誤；勝者名稱對應：doubles `getWinner()` 回傳 TeamId 對應 teamAName/teamBName，singles 回傳 PlayerId 前綴判斷對應 teamAPlayer1/teamBPlayer1；符合 unified view model derivation Requirement 與 winner name resolution Requirement。驗收：`npm test` gameViewModel.test.ts 全部通過。

## 2. GameScreen 改用 GameViewModel

- [x] 2.1 更新 `src/screens/GameScreen.tsx` Props 介面：加入 `game: DoublesGame | SinglesGame`，保留 `config: SetupConfig` 和 `onReset`。採用「React state：每次 action 後重新 derive ViewModel」模式：以 `useState(() => deriveViewModel(game, config))` 初始化 `viewModel` state，每次 action 後呼叫 `setViewModel(deriveViewModel(game, config))`，讓 React 偵測到狀態變化而重新渲染。刪除 `mockDoublesState` 的 import 與使用，所有渲染資料改由 `viewModel` 提供。驗收：`npm run build` 無錯誤，GameScreen 不再 import `mockDoublesState`。

## 3. 接線互動行為

- [x] 3.1 在 GameScreen 實作共用的 `handleScore(teamId: TeamId)` 函式，封裝 winRally 的呼叫參數差異：doubles 傳 `teamId`；singles 傳 `${teamId}_P1`（winRally 的呼叫參數由 mode 決定，與 gameInit.ts PlayerId 命名慣例一致）。呼叫後：若 `game.getStatus() === 'FINISHED'` 呼叫 `onReset(viewModel.winnerName ?? '')`；否則 `setViewModel(deriveViewModel(game, config))`。符合 score button records rally in game engine Requirement、automatic game-over navigation on win condition Requirement。驗收：瀏覽器 doubles 模式下點 +1 分數正確更新；達到 11 分且差距 ≥ 2 自動進入 GameOver。

- [x] 3.2 將 +1 按鈕的 `onClick` 從 `console.log` 改為 `() => handleScore(topTeam.id)` 與 `() => handleScore(bottomTeam.id)`；court tap 的 `onTap` 同樣接上 `handleScore`；符合 tap-court scoring wires to game engine Requirement。驗收：两個按鈕與 court tap（需手動在 viewModel 啟用 tapCourtEnabled）均觸發正確得分。

- [x] 3.3 將 Undo 按鈕的 `onClick` 接上 `game.undo()`，之後呼叫 `setViewModel(deriveViewModel(game, config))`；符合 undo reverses last recorded rally Requirement。驗收：得分後點 Undo，分數回退至前一狀態；初始狀態點 Undo 無錯誤發生。

## 4. 清理

- [x] 4.1 確認 `src/mock/gameState.ts` 無其他 import，刪除該檔案。驗收：`npm run build` 無 import 殘留錯誤；`git diff --name-only` 顯示 mock/gameState.ts 已刪除。
