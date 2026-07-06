## Context

現有流程：`SetupScreen` → `createGame(config)` → `GameScreen`。`DoublesGame.fromSerialized()` 和 `SinglesGame.fromSerialized()` 已存在完整的狀態還原機制（供 `useGamePersistence` 使用），但目前沒有從「人工輸入現場狀態」建構序列化物件的路徑。

此變更新增一條平行路徑：`SetupScreen` → `MidGameSetupScreen` → `buildMidGameState()` → `fromSerialized()` → `GameScreen`，不修改現有正常路徑。

## Goals / Non-Goals

**Goals:**

- 新增 `MidGameSetupScreen`：操作人員輸入現場狀態的 mobile-first 畫面
- 新增 `buildMidGameState()`：純函式，將操作人員輸入轉換為有效的序列化遊戲狀態
- 擴充 `App.tsx` screen 狀態機，新增 `'mid-game-setup'` 節點
- 在 `SetupScreen` 底部加次要 CTA 按鈕進入中途設定

**Non-Goals:**

- 不修改 `DoublesGame` / `SinglesGame` 核心演算法
- 不支援 Best of 3 的中途接續
- 不支援 undo 回接續點之前

## Decisions

### `buildMidGameState` 作為純函式，獨立於 UI

**決策**：將狀態推導邏輯提取為純函式 `buildMidGameState(input: MidGameInput): DoublesGame | SinglesGame`，放在 `src/core/midGameStateBuilder.ts`，完整可單元測試。UI 層（`MidGameSetupScreen`）只負責收集輸入並呼叫此函式。

**理由**：推導邏輯（奇偶性、`isStartingRight`、`currentServingPlayerId`）有明確的規則，適合 TDD 開發；與 UI 解耦才能寫出有意義的單元測試。

---

### 雙打發球者自動推導，不需額外輸入

**決策**：`currentServingPlayerId` 由「發球方得分奇偶 + 球場圖左右球員順序」自動推導：
- 發球方得分偶數 → 右格球員為目前發球者
- 發球方得分奇數 → 左格球員為目前發球者

`isStartingRight`（anchor）依相同邏輯設定：
- 發球方得分偶數 → 右格球員 `isStartingRight: true`
- 發球方得分奇數 → 左格球員 `isStartingRight: true`

接球方的 `isStartingRight` 設為「右格=true, 左格=false」（不影響遊戲邏輯，因為 `isFirstServe: false`，`resetToFirstServer` 會在下次得球時重設正確發球者）。

**替代方案**：讓操作人員手動選「哪個球員是 anchor」——被排除，增加輸入複雜度且規則可自動推導。

---

### 非阻斷式位置一致性警告（雙打）

**決策**：當「球場圖中發球方的左右球員位置」與「由得分奇偶推導出的預期位置」不符時，UI 顯示 warning badge 但不阻止操作人員繼續。

**理由**：操作人員站在現場，可能是邊查球員位置邊輸入分數，輸入中途會短暫不一致。非阻斷設計避免誤操作，但仍給予視覺反饋讓操作人員自行確認。

---

### 單打球員位置自動計算，不需球場圖左右格

**決策**：單打每位球員的 `currentSide = score % 2 === 0 ? 'RIGHT' : 'LEFT'`（與 `SinglesGame` 內部邏輯一致）。球場圖只需顯示上下兩格（球員名字），點擊選發球方，不需要左右區分。

**理由**：單打位置規則是單一函式可推導，不需要人工輸入，減少出錯機會。

---

### `MidGameInput` 型別定義

