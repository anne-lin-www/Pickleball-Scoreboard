## Context

GameScreen 的版面與樣式已完成（v1）。所有互動（court tap、+1 按鈕、undo）目前呼叫 `console.log`，分數來自 `mockDoublesState` 靜態物件。`ui-setup-screen-wiring` 完成後，GameScreen 接收真實的 `DoublesGame | SinglesGame` 實例（mutable class）及 `SetupConfig`（顯示名稱來源）。

核心挑戰：`DoublesGame` 與 `SinglesGame` 有不同的公開 API（不同的 `winRally` 參數型別、不同的 position query method），必須統一為 GameScreen 可直接渲染的資料結構。

## Goals / Non-Goals

**Goals:**

- 建立 `src/core/gameViewModel.ts`，提供 `deriveViewModel(game, config)` 純函式，統一 Doubles / Singles 的狀態投影
- GameScreen 改用 `GameViewModel` 作為唯一渲染資料來源
- 所有互動（court tap、+1 按鈕、undo）接上 game 引擎
- 每次 `winRally` 後偵測 `FINISHED`，呼叫 `onReset(winnerDisplayName)` 導航至 GameOver
- 移除 `src/mock/gameState.ts`（`GameScreen` 是唯一使用者）

**Non-Goals:**

- 不修改 UI 版面、樣式、色彩系統
- 不實作 localStorage 持久化
- 不修改 GameOverScreen
- Singles court 可暫以雙欄共用元件渲染（單名球員佔一欄，另一欄空白），不強制重構成單欄版型

## Decisions

### GameViewModel 作為轉接層

`DoublesGame` 與 `SinglesGame` 的 API 不同：

| API | Doubles | Singles |
|---|---|---|
| 得分後呼叫 | `winRally(TeamId)` | `winRally(PlayerId)` |
| 查詢位置 | `getTeamPositions(TeamId)` → `Record<PlayerId, CourtSide>` | `getPlayerSide(PlayerId)` |
| 服務方 | `getServingTeam(): TeamId` + `getServerNumber(): 1 \| 2` | `getServingPlayer(): PlayerId` |
| 勝者 | `getWinner(): TeamId \| null` | `getWinner(): PlayerId \| null` |

替代方案：GameScreen 內部 if/else 分支 → 邏輯散落難以測試。選擇 `gameViewModel.ts` 作為純函式轉接層，可獨立單元測試。

**GameViewModel 型別定義：**

```typescript
interface TeamView {
  id: TeamId
  name: string
  score: number
  players: { id: PlayerId; name: string; side: CourtSide }[]
}

interface GameViewModel {
  topTeam: TeamView
  bottomTeam: TeamView
  servingTeamId: TeamId
  serverNumber: 1 | 2
  status: GameStatus
  winnerName: string | null
  mode: 'doubles' | 'singles'
}
```

### React state：每次 action 後重新 derive ViewModel

`DoublesGame` / `SinglesGame` 是可變物件，React 無法偵測內部狀態變化。GameScreen 維護 `viewModel` 在 `useState`，每次呼叫 game method 後呼叫 `setViewModel(deriveViewModel(game, config))`。

替代方案：forceUpdate tick counter → 仍需衍生顯示資料，不如直接存 ViewModel。

### winRally 的呼叫參數

- Doubles：直接傳 `TeamId`（`'TEAM_A'` 或 `'TEAM_B'`）
- Singles：傳 `PlayerId`，由 `TeamId` 推導：`${teamId}_P1`（固定慣例，與 `gameInit.ts` 一致）

### 分數解析

`getScoreCall()` 回傳格式：
- Doubles：`"serving_score-receiving_score-server_number"`（例：`"6-4-1"`）
- Singles：`"serving_score-receiving_score"`（例：`"6-4"`）

`deriveViewModel` 解析此字串並對應到 topTeam / bottomTeam 的 score 欄位。

### 勝者名稱對應

game over 時：
- Doubles：`game.getWinner()` 回傳 `TeamId`，對應 `config.teamAName` 或 `config.teamBName`
- Singles：`game.getWinner()` 回傳 `PlayerId`（`'TEAM_A_P1'` 或 `'TEAM_B_P1'`），前綴判斷對應 `config.teamAPlayer1` 或 `config.teamBPlayer1`

## Implementation Contract

**deriveViewModel 函式**

```typescript
// src/core/gameViewModel.ts
function deriveViewModel(
  game: DoublesGame | SinglesGame,
  config: SetupConfig
): GameViewModel
```

- `config.topTeamId` 決定哪個 TeamView 放在 `topTeam`
- Doubles：呼叫 `game.getTeamPositions(teamId)` 取得每個球員的 `CourtSide`
- Singles：每隊只有一名球員，side 由 `game.getPlayerSide(playerId)` 取得
- 分數從 `game.getScoreCall()` 解析；`servingTeamId` 從 `game.getServingTeam()` 取得（Singles 則由 `getServingPlayer()` 反推 `TeamId`）
- `serverNumber`：Doubles 呼叫 `game.getServerNumber()`；Singles 固定為 `1`

**GameScreen 的 winRally 呼叫**

GameScreen 在 court tap 或 +1 按鈕點擊時：
1. 依 mode 決定呼叫參數（Doubles 傳 TeamId；Singles 傳 `${teamId}_P1`）
2. 呼叫 `game.winRally(...)`
3. 檢查 `game.getStatus() === 'FINISHED'`
4. 若 FINISHED：呼叫 `onReset(viewModel.winnerName ?? '')`
5. 若 IN_PROGRESS：`setViewModel(deriveViewModel(game, config))`

**驗收條件**

1. `npm run build` 無 TypeScript 錯誤，`src/mock/gameState.ts` 已刪除且無 import 殘留
2. `deriveViewModel` 單元測試：doubles/singles 各模式在不同得分與服務方下，topTeam/bottomTeam score、servingTeamId、serverNumber 均正確
3. 瀏覽器手動驗收：doubles 模式下點 +1 分數遞增、换边正確、score call 顯示 "X-Y-Z"；達到 11 分且差距 ≥ 2 後自動進入 GameOver
4. undo 按鈕在得分後可回退一步

## Risks / Trade-offs

- [Risk] `getScoreCall()` 字串解析若格式改變會靜默出錯 → `deriveViewModel` 加防禦解析，格式不符時拋出明確錯誤（開發期 fail-fast）
- [Risk] Singles 模式 `getServingPlayer()` 回傳 PlayerId，需反推 TeamId → 以前綴 `'TEAM_A_'` 判斷，此規則與 `gameInit.ts` PlayerID 命名慣例綁定，需在 tasks 中明確記載
