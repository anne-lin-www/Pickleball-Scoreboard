## Context

`DoublesGame` 和 `SinglesGame` 目前的建構子接收初始發球方（`firstServingTeam` / `playerAId`），但未將其儲存為 instance field。`reset()` 需要將狀態完整還原至建構時的初始值，因此必須在兩個類別中新增一個 `readonly` 欄位記錄初始發球方。

## Goals / Non-Goals

**Goals:**

- 在 `ISinglesScoreboard` 和 `IDoublesScoreboard` 介面新增 `reset(): void`
- 實作 `reset()`：清空分數、玩家位置、伺服器序號、undo 歷史，恢復 `isFirstServe`，並回到初始發球方
- 補齊 TDD 測試案例（紅燈 → 綠燈）

**Non-Goals:**

- 不支援重設至任意分數
- undo 歷史不跨越 reset 邊界（reset 後 undo 為 no-op）
- 不涉及 UI 層

## Decisions

### Decision: 新增 readonly 欄位儲存初始發球方

`DoublesGame` 新增 `private readonly initialServingTeamId: TeamId`，`SinglesGame` 新增 `private readonly initialServingPlayerId: PlayerId`，在建構子中賦值，`reset()` 讀取此值還原 `servingTeamId` / `servingPlayerId`。

替代方案：在 `reset()` 時以建構子相同邏輯重新推算 → 拒絕，因為兩個類別都沒有對外公開「初始發球方」，且重新推算邏輯脆弱。

### Decision: reset() 清空 history

```
reset():
  history = []
  restore all fields to constructor-time values
```

`undo()` 在 `history` 為空時為 no-op，因此清空後立即 undo 不會造成錯誤。

### Decision: DoublesGame 位置重置方式

`reset()` 呼叫 `makeTeam()` 重建兩個 team 物件（等同建構子行為），而非逐一還原玩家位置。這樣可確保 `isStartingRight` anchor 的位置一定正確。

## Implementation Contract

**`ISinglesScoreboard` 介面新增：**
```typescript
reset(): void
```

**`IDoublesScoreboard` 介面新增：**
```typescript
reset(): void
```

**行為合約：**

| 呼叫前狀態 | reset() 後預期狀態 |
|---|---|
| 任意進行中分數 | `getScoreCall()` 回到初始值（`"0-0"` / `"0-0-2"`） |
| 任意 FINISHED | `getStatus()` 回到 `IN_PROGRESS`，`getWinner()` 回到 `null` |
| B 為發球方 | `getServingPlayer()` / `getServingTeam()` 回到建構子指定的初始發球方 |
| history 有快照 | `undo()` 為 no-op（`getScoreCall()` 不變） |
| DoublesGame.isFirstServe = false | reset 後 `isFirstServe = true`（下次 fault 觸發 first-serve exception） |

**Acceptance Criteria（可對應測試）：**

- `reset()` 後 `getScoreCall()` 等於初始值
- `reset()` 後 `getStatus()` 為 `IN_PROGRESS`
- `reset()` 後 `getWinner()` 為 `null`
- `reset()` 後 `getServingPlayer()` / `getServingTeam()` 回到建構子傳入值
- `reset()` 後 `undo()` 為 no-op
- `reset()` 可重複呼叫（冪等）
- `DoublesGame`：`reset()` 後 `getServerNumber()` 為 `2`（first-serve exception 狀態）
- `DoublesGame`：`reset()` 後 anchor player 在 RIGHT（偶數分數）
- `SinglesGame`：`reset()` 後兩位玩家 `currentSide` 皆為 `RIGHT`

**範圍邊界：**

- 在範圍內：`DoublesGame.ts`、`SinglesGame.ts`（介面 + 實作）、對應 test 檔案
- 在範圍外：UI 層、`types.ts`、任何其他模組

## Risks / Trade-offs

- [Risk] `DoublesGame` 用 `makeTeam()` 重建 team，會產生新的 player ID（`TEAM_A_P1` 等），目前 player ID 是固定字串格式，無影響。→ 若未來 player ID 改為動態產生，需重新評估。
