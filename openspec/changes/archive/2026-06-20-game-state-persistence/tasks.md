## 1. Game class 序列化介面（TDD）：為 Game class 新增公開序列化介面

- [x] 1.1 為 `SinglesGame` 撰寫序列化往返測試（`src/core/singles/SinglesGame.test.ts`）：驗證「Game classes expose serialization interface」— `serialize()` 輸出含 `type: 'singles'`，以及 `SinglesGame.fromSerialized(data)` 重建後所有 getter（`getStatus`、`getWinner`、`getScoreCall`、`getServingPlayer`、`getPlayerSide`）返回值與原實例相同。測試應涵蓋初始狀態、多 rally 後、undo 後三種情境。驗證：`pnpm test` 中 SinglesGame 序列化相關測試通過。

- [x] 1.2 在 `src/core/singles/SinglesGame.ts` 實作 `serialize(): SerializedSinglesGame` 與 `static fromSerialized(data: SerializedSinglesGame): SinglesGame`。序列化型別（`SerializedSinglesGame`）包含 `type: 'singles'`、`initialServingPlayerId`、`playerA`、`playerB`、`servingPlayerId`、`status`、`winner`、`history`。`fromSerialized` 需將 private 欄位直接賦值，恢復完整狀態含 undo 歷史。驗證：任務 1.1 的測試全數通過。

- [x] 1.3 為 `DoublesGame` 撰寫序列化往返測試（`src/core/doubles/DoublesGame.test.ts`）：驗證「Game classes expose serialization interface」— `serialize()` 輸出含 `type: 'doubles'`，以及 `DoublesGame.fromSerialized(data)` 重建後所有 getter（`getStatus`、`getWinner`、`getScoreCall`、`getServingTeam`、`getServerNumber`、`getServingPlayerId`、`getTeamPositions`）返回值與原實例相同。測試應涵蓋初始狀態、多 rally 後、isFirstServe 為 false 後三種情境。驗證：`pnpm test` 中 DoublesGame 序列化相關測試通過。

- [x] 1.4 在 `src/core/doubles/DoublesGame.ts` 實作 `serialize(): SerializedDoublesGame` 與 `static fromSerialized(data: SerializedDoublesGame): DoublesGame`。序列化型別（`SerializedDoublesGame`）包含 `type: 'doubles'`、`initialServingTeamId`、`teamA`、`teamB`、`servingTeamId`、`isFirstServe`、`status`、`winner`、`history`。驗證：任務 1.3 的測試全數通過。

## 2. 使用自訂 Hook 封裝 localStorage 邏輯：Persistence hook isolates localStorage access

- [x] 2.1 撰寫 `src/hooks/useGamePersistence.test.ts` 測試「Persistence hook isolates localStorage access」，涵蓋：(a) `loadPersistedState()` 在 localStorage 無資料時回傳 `null`；(b) 有有效 JSON 時回傳解析後物件；(c) 有損壞 JSON 時回傳 `null` 且自動清除 key；(d) `saveGameState()` 在 localStorage 不可用時靜默失敗不拋出例外；(e) `clearGameState()` 呼叫後 `loadPersistedState()` 回傳 `null`。驗證：`pnpm test` 中 useGamePersistence 相關測試通過。

- [x] 2.2 實作 `src/hooks/useGamePersistence.ts`（使用 localStorage 而非 sessionStorage，原因：sessionStorage 關閉分頁即清除不符需求），對外暴露 `useGamePersistence()` hook，返回 `{ loadPersistedState, saveGameState, clearGameState }`。`saveGameState(config, game)` 呼叫 `game.serialize()` 並以 `JSON.stringify` 寫入 `localStorage['pickleball_game']`，整個流程以 try/catch 包覆靜默失敗。`loadPersistedState()` 讀取並 parse，損壞時清除 key 並回傳 `null`。localStorage key 固定為常數 `'pickleball_game'`。驗證：任務 2.1 的測試全數通過。

## 3. ResumeDialog 互動設計：ResumeDialog provides resume or new game choice

