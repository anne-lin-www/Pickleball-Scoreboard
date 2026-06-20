## Context

SetupScreen 表單的 React state 和 App.tsx 的 screen routing 已實作完成（`setup` | `game` | `game-over` 三態切換）。目前 App 儲存 `SetupConfig`（純資料物件），GameScreen 接收 `config: SetupConfig` 但只使用 `mockDoublesState` 靜態假資料渲染。

這個 change 的目標是建立從 SetupConfig → 真實 game 實例的橋接層，讓 App 能持有並傳遞可用的 game 物件，為 Phase 2（GameScreen wiring）準備好介面。

## Goals / Non-Goals

**Goals:**

- 新增 `src/core/gameInit.ts`，提供純函式依 SetupConfig 建立 `DoublesGame` 或 `SinglesGame` 實例
- App.tsx 在 `handleStart` 時呼叫 `createGame(config)`，改為儲存 game 實例（而非只存 config）
- `SetupConfig` 補充 `gamesCount`（局數，1 或 3）欄位，SetupScreen 加入對應的 UI 選項
- 定義 App 傳給 GameScreen 的 prop 介面，讓 Phase 2 有明確合約可對接

**Non-Goals:**

- 不修改 GameScreen 內部渲染邏輯（仍可繼續使用 mock 資料）
- 不實作 localStorage 持久化
- 不修改 UI 版面或樣式

## Decisions

### SetupConfig 補充 gamesCount 欄位

SetupConfig 加入 `gamesCount: 1 | 3`，SetupScreen 提供 UI 切換（預設 1 局）。GameScreen 在 Phase 2 需要這個值決定比賽結束條件。現在就在 SetupConfig 定義，避免 Phase 2 再回頭修改介面。

替代方案：Phase 2 再加 → 會導致 Phase 2 需同時修改 SetupConfig、SetupScreen、App，超出其 scope。

### App 改存 game 實例，不再傳遞 SetupConfig

`handleStart` 改為：`createGame(config)` → 儲存 game 實例 + 保留 config（顯示用資料仍需要）。傳給 GameScreen 的 prop 由 `config: SetupConfig` 改為 `game: DoublesGame | SinglesGame`，加上 `config: SetupConfig`（供顯示名稱使用）。

替代方案：只傳 config，GameScreen 自己建 game → GameScreen 變成有副作用的初始化點，不符合單一職責。

### gameInit.ts 使用識別字字串作為 PlayerId

`DoublesGame` 與 `SinglesGame` 的 constructor 接受 `PlayerId`（string）。`gameInit.ts` 以 `'TEAM_A_P1'`、`'TEAM_A_P2'` 等固定識別字建立實例；玩家顯示名稱保留在 `SetupConfig`，GameScreen 在渲染時對應。這樣 game 引擎不需要知道顯示名稱。

## Implementation Contract

**createGame 函式**

```typescript
// src/core/gameInit.ts
function createGame(config: SetupConfig): DoublesGame | SinglesGame
```

- `config.mode === 'doubles'` → 回傳 `DoublesGame`，以 `TEAM_A_P1` / `TEAM_A_P2` / `TEAM_B_P1` / `TEAM_B_P2` 為 player ID
- `config.mode === 'singles'` → 回傳 `SinglesGame`，以 `TEAM_A_P1` / `TEAM_B_P1` 為 player ID
- `config.firstServingTeam` 決定初始服務方
- 函式為純函式，無副作用

**SetupConfig 介面新增欄位**

```typescript
export interface SetupConfig {
  // 現有欄位不變
  gamesCount: 1 | 3  // 新增
}
```

**App.tsx 狀態結構**

```typescript
const [game, setGame] = useState<DoublesGame | SinglesGame | null>(null)
const [config, setConfig] = useState<SetupConfig | null>(null)
```

`handleStart(cfg)` 執行：`setConfig(cfg); setGame(createGame(cfg)); setScreen('game')`

**GameScreen prop 介面更新**

```typescript
interface Props {
  game: DoublesGame | SinglesGame
  config: SetupConfig
  onReset: (winner: string) => void
}
```

GameScreen 接收 game 實例但本 change 不要求 GameScreen 使用它（Phase 2 負責）。

**驗收條件**

1. 執行 `npm run build` 無 TypeScript 錯誤
2. `createGame` 有對應的單元測試：doubles/singles 各模式回傳正確實例類型，firstServingTeam 正確傳入
3. SetupScreen 畫面出現局數選項（1 局 / 3 局），點選後值反映在送出的 SetupConfig
4. 在 Setup 填表後點「Start Game」，App 成功切換到 game screen（目前仍顯示 mock 資料，屬預期行為）

## Risks / Trade-offs

- [Risk] `DoublesGame` constructor 目前不接受 firstServingTeam 參數（預設從 TEAM_A 開始）→ 調查 DoublesGame constructor 簽名；如不支援，`gameInit.ts` 需在建立後呼叫對應 method，或記錄待 Phase 2 處理
- [Risk] SinglesGame constructor 固定以 playerAId 作為初始服務方，config.firstServingTeam 若為 TEAM_B 需透過 winRally 無法直接設定 → 調查實際 constructor 行為，若有限制於 tasks 中標記為待確認
