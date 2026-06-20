## Why

GameScreen 的 UI（版面、樣式、計分顯示結構）已完成（v1），但所有互動行為目前僅呼叫 `console.log`，資料來源為靜態 `mockDoublesState`。`ui-setup-screen-wiring` 完成後，GameScreen 將接收真實 `DoublesGame | SinglesGame` 實例，本 change 負責把所有按鈕和點擊事件接上遊戲引擎，並在比賽結束時觸發 game-over 流程。

## What Changes

- 移除 `mockDoublesState` 依賴，改從 game 實例即時讀取狀態
- 引入 `GameViewModel`（純資料物件）作為 game engine → UI 的轉接層，統一 Doubles / Singles 的不同 API
- 法院點擊（court tap）接上 `game.winRally()`
- +1 按鈕接上 `game.winRally()`
- Undo 按鈕接上 `game.undo()`
- 每次 rally 後檢查 `game.getStatus()`，FINISHED 時呼叫 `onReset(winner)` 切換到 GameOver
- Reset 按鈕維持現有行為（直接呼叫 `onReset`，早期離開比賽）

## Non-Goals

- 不實作 localStorage 持久化（由後續 `game-state-persistence` change 處理）
- 不修改 UI 版面或樣式
- 不修改 GameOverScreen
- Singles 模式的球員位置顯示若與 Doubles 共用元件有困難，本 change 允許 Singles court 暫以雙欄位顯示（僅一位球員佔一欄）

## Capabilities

### New Capabilities

- `game-view-model`: 將 `DoublesGame | SinglesGame` 的狀態投影為統一的純資料結構，供 GameScreen 渲染
- `game-over-detection`: 每次 `winRally` 後偵測 `FINISHED` 狀態並觸發 game-over 導航

### Modified Capabilities

- `ui-game-screen`（現有 spec）：court tap、+1 按鈕、undo 從 console.log 升級為呼叫 game 引擎

## Impact

- Affected specs: ui-game-screen（修改）、新增 game-view-model、game-over-detection
- Affected code:
  - Modified: src/screens/GameScreen.tsx
  - New: src/core/gameViewModel.ts
  - Removed: src/mock/gameState.ts（待確認此 change 後是否其他地方仍有使用）
