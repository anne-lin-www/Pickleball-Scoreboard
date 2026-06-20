## Why

比賽進行中可能因為各種原因（場地衝突、誤操作、規則重新確認）需要中止並重開新局。現有介面缺少 `reset()` 方法，無法在不重新建立 game 物件的情況下重置狀態。

## What Changes

- `ISinglesScoreboard` 介面新增 `reset(): void`
- `ISinglesGame` 類別實作 `reset()`：清空所有狀態回到初始值，包含 undo 歷史
- `IDoublesScoreboard` 介面新增 `reset(): void`
- `DoublesGame` 類別實作 `reset()`：清空所有狀態回到初始值，包含 undo 歷史
- 為雙打和單打各新增 reset 測試案例

## Non-Goals

- 不支援「重設為指定分數」，只支援歸零重開
- 不保留 reset 前的歷史快照（undo 無法跨 reset 邊界）
- 不影響 UI 層（此 change 僅限 core 層）

## Capabilities

### New Capabilities

（無新能力 — reset 是對現有 doubles-scoring 和 singles-scoring 的擴充）

### Modified Capabilities

- `doubles-scoring`：新增 reset requirement — 重置雙打計分板至初始狀態
- `singles-scoring`：新增 reset requirement — 重置單打計分板至初始狀態

## Impact

- Affected specs: doubles-scoring, singles-scoring
- Affected code:
  - Modified: src/core/doubles/DoublesGame.ts
  - Modified: src/core/singles/SinglesGame.ts
  - Modified: src/core/doubles/DoublesGame.test.ts
  - Modified: src/core/singles/SinglesGame.test.ts
