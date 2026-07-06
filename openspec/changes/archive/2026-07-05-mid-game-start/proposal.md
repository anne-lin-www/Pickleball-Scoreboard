## Why

實務上操作人員常在比賽已開始後才開啟記分板，現有流程僅支援從 0-0-2 開局，無法從現場已進行的分數接續計分。新增中途接續功能，讓操作人員輸入現場狀態（分數、球員位置、發球方）後立即接手計分。

## What Changes

- `SetupScreen` 底部新增次要 CTA「中途接續現況計分」按鈕
- 新增 `MidGameSetupScreen`：獨立畫面，包含：
  - 模式切換（雙打 / 單打）
  - 球場俯瞰圖：輸入隊名、球員名字（位置依左右格）；點擊半場選擇目前發球方
  - 分數輸入：雙打 3 格（發球方得分 / 接球方得分 / 發球序號 1或2）；單打 2 格（發球方得分 / 接球方得分）
  - 非阻斷式位置一致性警告：雙打發球方得分奇偶與球員所在格不符時顯示提示
  - 「開始接續計分」按鈕
- `App.tsx` 新增 `'mid-game-setup'` screen 狀態與 `handleMidGameStart` handler
- 新增 `buildMidGameState` 工具函式：從操作人員輸入組裝 `SerializedDoublesGame` / `SerializedSinglesGame`，再透過 `fromSerialized()` 建立遊戲物件
- 雙打中途接續的 `currentServingPlayerId` 由「發球方得分奇偶 + 球場圖左右位置」自動推導，不需額外輸入
- 單打中途接續的球員 `currentSide` 由各自得分自動計算，球場圖不需左右格
- 中途接續的 `history` 初始為空（不支援 undo 回到接續點之前）
- 中途接續不顯示「局數」選項（固定單局）

## Non-Goals

- 不支援從中途接續點 undo 回更早的現實比賽歷史（現場沒有資料可還原）
- 不驗證分數組合是否符合完整的匹克球規則邏輯（例如最高分合理性），僅驗證輸入格式
- 不修改 `DoublesGame` / `SinglesGame` 核心演算法
- 不支援多局比賽（Best of 3）的中途接續，固定視為單局

## Capabilities

### New Capabilities

- `mid-game-setup-screen`：中途接續設定畫面——讓操作人員輸入現場比賽狀態，建構有效初始遊戲物件後進入 GameScreen 計分
- `mid-game-state-builder`：從使用者輸入組裝序列化遊戲狀態的邏輯——推導 `currentServingPlayerId`、`isStartingRight`、球員 `currentSide`，並驗證輸入一致性

### Modified Capabilities

- `screen-routing`：新增 `mid-game-setup` 路由節點，SetupScreen 可轉入、完成後轉入 GameScreen
- `game-init-from-form`：新增從中途狀態輸入建立遊戲物件的路徑（與現有從 SetupConfig 建立的路徑並存）

## Impact

- Affected specs: `mid-game-setup-screen`（新增）、`mid-game-state-builder`（新增）、`screen-routing`（修改）、`game-init-from-form`（修改）
- Affected code:
  - New: `src/screens/MidGameSetupScreen.tsx`
  - New: `src/core/midGameStateBuilder.ts`
  - New: `src/core/midGameStateBuilder.test.ts`
  - Modified: `src/App.tsx`
  - Modified: `src/screens/SetupScreen.tsx`
  - Modified: `src/i18n/strings.ts`
