## Why

SetupScreen UI（版面、樣式）已完成（v1），但表單元件目前只有靜態呈現，尚未連接任何邏輯。使用者目前無法透過 UI 實際設定比賽並啟動遊戲。

## What Changes

- SetupScreen 的表單欄位（模式切換、玩家名稱、服務方、局數）連接 React state
- 表單送出後，依據填入值建立初始 `GameState`
- 建立後切換到 GameScreen（透過 App 層的 screen state 管理）
- App.tsx 加入 screen routing 邏輯（`setup` | `game` | `game-over`）

## Non-Goals

- 不實作 localStorage 持久化（由後續 `game-state-persistence` change 處理）
- 不實作 GameScreen 的得分邏輯（由 `ui-game-screen-wiring` change 處理）
- 不修改現有 UI 版面或樣式

## Capabilities

### New Capabilities

- `setup-form-state`: SetupScreen 表單欄位受 React state 控制，使用者輸入即時反映
- `game-init-from-form`: 表單送出觸發依模式（Singles/Doubles）建立對應初始 `GameState`
- `screen-routing`: App 層管理目前畫面（setup / game / game-over），可依 GameState 切換

### Modified Capabilities

- `ui-setup-screen`（現有 spec）：從靜態 UI 升級為可互動的表單入口

## Impact

- Affected specs: ui-setup-screen（修改）、新增 screen-routing capability
- Affected code:
  - Modified: src/App.tsx, src/screens/SetupScreen.tsx
  - Modified: src/core/types.ts（如需補充 GameState 初始化欄位）
  - New: src/core/gameInit.ts（建立初始 GameState 的純函式）
