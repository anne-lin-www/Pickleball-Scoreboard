## Context

開發預覽（dev preview）發現兩個視覺 bug：
1. SetupScreen 的「局數」選項使用 `btn-neutral`，在 DaisyUI 主題中呈現為灰色，視覺上與 inactive 狀態幾乎無差異，讓使用者誤以為按鈕失效
2. GameScreen 在 0-0-2 開局時，`getIsServer()` 採用 `serverNumber === 1 → P1，serverNumber === 2 → P2` 的靜態 suffix 對應，無法處理第一發球例外（first-server exception）：此時 serverNumber=2 但實際發球者是 anchor 球員（TEAM_A_P1，站在 RIGHT），導致 ● 顯示在 P2（LEFT）上

根本原因在於 `DoublesGame` 未對外暴露「目前發球球員 ID」，ViewModel 層只能傳遞 `serverNumber`，UI 層無法正確反推發球者身分。

## Goals / Non-Goals

**Goals:**

- Bug 1：SetupScreen 局數按鈕 active 狀態視覺一致（`btn-primary`）
- Bug 2：GameScreen 發球指示符在全生命週期（含第一發球例外、server #1/#2 切換、換邊發球後）都指向正確球員

**Non-Goals:**

- 不修改 Singles 發球標示（已正確）
- 不更動計分邏輯、RWD 佈局、或其他 UI 行為

## Decisions

### 在 DoublesTeamState 追蹤 currentServingPlayerId

**決策**：在 `DoublesTeamState` 新增 `currentServingPlayerId: PlayerId` 欄位，並在兩個時間點更新：
- `resetToFirstServer(team)`：設為當時 RIGHT 側球員的 ID
- server #1 → server #2 切換時：設為 server #1 之外的另一位球員 ID（其夥伴）

**替代方案考慮**：
- 用 score parity 推導：`even score → RIGHT player`。此方案在 `resetToFirstServer` 於奇數分時失效（RIGHT 球員是 non-anchor，換邊後 server 在 LEFT 但 score 為奇數，與預期不符）
- 由外部呼叫者自行追蹤：需要 ViewModel 暴露更多原始狀態，違反封裝原則

**理由**：狀態跟進原則（explicit state tracking）比任何推導公式都可靠，且不增加外部 API 複雜度

### getServingPlayerId() 特殊處理 isFirstServe

**決策**：`isFirstServe === true` 時，直接回傳 anchor 球員（`players.find(p => p.isStartingRight)`）的 ID，不讀取 `currentServingPlayerId`。

**理由**：第一發球例外期間 `currentServingPlayerId` 初始化為 `${id}_P1`（anchor），雖然結果相同，但 `isFirstServe` 分支語意更清晰，也明確記錄此例外行為的文件意圖

### GameViewModel 新增 servingPlayerId

**決策**：`GameViewModel` 新增 `servingPlayerId: PlayerId`，Singles 直接取自 `singles.getServingPlayer()`，Doubles 取自新 `doubles.getServingPlayerId()`

**理由**：UI 層（GameScreen）不應依賴 `serverNumber` 的業務規則，ViewModel 應提供可直接使用的發球者身分

## Implementation Contract

### DoublesTeamState（src/core/doubles/DoublesGame.ts 內部型別）

新增欄位：
```
currentServingPlayerId: PlayerId
```
- `makeTeam(id)` 初始化為 `${id}_P1`
- `cloneTeam(t)` 必須複製此欄位（undo 快照需求）
- `resetToFirstServer(team)`：設為 `rightPlayer(team).id`
- Server #1 → #2 切換：設為 `team.players.find(p => p.id !== team.currentServingPlayerId)!.id`

### IDoublesScoreboard 介面（src/core/doubles/DoublesGame.ts）

新增方法：`getServingPlayerId(): PlayerId`

行為定義：
- `isFirstServe === true`：回傳 anchor 球員（`isStartingRight === true`）的 ID
- `isFirstServe === false, serverNumber === 1`：回傳 `currentServingPlayerId`（為 resetToFirstServer 時的 RIGHT 球員）
- `isFirstServe === false, serverNumber === 2`：回傳 `currentServingPlayerId`（已在切換時更新為夥伴 ID）

驗收：7 個 TDD 測試（含 undo 還原測試）全部通過 `npx vitest run`

### GameViewModel（src/core/gameViewModel.ts）

`GameViewModel` 介面新增：
```
servingPlayerId: PlayerId
```
- Doubles：`doubles.getServingPlayerId()`
- Singles：`singles.getServingPlayer()`

### GameScreen（src/screens/GameScreen.tsx）

`getIsServer(player, team, isServing, servingPlayerId)` 實作：
```
if (!isServing) return false
if (team.players.length === 1) return true
return player.id === servingPlayerId
```
`CourtHalf` 接收 `servingPlayerId: string`，不再接收 `serverNumber`

### SetupScreen（src/screens/SetupScreen.tsx）

局數按鈕 active class：`btn-neutral` → `btn-primary`

驗收：`npx tsc --noEmit` 零錯誤；`npx vitest run` 全部通過（含新增 7 個 `getServingPlayerId` TDD 測試）

## Risks / Trade-offs

- [Risk] `cloneTeam` 若未複製 `currentServingPlayerId`，undo 後發球者顯示會錯誤 → 已在 `cloneTeam` 內補上此欄位複製
- [Risk] isFirstServe 分支與 `currentServingPlayerId` 的初始值不一致可能造成混亂 → 兩者結果相同（都指向 anchor），程式碼中有明確注釋說明