- [x] 3.1 建立 `src/components/ResumeDialog.tsx`，實作「ResumeDialog provides resume or new game choice」。Props：`config: SetupConfig`、`onResume: () => void`、`onNewGame: () => void`。渲染一個 Modal overlay，標題顯示 `{config.teamAName} vs {config.teamBName}`，並包含：主要按鈕「繼續比賽」— `autoFocus`、primary 樣式；次要按鈕「開新局」— secondary/outline 樣式。兩個按鈕分別呼叫 `onResume` 和 `onNewGame`。驗證：手動在 App 中觸發 Dialog，確認「繼續比賽」按鈕有焦點、Enter 鍵可觸發、兩按鈕樣式明顯區別。

## 4. App.tsx 整合：Rehydrate：App mount 時同步讀取，直接決定初始 screen

- [x] 4.1 修改 `src/App.tsx` 新增 `pendingResume: PersistedGameState | null` state，實作「App rehydrates game state on mount」與「App stores game instance after setup」既有行為（setup 表單提交後建立 game 實例並切換至 game screen 的路由邏輯不受影響）：App 初始化時（`useState` lazy initializer）呼叫 `loadPersistedState()`，若有有效資料則設為 `pendingResume`，否則維持 `null`。在 render 中，當 `pendingResume !== null` 時於現有畫面上疊加 `ResumeDialog`（傳入 `pendingResume.config`）。若無資料則 screen 初始為 `'setup'`，行為與現有邏輯相同。驗證：手動得分後按 F5，應看到 ResumeDialog 出現在 Setup Screen 上方，「繼續比賽」有焦點。

- [x] 4.2 在 `src/App.tsx` 實作「App routes to Game Screen when persisted state exists」的兩個處理函式：`handleResume()` — 呼叫 `SinglesGame.fromSerialized()` 或 `DoublesGame.fromSerialized()`（依 `pendingResume.game.type` 判斷）重建 game 實例，設定 `config`、`game`、`screen('game')`，並呼叫 `setPendingResume(null)`。`handleNewGame()` — 呼叫 `clearGameState()`，呼叫 `setPendingResume(null)`（回到 Setup Screen）。將兩函式分別傳入 `ResumeDialog` 的 `onResume` 與 `onNewGame`。驗證：ResumeDialog 按「繼續比賽」後進入 Game Screen 且比分正確；按「開新局」後關閉 Dialog、顯示 Setup Screen、`localStorage.getItem('pickleball_game')` 為 `null`。

- [x] 4.3 在 `src/App.tsx` 新增 `useEffect` 實作「Game state persists across page reload」：序列化時機：useEffect 監聽 game 物件參考變更 — 當 `screen === 'game'` 且 `game !== null` 時，呼叫 `saveGameState(config!, game)` 寫入 localStorage。當 `screen !== 'game'` 時不執行寫入。驗證：開啟 DevTools Application → localStorage，確認每次得分後 `pickleball_game` key 內容更新，分數與當前一致。

- [x] 4.4 在 `src/App.tsx` 的 `handleRematch()` 與返回 Setup 的處理中，加入 `clearGameState()` 呼叫，實作「Game state is cleared on explicit exit」：於路由切換前清除 `localStorage['pickleball_game']`。驗證：Game Over 後選擇 rematch，`localStorage.getItem('pickleball_game')` 應為 `null`；重整頁面應顯示 Setup Screen 且不出現 ResumeDialog。

## 5. 最終驗證

- [x] 5.1 執行完整測試套件 `pnpm test`，確認所有既有測試（gameInit、gameViewModel、SinglesGame、DoublesGame）及新增的 useGamePersistence 測試全數通過，無迴歸。

- [x] 5.2 執行手動端對端驗證：(a) 開始比賽 → 得分幾分 → 按 F5 → 確認出現 ResumeDialog，「繼續比賽」有焦點，Enter 後回到相同比分；(b) 同情境按「開新局」→ 確認顯示 Setup Screen、localStorage 清除；(c) Game Over → rematch → F5 → 確認顯示 Setup Screen 且無 ResumeDialog。

## 6. Session 偵測與時間戳記（TDD）

- [x] 6.1 在 `src/hooks/useGamePersistence.test.ts` 新增 describe block「useGamePersistence — session detection」，測試：(a) `markSessionActive()` 呼叫後 `sessionStorage.setItem('pickleball_session', '1')` 被呼叫；(b) `isSessionActive()` 在 sessionStorage 有 `'pickleball_session'` 時回傳 `true`，無時回傳 `false`；(c) `saveGameState()` 寫入的 JSON 含 `savedAt` 欄位（值為數字）；(d) `clearGameState()` 呼叫後 `sessionStorage.removeItem('pickleball_session')` 被呼叫。使用 `vi.stubGlobal('sessionStorage', makeMockStorage())` 隔離 sessionStorage。驗證：`pnpm test` 中新增測試通過。

