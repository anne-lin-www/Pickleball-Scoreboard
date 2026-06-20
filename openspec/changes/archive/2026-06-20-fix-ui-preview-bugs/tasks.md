## Tasks

### Bug 1: SetupScreen 局數按鈕樣式

- [x] T1: 修改 `src/screens/SetupScreen.tsx` 中局數按鈕的 active class 由 `btn-neutral` 改為 `btn-primary`，使兩個局數選項（1 game / Best of 3）的選中狀態與同頁其他選項按鈕視覺一致
  - 驗收：`btn-primary` 替換 `btn-neutral`（共 2 處），`npx tsc --noEmit` 零錯誤

### Bug 2: DoublesGame 發球球員追蹤

- [x] T2: 在 `src/core/doubles/DoublesGame.ts` 的 `DoublesTeamState` 介面新增 `currentServingPlayerId: PlayerId` 欄位，`makeTeam` 初始化為 `${id}_P1`，`cloneTeam` 複製此欄位（保障 undo 快照正確）
  - 驗收：TypeScript compile 零錯誤

- [x] T3: 在 `resetToFirstServer(team)` 中新增 `team.currentServingPlayerId = rightPlayer(team).id`，使每次 side-out 後正確記錄 server #1 的身分
  - 驗收：`getServingPlayerId()` 在 side-out 後回傳正確 PlayerId（TDD 測試覆蓋）

- [x] T4: 在 `winRally` 的 server #1 → #2 切換分支中新增 `serving.currentServingPlayerId = serving.players.find(p => p.id !== serving.currentServingPlayerId)!.id`，記錄 server #2 的身分
  - 驗收：`getServingPlayerId()` 在 server fault 後回傳夥伴 PlayerId（TDD 測試覆蓋）

- [x] T5: 在 `IDoublesScoreboard` 介面與 `DoublesGame` class 新增 `getServingPlayerId(): PlayerId` 方法：`isFirstServe === true` 時回傳 anchor 球員 ID，否則回傳 `currentServingPlayerId`
  - 驗收：7 個 TDD 測試（含 undo 還原）全部通過 `npx vitest run`

### Bug 2: GameViewModel 傳遞 servingPlayerId

- [x] T6: 在 `src/core/gameViewModel.ts` 的 `GameViewModel` 介面新增 `servingPlayerId: PlayerId` 欄位，並在 `deriveViewModel` 的 doubles 分支填入 `doubles.getServingPlayerId()`，singles 分支填入 `singles.getServingPlayer()`
  - 驗收：`npx vitest run` 全部通過（含現有 gameViewModel 測試）

### Bug 2: GameScreen 使用 servingPlayerId

- [x] T7: 修改 `src/screens/GameScreen.tsx` 的 `getIsServer` 函式，移除 `serverNumber` 參數與 suffix 對應邏輯，改為接收 `servingPlayerId: string` 並回傳 `player.id === servingPlayerId`
  - 驗收：0-0-2 開局時 ● 顯示在 P1（RIGHT 側），server #1 fault 後 ● 移至 P2

- [x] T8: 修改 `CourtHalf` component 的 props，以 `servingPlayerId: string` 取代 `serverNumber: 1 | 2`，並更新 `GameScreen` 中兩處 `CourtHalf` 呼叫
  - 驗收：`npx tsc --noEmit` 零錯誤，`npx vitest run` 110 個測試全部通過
