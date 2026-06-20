## Why

現有的 `DoublesGame` 核心演算法中，`makeTeam()` 將 P1 設定為 `isStartingRight: true`（右側），但依照匹克球慣例，0-0-2 開局時右側站位是 **2位**（順位2），左側是 **1位**（順位1）。導致 Setup 頁面的「Player 1」欄位實際對應到右側球員（2位），與球員和裁判的直覺認知相反。此外，Setup 頁面的球員 input 缺乏 label，使用者無法判斷哪個欄位是 Player 1/Player 2，且不知道開局發球者是誰。

## What Changes

- **BREAKING** — `makeTeam()` 修正 P1/P2 的 `isStartingRight` 慣例：P1 改為 `isStartingRight: false`（左側，順位1），P2 改為 `isStartingRight: true`（右側，順位2，開局發球）
- `DoublesGame` 初始 `currentServingPlayerId` 改為 P2（右側，2位）
- 受影響的現有 unit tests 一併以 TDD 方式修正（tests 先更新，再修 code）
- Setup 頁面雙打模式球員 input 加上明確的 label（「球員一 / Player 1」、「球員二 / Player 2」）
- Setup 頁面加上 small info 文字，依據目前選擇的「先發球隊」動態顯示「開局發球者：[球隊名] 球員二（Player 2）」
- i18n 字串新增對應 key

## Non-Goals

- 不開放使用者自行選擇哪位球員站右側（P2 固定為右側 2位）
- 不修改單打（Singles）邏輯
- 不修改 `getTeamPositions`、`getServingPlayerId` 等 public API 簽名
- 不異動 `TEAM_A_P1`、`TEAM_A_P2` 等 PlayerId 命名格式

## Capabilities

### New Capabilities

（none）

### Modified Capabilities

- `doubles-scoring`：修正 P1/P2 初始站位慣例（P1=左/順位1，P2=右/順位2），影響 makeTeam 初始狀態的 spec 要求
- `ui-setup-screen`：新增球員 input label 及開局發球者提示文字
- `game-view-model`：`teamAPlayer1/teamAPlayer2` 對應關係說明更新，反映新慣例

## Impact

- Affected specs: `doubles-scoring`, `ui-setup-screen`, `game-view-model`
- Affected code:
  - Modified: `src/core/doubles/DoublesGame.ts`
  - Modified: `src/core/doubles/DoublesGame.test.ts`
  - Modified: `src/screens/SetupScreen.tsx`
  - Modified: `src/i18n/strings.ts`