- [x] 6.2 修改 `src/hooks/useGamePersistence.ts`：(1) 在 `PersistedGameState` interface 新增 `savedAt: number` 欄位；(2) `saveGameState()` 寫入 JSON 時加入 `savedAt: Date.now()`；(3) 新增 `markSessionActive()` — 呼叫 `sessionStorage.setItem('pickleball_session', '1')`，以 try/catch 靜默失敗；(4) 新增 `isSessionActive()` — 回傳 `sessionStorage.getItem('pickleball_session') !== null`，以 try/catch 靜默失敗（預設 `false`）；(5) `clearGameState()` 中加入 `sessionStorage.removeItem('pickleball_session')`（try/catch 靜默失敗）；(6) hook 返回值擴充為 `{ loadPersistedState, saveGameState, clearGameState, markSessionActive, isSessionActive }`。驗證：任務 6.1 的測試全數通過。

## 7. ResumeDialog 支援 defaultAction prop（TDD）

- [x] 7.1 修改 `src/components/ResumeDialog.tsx`，在 Props interface 新增 `defaultAction: 'resume' | 'new-game'`。當 `defaultAction === 'resume'` 時「繼續比賽」有 `autoFocus`；當 `defaultAction === 'new-game'` 時「開新局」有 `autoFocus`。兩個按鈕視覺樣式不變（「繼續比賽」永遠 primary，「開新局」永遠 outline）。驗證：手動測試：(a) `defaultAction='new-game'` 時「開新局」有焦點，Enter 觸發開新局；(b) `defaultAction='resume'` 時「繼續比賽」有焦點，行為與之前相同。

## 8. App.tsx session 偵測與時間戳記驅動路由

- [x] 8.1 修改 `src/App.tsx` 的初始化邏輯，提取 `rehydrateGame(persisted: PersistedGameState)` 輔助函式（在 App 函式內），回傳 `DoublesGame | SinglesGame`，內部依 `persisted.game.type` 呼叫對應的 `fromSerialized()`。修改 `useState` lazy initializers：若 `loadPersistedState()` 有資料 **且** `isSessionActive()` 為 `true`（F5 情境），則 screen 初始值設為 `'game'`、game 初始值設為 `rehydrateGame(persisted)`、config 初始值設為 `persisted.config`；此時 `pendingResume` 初始值為 `null`。若無 sessionStorage flag 則 `pendingResume` 設為 persisted 資料（原有邏輯），screen 初始為 `'setup'`。驗證：手動在 Game Screen 按 F5，確認直接回到 Game Screen，不出現 Dialog，比分正確。

- [x] 8.2 在 `src/App.tsx` 中：(1) 進入 Game Screen 的兩個路徑（`handleStart` 與 `handleResume`）均加入 `markSessionActive()` 呼叫；(2) 傳遞 `defaultAction` prop 給 `ResumeDialog`：計算 `elapsed = Date.now() - (pendingResume?.savedAt ?? 0)`，若 `elapsed < 30 * 60 * 1000` 則 `defaultAction='resume'`，否則 `defaultAction='new-game'`。驗證：(a) 關閉分頁後立即重開 → Dialog「繼續比賽」有焦點；(b) 修改 localStorage 內 savedAt 為 2 小時前的值後重整 → Dialog「開新局」有焦點。

## 9. 最終驗證（完整版）

- [x] 9.1 執行完整測試套件 `pnpm test`，確認所有既有測試及新增的 session 偵測相關測試全數通過，無迴歸。

- [x] 9.2 手動端對端驗證：(a) Game Screen 中按 F5 → 直接回到 Game Screen，不出現 Dialog，比分正確；(b) 關閉分頁重開（sessionStorage 消失、savedAt 在 30 分鐘內）→ 出現 Dialog，「繼續比賽」有焦點；(c) 修改 localStorage 中 savedAt 為 2 小時前 → 出現 Dialog，「開新局」有焦點，Enter 清除資料進入 Setup Screen；(d) Game Over 後 rematch → 重整不出現 Dialog。