```ts
interface MidGameDoublesInput {
  mode: 'doubles'
  teamAName: string
  teamBName: string
  topTeamId: TeamId          // 'TEAM_A' | 'TEAM_B'
  servingTeamId: TeamId
  // 上半場（topTeamId 所指的隊）
  topLeftPlayerName: string  // Player 1（isStartingRight: false 初始值）
  topRightPlayerName: string // Player 2（isStartingRight: true 初始值）
  // 下半場
  bottomLeftPlayerName: string
  bottomRightPlayerName: string
  servingTeamScore: number   // X[0] from score call
  receivingTeamScore: number // X[1] from score call
  serverNumber: 1 | 2        // X[2] from score call
}

interface MidGameSinglesInput {
  mode: 'singles'
  teamAName: string
  teamBName: string
  topTeamId: TeamId
  servingTeamId: TeamId
  topPlayerName: string
  bottomPlayerName: string
  servingTeamScore: number
  receivingTeamScore: number
}

type MidGameInput = MidGameDoublesInput | MidGameSinglesInput
```

Player ID mapping 沿用現有慣例：`TEAM_A_P1`, `TEAM_A_P2`, `TEAM_B_P1`, `TEAM_B_P2`。

## Implementation Contract

### `buildMidGameState(input)` 行為

**雙打輸出**（`SerializedDoublesGame`）：
- `isFirstServe: false`（中途接續永遠不適用 first-serve exception）
- `history: []`（接續點前無可 undo 的歷史）
- `servingTeamId`：直接使用輸入值
- 發球方 `serverNumber`：直接使用輸入值
- 發球方 `currentServingPlayerId`：
  - 偶數得分 → 右格球員 ID
  - 奇數得分 → 左格球員 ID
- 發球方球員 `isStartingRight`：
  - 右格球員（偶數側）= `true`；左格球員 = `false`
- 接球方球員 `isStartingRight`：右格 = `true`，左格 = `false`
- 兩隊球員 `currentSide`：直接使用輸入的左右位置

**單打輸出**（`SerializedSinglesGame`）：
- `initialServingPlayerId`：發球方球員 ID
- 每位球員 `currentSide`：`score % 2 === 0 ? 'RIGHT' : 'LEFT'`

**驗收：** `src/core/midGameStateBuilder.test.ts` 涵蓋以下案例：
- 雙打偶數得分 → 右格為 currentServingPlayerId
- 雙打奇數得分 → 左格為 currentServingPlayerId
- 單打位置由得分奇偶自動計算
- `isFirstServe` 恆為 `false`
- `history` 恆為空陣列

### `App.tsx` Screen 狀態機擴充

`Screen` type 由 `'setup' | 'game' | 'game-over'` 改為 `'setup' | 'mid-game-setup' | 'game' | 'game-over'`。

新增 `handleGoToMidGameSetup()` → 設定 screen 為 `'mid-game-setup'`
新增 `handleMidGameStart(config, game)` → 設定 config、game、screen 為 `'game'`、呼叫 `markSessionActive()`

### `SetupScreen` CTA

在現有「開始新局」按鈕下方新增：
```
比賽已開始？
[中途接續現況計分]  （btn-outline 次要按鈕）
```

### 位置一致性警告條件（雙打）

當以下條件同時成立時顯示 warning：
- `servingTeamScore % 2 === 0` 且目前發球方的球場圖「左格有名字、右格有名字，但左格與右格位置似乎互換」
- 實際判斷：若 `servingTeamScore % 2 === 0`（偶數），期望右格是發球者；若 `servingTeamScore % 2 !== 0`（奇數），期望左格是發球者。

警告文字：偶數時「⚠️ 得分為偶數，發球者應在右側」；奇數時「⚠️ 得分為奇數，發球者應在左側」。

此警告由 `MidGameSetupScreen` 即時計算，不影響「開始接續計分」按鈕的可用性。

## Risks / Trade-offs

- **[操作人員輸入錯誤]** 若球員位置或分數有誤，接手後的計分邏輯會從錯誤狀態繼續 → 現有 Reset 按鈕可回到 SetupScreen 重新設定；警告提示降低輸入錯誤機率
- **[接球方 isStartingRight 可能與真實不符]** 接球方的 anchor 狀態只能猜測，但 `isFirstServe: false` 下不影響 `getServingPlayerId()`，僅 `runPositionAssertion()` 可能誤報 → `runPositionAssertion()` 在接球方得分後仍以正確邏輯計算位置，不影響計分
