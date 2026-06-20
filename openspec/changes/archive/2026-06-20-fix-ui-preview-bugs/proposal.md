## Why

開局畫面（SetupScreen）的「局數」切換按鈕使用了 `btn-neutral`，視覺上看起來像未被選中的狀態，與同頁其他選項按鈕（`btn-primary`、`btn-secondary`、`btn-accent`）風格不一致。比賽畫面（GameScreen）在 0-0-2 開局時，發球指示符號（●）顯示在錯誤的球員身上——第一發球例外規則讓 anchor 球員（TEAM_A_P1）擔任發球，但 UI 卻將指示符顯示給 P2。

## What Changes

- SetupScreen 的「局數」選項按鈕 active 狀態從 `btn-neutral` 改為 `btn-primary`，與「模式」選項視覺風格一致
- `DoublesGame` 新增 `getServingPlayerId(): PlayerId` 方法，正確追蹤當前發球球員 ID（含第一發球例外規則處理）
- `DoublesTeamState` 新增 `currentServingPlayerId: PlayerId` 欄位，在 `resetToFirstServer` 與 server #1 → #2 切換時更新
- `GameViewModel` 新增 `servingPlayerId: PlayerId` 欄位，由 `deriveViewModel` 從 `DoublesGame.getServingPlayerId()` 取得
- `GameScreen` 的 `getIsServer()` 改為直接比對 `player.id === servingPlayerId`，移除錯誤的 `serverNumber` → player suffix 對應邏輯

## Non-Goals

- 不修改 Singles 發球追蹤邏輯（`SinglesGame` 已正確暴露 `getServingPlayer()`）
- 不改動計分板外觀或 RWD 佈局
- 不新增新的 UI 功能

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ui-setup-screen`: 「局數」按鈕 active 狀態改用 `btn-primary`，需更新 Requirement: Games count selection 規範
- `ui-game-screen`: 發球指示符現在依 `servingPlayerId` 精確標示，需更新 Requirement: Current server indicator 規範
- `game-view-model`: 新增 `servingPlayerId` 欄位至 `GameViewModel`，需更新型別定義規範
- `doubles-scoring`: 新增 `getServingPlayerId()` 至 `IDoublesScoreboard`，需更新介面規範

## Impact

- Affected specs: ui-setup-screen, ui-game-screen, game-view-model, doubles-scoring
- Affected code:
  - Modified: src/screens/SetupScreen.tsx, src/screens/GameScreen.tsx, src/core/doubles/DoublesGame.ts, src/core/gameViewModel.ts
  - New: (none)
  - Removed: (none)
