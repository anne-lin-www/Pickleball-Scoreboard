## 1. 基礎設定

- [x] 1.1 在 src/core/types.ts 定義共用型別（`CourtSide`、`GameStatus`、`TeamId`、`PlayerId`），並依照設計「雙打與單打使用分開的 Interface」分別建立 `IDoublesScoreboard`（src/core/doubles/DoublesGame.ts）與 `ISinglesScoreboard`（src/core/singles/SinglesGame.ts）的 interface 骨架（方法簽章齊全但不實作）。驗證：`npm test` 可在 src/core/ 下找到測試檔並執行（零測試也算通過）。

## 2. 雙打計分引擎（TDD）

- [x] 2.1 [Red→Green] 為 `doubles-scoring` 的「initial game state」需求撰寫測試（src/core/doubles/DoublesGame.test.ts）：斷言新建遊戲的 `getScoreCall()` 返回 `"0-0-2"`、`getServerNumber()` 返回 `2`、`getStatus()` 返回 `IN_PROGRESS`。實作「Player-Centric 設計（雙打）」中的 `Player`（含 `isStartingRight`）與 `DoublesTeam`，使測試通過。驗證：D1.1 對應測試為綠燈。

- [x] 2.2 [Red→Green] 為「first-server exception on initial Side Out」撰寫測試：`"0-0-2"` 狀態下 `winRally(TEAM_B)` 後 `getScoreCall()` 返回 `"0-0-1"`，`getServingTeam()` 返回 `TEAM_B`。實作「開局特例（雙打）以 `isFirstServe` 旗標控制」邏輯：`isFirstServe=true` 時失誤直接 Side Out 並將 `isFirstServe` 設為 `false`。驗證：D1.2 對應測試為綠燈。

- [x] 2.3 [Red→Green] 為「rally scoring — only serving team scores」與「position switching on score」撰寫測試：發球方得分後 score 加一且雙方球員換位/不換位符合規格（D2.1、D2.2）。實作 `winRally()` 中的得分計算與 `switchSide()` 邏輯，接球方贏得回合僅推進 `serverNumber` 不換位。驗證：D2.1、D2.2 對應測試為綠燈。

- [x] 2.4 [Red→Green] 為「server sequence — server 1 to server 2」與「server sequence — server 2 fault triggers Side Out」撰寫測試（D3.1：`"1-0-1"` 失誤 → `"1-0-2"`；D3.2：`"1-0-2"` 失誤 → `"0-1-1"`）。實作 `advanceServer()` 與 Side Out 邏輯：`serverNumber` 由 1 推進為 2，再次失誤則執行 Side Out 並呼叫 `resetServerToFirst()`（對手右側球員成為第 1 發球員）。驗證：D3.1、D3.2 對應測試為綠燈。

- [x] 2.5 [Red→Green] 為「win condition — 11 points with 2-point lead」撰寫測試：`"10-8-1"` 得分後 `getStatus()` 返回 `FINISHED`；`"10-10-1"` 得分後仍為 `IN_PROGRESS`；`"11-10-1"` 得分後 `FINISHED`（D4.1–D4.3）。實作每次 `winRally()` 後的勝利判斷：`score >= 11 && score - opponentScore >= 2`。驗證：D4.1、D4.2、D4.3 對應測試為綠燈。

- [x] 2.6 [Red→Green] 為「position assertion using anchor player parity」撰寫測試：錨點球員在正確側時 `runPositionAssertion()` 不拋錯（D5.1）；錯誤側時拋出 `Error`（D5.2）。實作 `validatePositions()`：取出 `isStartingRight` 的球員，與 `team.score % 2 === 0 ? RIGHT : LEFT` 比對，不符則 throw。驗證：D5.1 不拋錯、D5.2 拋出 Error。

- [x] 2.7 [Red→Green] 為「undo restores previous state」撰寫測試：得分後 `undo()` 使 `getScoreCall()` 及 `getTeamPositions()` 完全還原；空 history 時 `undo()` 為 no-op。實作「Undo 使用 Snapshot History Stack」：`winRally()` 前以 `structuredClone()` 儲存完整 state 快照至 history array，`undo()` pop 並還原。驗證：undo 測試為綠燈，`npm test` 全部雙打測試通過。

## 3. 單打計分引擎（TDD）

- [x] 3.1 [Red→Green] 為 `singles-scoring` 的「initial game state」、「serve side determined by server's score parity」、「no first-server exception」撰寫測試（S1.1、S1.2、S2.1–S2.3）：新遊戲 `getScoreCall()` 返回 `"0-0"`，伺服器在 RIGHT；失誤直接換發球；分數 0/2/4 → RIGHT，1/3/9 → LEFT。實作「純函數站位（單打）」：`currentSide` 由 `score % 2 === 0 ? RIGHT : LEFT` 決定，不需 `isStartingRight`。驗證：S1.1、S1.2、S2.1–S2.3 對應測試為綠燈。

- [x] 3.2 [Red→Green] 為「rally scoring — only serving player scores」與「serve transfer on rally loss」撰寫測試（S3.1–S3.3）：發球方得分後 `currentSide` 隨分數更新；換發球後新發球方的 side 由其自身分數決定；`getScoreCall()` 翻轉（S3.3：A 發 `"3-7"` → B 接手後 `"7-3"`）。實作 `winRally()` 的換發球邏輯：失誤時將 `servingPlayerId` 切換為對手，並依對手分數奇偶設定其 `currentSide`。驗證：S3.1、S3.2、S3.3 對應測試為綠燈。

- [x] 3.3 [Red→Green] 為「win condition — 11 points with 2-point lead」撰寫測試（S4.1–S4.5）：`"10-8"` 得分後 `FINISHED`；`"10-10"` 得分後 `IN_PROGRESS`；`"11-10"` 得分後 `FINISHED`；Deuce 中換發球後對手再得分獲勝；`"15-14"` 得分後 `FINISHED`。實作單打勝利判斷。驗證：S4.1–S4.5 對應測試為綠燈。

- [x] 3.4 [Red→Green] 為「position assertion using score parity」撰寫測試（S5.1、S5.2）：serving player 分數 4（偶）且在 RIGHT → 不拋錯；分數 3（奇）但在 RIGHT → 拋出 Error。實作 `runPositionAssertion()`：比對 `currentSide` 與 `score % 2 === 0 ? RIGHT : LEFT`，不符則 throw。驗證：S5.1 不拋錯、S5.2 拋出 Error。

- [x] 3.5 [Red→Green] 為「undo restores previous state」撰寫測試（S6.1、S6.2）：得分後 undo 還原 score 與 side（S6.1）；換發球後 undo 還原 servingPlayer 與 scoreCall（S6.2）；空 history 時 undo 為 no-op。實作 snapshot history stack（與雙打相同機制）。驗證：S6.1、S6.2 對應測試為綠燈，`npm test` 全部單打與雙打測試通過。
