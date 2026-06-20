## Context

`DoublesGame.makeTeam()` 目前將 P1 設定為 `isStartingRight: true`（右側），P2 為左側。然而匹克球慣例是：開局 0-0-2 時右側站位為 **2位（順位2）**，左側為 **1位（順位1）**。現有慣例使得 Setup 頁面輸入的「球員一」出現在右側（2位站位），與球員直覺相反。本 change 以 TDD 方式修正核心慣例，並同步更新 Setup UI。

## Goals / Non-Goals

**Goals:**
- 修正 `makeTeam()` 使 P1 = 左側（順位1），P2 = 右側（順位2，開局發球）
- 以 TDD 流程：先更新 failing tests，再修正 `makeTeam()` 使 tests pass
- Setup 頁面球員 input 加上清楚的 Player 1/Player 2 label
- Setup 頁面動態顯示「開局發球者」提示，依所選先攻隊更新

**Non-Goals:**
- 不修改 P1/P2 PlayerId 命名（`TEAM_A_P1` 格式不變）
- 不修改 Singles 邏輯
- 不開放 UI 讓使用者自選站位
- 不修改任何 public API 簽名

## Decisions

**D1 — P1/P2 慣例翻轉（核心）**

`makeTeam()` 修改如下：
```
Before: P1 → isStartingRight: true,  P2 → isStartingRight: false
After:  P1 → isStartingRight: false, P2 → isStartingRight: true
```
`currentServingPlayerId` 初始值從 `TEAM_A_P1` 改為 `TEAM_A_P2`。

`getServingPlayerId()` 的 `isFirstServe` 路徑已使用 `players.find(p => p.isStartingRight)` 查找，不需改動 — 自動對應到 P2（新的右側 2位）。

**D2 — TDD 流程**

先修改 `DoublesGame.test.ts` 使其斷言新慣例（P1=左/P2=右），此時 tests 應 fail。再修正 `makeTeam()`，使 tests pass。

**D3 — Setup UI：球員 label**

雙打模式下，每隊球員輸入欄位上方加入 label：
- 繁中：「球員一（1位）」 / 「球員二（2位）」
- 英文：「Player 1」 / 「Player 2」

**D4 — Setup UI：開局發球者提示**

`firstServingTeam` 選擇區塊下方加入 small info 行：
- 顯示邏輯：`開局發球者：{firstServingTeam 的隊名} 球員二（Player 2）`
- `firstServingTeam` state 改變時即時更新（React state 已有，直接讀取 `teamAName`/`teamBName` + `firstServingTeam`）
- i18n key：`initialServer`，值：`開局發球者：{team} 球員二（Player 2）`（使用佔位符 `{team}`）

## Implementation Contract

**行為（可觀測）：**
- Game screen 中，TEAM A 在 0-0-2 開局時，Setup 輸入的「球員二（Player 2）」出現在右側且帶有發球標記（●）
- Setup 頁面選擇先發球隊後，提示文字即時顯示「開局發球者：[隊名] 球員二（Player 2）」

**函數/資料形狀：**
- `makeTeam(id)` 回傳的 `players[0]`（P1）：`isStartingRight: false`
- `makeTeam(id)` 回傳的 `players[1]`（P2）：`isStartingRight: true`
- `makeTeam(id)` 回傳的 `currentServingPlayerId`：`{id}_P2`
- `SetupConfig` 介面不變（`teamAPlayer1`/`teamAPlayer2` 語意不變，只是慣例更正）

**驗收條件：**
- `DoublesGame.test.ts` 全部 pass（修正後的 tests）
- `npm run test` 無 regression
- 手動驗證：Setup 頁面選 TEAM A 先發，提示文字顯示 TEAM A 球員二；改選 TEAM B，提示立即切換為 TEAM B 球員二

## Risks / Trade-offs

- **Breaking change in convention**：所有已在 `DoublesGame.test.ts` 中斷言 P1=右側 的 tests 需同步更新。若有其他測試（`gameInit.test.ts`, `gameViewModel.test.ts`）間接依賴此慣例，也需檢查。
- **Persistence backwards compatibility**：`SerializedDoublesGame` 中的 `players` 資料若有已序列化的 `isStartingRight: true` 對應 P1，restore 後站位會翻轉。由於 `useGamePersistence` 用 localStorage 儲存，開發中的持久化資料需清除（`localStorage.clear()`）。此為已知可接受的 trade-off（無 migration 計畫）。
