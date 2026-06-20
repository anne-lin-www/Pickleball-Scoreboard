## 1. TDD — 核心演算法慣例修正

- [x] 1.1 在 `src/core/doubles/DoublesGame.test.ts` 更新「初始狀態」相關測試，斷言 `TEAM_A_P1` 的 `currentSide` 為 `LEFT`、`TEAM_A_P2` 的 `currentSide` 為 `RIGHT`，且 `getServingPlayerId()` 在 0-0-2 時回傳 `"TEAM_A_P2"`；此時 tests 應 fail（紅燈）。驗收：`npm run test -- DoublesGame` 顯示 assertion 失敗。

- [x] 1.2 修改 `src/core/doubles/DoublesGame.ts` 的 `makeTeam()` 函數：將 `players[0]`（P1）改為 `makePlayer(..., false)`（左側），`players[1]`（P2）改為 `makePlayer(..., true)`（右側），`currentServingPlayerId` 改為 `${id}_P2`。驗收：`npm run test -- DoublesGame` 全部 pass（綠燈）。

- [x] 1.3 檢查並修正 `src/core/gameInit.test.ts` 和 `src/core/gameViewModel.test.ts` 中任何依賴 P1=右側 或 `getServingPlayerId()` 回傳 P1 的斷言，使其符合新慣例（P2=右側=初始發球）。驗收：`npm run test` 全部 pass，無 regression。

## 2. i18n 字串新增

- [x] 2.1 在 `src/i18n/strings.ts` 中為繁中和英文各新增以下 key：`player1Label`（「球員一（1位）」/ `"Player 1"`）、`player2Label`（「球員二（2位）」/ `"Player 2"`）、`initialServer`（「開局發球者：{team} 球員二（Player 2）」/ `"Opening server: {team} Player 2"`，`{team}` 為佔位符）。驗收：TypeScript 編譯無 error，手動確認 `t('player1Label')` 在繁中模式回傳「球員一（1位）」。

## 3. Setup 頁面 UI 更新

- [x] 3.1 在 `src/screens/SetupScreen.tsx` 雙打模式的球員輸入欄位上方加入 label，使用 `t('player1Label')` / `t('player2Label')`，樣式與現有 `label-text` class 一致。驗收：切換至雙打模式時，每隊球員輸入框上方可見「球員一（1位）」和「球員二（2位）」標籤；切換至單打模式時，標籤隨球員二欄位一同隱藏。

- [x] 3.2 在 `src/screens/SetupScreen.tsx` 的先攻隊選擇區塊下方，雙打模式時顯示 small info 行，內容為 `t('initialServer', { team: firstServingTeamName })`，其中 `firstServingTeamName` 依 `firstServingTeam` state 即時解析為 `teamAName` 或 `teamBName`。驗收：選擇 TEAM A 先攻時提示顯示 TEAM A 名稱；切換為 TEAM B 後提示立即更新；單打模式時提示不顯示。
