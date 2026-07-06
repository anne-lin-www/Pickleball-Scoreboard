## Why

雙打設定畫面目前採用純文字表單，球員以「球員一（1位）」/「球員二（2位）」標籤區分，場地方向以隊名按鈕選擇，與操作人員站在球場旁的空間直覺不符。球場圖模式讓操作人員直接按現場視角（上半/下半）填入隊名與球員，同時修正現有表單的幾處 UX 問題。

## What Changes

- 雙打模式的隊伍/球員設定區塊新增「表單 / 球場圖」切換按鈕（沿用現有 `join` 按鈕樣式）
- **球場圖模式**（新）：靜態俯瞰球場圖，上半/下半各顯示一個球場半區，每個半區含：
  - 隊名輸入欄
  - 左右兩格球員名字輸入欄（對應發球區左右位置）
  - 點擊半區 = 選為首發方（高亮標示），取代獨立的「首先發球」按鈕列
  - 上半隱含為 `topTeamId`，取代獨立的「球場方向」選項
- **表單模式修正**（現有）：
  - 球員名字預設值從 `"Player 1"` 改為空字串（保留 placeholder 提示文字）
  - 「球員二 = 首發」提示文字移至球員二輸入欄旁，讓關聯性更明確
- 新增 i18n 字串：切換按鈕標籤、球場圖模式的方向提示文字
- 單打模式不受影響，維持現有表單

## Non-Goals

- 不支援在球場圖上拖曳球員換位（左右位置由遊戲引擎依規則自動管理）
- 不支援球場圖內翻轉上下半（操作人員直接依現場視角填入）
- 不引入動畫或過場效果
- 不修改 `DoublesGame` 核心演算法（`isStartingRight` 邏輯不變）

## Capabilities

### New Capabilities

- `setup-court-diagram-input`：雙打設定的球場圖輸入模式——以俯瞰球場圖替代表單，讓操作人員按現場視角輸入隊名、球員名字及選擇首發方

### Modified Capabilities

- `ui-setup-screen`：新增表單/球場圖切換控制；球場圖模式下整合首發方選擇與場地方向設定
- `setup-form-state`：球員名字預設值由預填字串改為空字串

## Impact

- Affected specs: `setup-court-diagram-input`（新增）、`ui-setup-screen`（修改）、`setup-form-state`（修改）
- Affected code:
  - New: `src/components/CourtDiagramInput.tsx`
  - Modified: `src/screens/SetupScreen.tsx`
  - Modified: `src/i18n/strings.ts`
