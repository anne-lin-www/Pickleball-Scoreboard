## Context

匹克球計分邏輯有兩種模式（雙打/單打），規則差異大且有多個容易出錯的邊界條件（開局特例、站位奇偶防呆、Undo）。在 UI 開發之前以 TDD 封裝核心演算法，可獨立驗證邏輯正確性，避免 UI 層混入商業邏輯。

目前 `src/` 目錄為空，本次是從零建立核心模組。

## Goals / Non-Goals

**Goals:**

- 以 Player-Centric 設計封裝雙打狀態：`isStartingRight` 作為錨點驅動奇偶防呆
- 以純函數設計封裝單打站位：`expectedSide = score % 2 === 0 ? RIGHT : LEFT`
- 兩種模式各自獨立的 interface，不強行共用抽象
- Undo 透過 immutable snapshot history stack 實現，不依賴 mutation rollback
- 所有公開 interface 方法均有 Vitest 測試案例覆蓋

**Non-Goals:**

- React 元件、UI 狀態管理（Zustand 等）不在本次範圍
- 多局制（best-of-3）、Rally scoring 不在本次範圍
- `CourtRule` 型別不引入

## Decisions

### 雙打與單打使用分開的 Interface

雙打需要 `serverNumber: 1 | 2`、`isStartingRight` 錨點、`getTeamPositions()`；單打完全不需要這些概念。強行共用 interface 會導致單打實作出現無意義的空方法或 `never` 型別。

決定：`IDoublesScoreboard` 與 `ISinglesScoreboard` 各自獨立，僅共用 `src/core/types.ts` 的基礎型別。

### Player-Centric 設計（雙打）

`Player` entity 持有 `isStartingRight: boolean`（唯讀錨點），`currentSide` 隨比賽變動。`validatePositions()` 從錨點與當前分數奇偶性交叉比對，不需重播歷史軌跡。

替代方案「記錄每次換位事件」被排除：事件重播在 Undo 後仍需維護完整事件序列，複雜度更高。

### 純函數站位（單打）

單打站位完全由 `score % 2` 決定，`currentSide` 儲存於 `SinglesPlayer` 以支援 S5.2 的異常偵測（實際值 vs 推導值比對）。不引入 `isStartingRight`。

### Undo 使用 Snapshot History Stack

每次 `winRally()` 前將完整 game state 序列化為 immutable snapshot 並 push 到 history array，`undo()` 則 pop 並還原。

替代方案「mutation rollback（逐步反轉操作）」被排除：規則複雜，反轉邏輯難以維護且容易出錯。

### 開局特例（雙打）以 `isFirstServe` 旗標控制

`DoublesGame` 持有 `isFirstServe: boolean`，初始為 `true`。第一次 Side Out 發生時設為 `false`，此後發球順位遵循一般規則（從右側球員為第 1 發球員）。

## Implementation Contract

**共用型別（src/core/types.ts）：**

```typescript
type CourtSide = 'RIGHT' | 'LEFT'
type GameStatus = 'IN_PROGRESS' | 'FINISHED'
type TeamId = 'TEAM_A' | 'TEAM_B'
type PlayerId = string
```

**雙打 interface（src/core/doubles/DoublesGame.ts）：**

```typescript
interface IDoublesScoreboard {
  winRally(winner: TeamId): void
  undo(): void
  getScoreCall(): string              // e.g. "0-0-2", "1-0-1"
  getServingTeam(): TeamId
  getServerNumber(): 1 | 2
  getTeamPositions(id: TeamId): Record<PlayerId, CourtSide>
  getStatus(): GameStatus
  getWinner(): TeamId | null
  runPositionAssertion(): void        // throws if anchor player on wrong side
}
```

**單打 interface（src/core/singles/SinglesGame.ts）：**

```typescript
interface ISinglesScoreboard {
  winRally(winner: PlayerId): void
  undo(): void
  getScoreCall(): string              // e.g. "0-0", "3-7"
  getServingPlayer(): PlayerId
  getPlayerSide(id: PlayerId): CourtSide
  getStatus(): GameStatus
  getWinner(): PlayerId | null
  runPositionAssertion(): void        // throws if player on wrong side for their score
}
```

**接受條件：**

- `npm test` 全部通過，測試案例對應 docs/Test_Cases.md 的 D1–D5（雙打）與 S1–S6（單打）
- `runPositionAssertion()` 在 D5.2 / S5.2 場景下拋出 `Error`，在 D5.1 / S5.1 場景下不拋出
- `getScoreCall()` 格式符合規格：雙打 `"X-Y-Z"`，單打 `"X-Y"`
- `undo()` 在 S6.1 / S6.2 後使狀態完全回到前一個 `winRally()` 呼叫前的值

**範圍邊界：**

- 在 scope：`src/core/` 下的 TypeScript 邏輯與 Vitest 測試
- 出 scope：任何 React 元件、Vite 設定、UI 狀態管理

## Risks / Trade-offs

- [Risk] Snapshot 深拷貝若物件結構複雜，效能有潛在問題 → Mitigation：核心 state 結構簡單（score、side、serverNumber），使用 `structuredClone()` 即可，無需引入額外函式庫
- [Risk] 雙打與單打 interface 完全分開，未來若需統一處理（如 replay 功能）需要 adapter → Mitigation：現階段 Non-Goal，屆時再以 adapter pattern 橋接
