## Why

匹克球計分規則複雜（雙打三段式報分、開局特例、奇偶站位防呆；單打二段式報分、純函數站位），必須先以 TDD 方式將核心計分演算法封裝為獨立的 TypeScript 模組，才能在後續 UI 開發中確保邏輯正確性與可測試性。

## What Changes

- 新增雙打計分引擎（`IDoublesScoreboard`）：實作三段式報分、開局 0-0-2 特例、第 1/2 發球員順位、Side Out、得分換位、奇偶站位防呆、Undo
- 新增單打計分引擎（`ISinglesScoreboard`）：實作二段式報分、純函數站位（`score % 2 === 0 → RIGHT`）、直接換發球、奇偶站位防呆、Undo
- 新增共用型別定義：`CourtSide`、`GameStatus`、`GameMode`
- 所有邏輯均以 Vitest 測試覆蓋，測試先行（Kent Beck TDD）

## Non-Goals

- UI 元件（React components）不在本次範圍
- 網路對戰、多局制（best-of-3）不在本次範圍
- Rally scoring（2025 新規則）不在本次範圍
- `CourtRule`（EvenCourt/OddCourt）型別不引入，站位由純函數 `score % 2` 直接推導

## Capabilities

### New Capabilities

- `doubles-scoring`：雙打計分引擎，含三段式報分、開局特例、發球順位轉換、站位管理、奇偶防呆、Undo
- `singles-scoring`：單打計分引擎，含二段式報分、純函數站位、直接換發球、奇偶防呆、Undo

### Modified Capabilities

(none)

## Impact

- Affected specs: doubles-scoring（新建）、singles-scoring（新建）
- Affected code:
  - New: src/core/types.ts
  - New: src/core/doubles/DoublesGame.ts
  - New: src/core/doubles/DoublesGame.test.ts
  - New: src/core/singles/SinglesGame.ts
  - New: src/core/singles/SinglesGame.test.ts
