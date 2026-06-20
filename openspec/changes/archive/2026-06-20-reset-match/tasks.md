## 1. 介面擴充

- [x] 1.1 `ISinglesScoreboard`（`src/core/singles/SinglesGame.ts`）新增 `reset(): void` 方法簽名，實現 Requirement: Reset game to initial state（singles）；`ISinglesScoreboard` 的 TypeScript 編譯不報錯。
- [x] 1.2 `IDoublesScoreboard`（`src/core/doubles/DoublesGame.ts`）新增 `reset(): void` 方法簽名，實現 Requirement: Reset game to initial state（doubles）；`IDoublesScoreboard` 的 TypeScript 編譯不報錯。

## 2. SinglesGame — TDD Red

- [x] 2.1 在 `src/core/singles/SinglesGame.test.ts` 新增 `describe('SinglesGame — reset match (S7)')` 測試群組，涵蓋下列案例（此時測試紅燈，因為 `reset()` 尚未實作）：
  - `reset()` 後 `getScoreCall()` 回到 `"0-0"`
  - `reset()` 後 `getServingPlayer()` 回到建構子第一個參數
  - `reset()` 後 `getPlayerSide(A)` 和 `getPlayerSide(B)` 均為 `RIGHT`
  - `reset()` 後 `getStatus()` 為 `IN_PROGRESS`，`getWinner()` 為 `null`
  - `reset()` 後 `undo()` 為 no-op（`getScoreCall()` 維持 `"0-0"`）— 對應 Decision: reset() 清空 history
  - 已 FINISHED 的比賽呼叫 `reset()` 後 `getStatus()` 回到 `IN_PROGRESS`
  - 發球方已轉移至 B，`reset()` 後 `getServingPlayer()` 回到 A
  - 連續多次呼叫 `reset()` 均冪等（`getScoreCall()` 維持 `"0-0"`）

## 3. SinglesGame — Green

- [x] 3.1 Decision: 新增 readonly 欄位儲存初始發球方 — `SinglesGame` 新增 `private readonly initialServingPlayerId: PlayerId` 欄位，在建構子中賦值為 `playerAId`；`reset()` 讀取此值還原 `servingPlayerId`。
- [x] 3.2 實作 `SinglesGame.reset()`（Decision: reset() 清空 history）：將 `playerA.score`、`playerB.score` 設為 `0`；`playerA.currentSide`、`playerB.currentSide` 設為 `RIGHT`；`servingPlayerId` 設為 `initialServingPlayerId`；`status` 設為 `IN_PROGRESS`；`winner` 設為 `null`；`history` 清空。執行 `npm test` 後 S7 所有測試綠燈。

## 4. DoublesGame — TDD Red

- [x] 4.1 在 `src/core/doubles/DoublesGame.test.ts` 新增 `describe('DoublesGame — reset match (D6)')` 測試群組，涵蓋下列案例（此時測試紅燈）：
  - `reset()` 後 `getScoreCall()` 回到 `"0-0-2"`
  - `reset()` 後 `getServingTeam()` 回到建構子傳入的初始發球隊
  - `reset()` 後 `getServerNumber()` 為 `2`
  - `reset()` 後 `getStatus()` 為 `IN_PROGRESS`，`getWinner()` 為 `null`
  - `reset()` 後 `undo()` 為 no-op（`getScoreCall()` 維持 `"0-0-2"`）— 對應 Decision: reset() 清空 history
  - 已 FINISHED 的比賽呼叫 `reset()` 後 `getStatus()` 回到 `IN_PROGRESS`
  - 建構子傳入 TEAM_B，`reset()` 後 `getServingTeam()` 回到 `TEAM_B`
  - `reset()` 後 anchor player（`TEAM_A_P1`）在 `RIGHT`（Decision: DoublesGame 位置重置方式）
  - `reset()` 後觸發 first-serve exception（fault 立即 Side Out）
  - 連續多次呼叫 `reset()` 均冪等

## 5. DoublesGame — Green

- [x] 5.1 Decision: 新增 readonly 欄位儲存初始發球方 — `DoublesGame` 新增 `private readonly initialServingTeamId: TeamId` 欄位，在建構子中賦值為 `firstServingTeam`；`reset()` 讀取此值還原 `servingTeamId`。
- [x] 5.2 實作 `DoublesGame.reset()`（Decision: reset() 清空 history；Decision: DoublesGame 位置重置方式）：用 `makeTeam('TEAM_A')` 和 `makeTeam('TEAM_B')` 重建兩個 team 物件；`servingTeamId` 設為 `initialServingTeamId`；`isFirstServe` 設為 `true`；`status` 設為 `IN_PROGRESS`；`winner` 設為 `null`；`history` 清空。執行 `npm test` 後 D6 所有測試綠燈，且既有 63 個測試不退步。
