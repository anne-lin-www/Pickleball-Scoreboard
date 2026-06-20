## Context

專案目前有完整的 TypeScript core engine（`DoublesGame`、`SinglesGame`），通過 Vitest TDD 驗證。前端環境尚未建立。此階段目標是建立 React + Vite 開發環境，實作三個畫面的 UI layout，以 mock data 呈現視覺設計，供設計決策驗證用。

核心討論決策（來自 spectra-discuss）：
- 球場顯示採**純鳥瞰座標**：Team A 在螢幕上方面朝下（南向），A_RIGHT 在螢幕左；Team B 在螢幕下方面朝上（北向），B_LEFT 在螢幕左
- 操作者透過 Setup 設定上下隊方向，隱含校準自身站位
- 得分操作：固定按鈕為標配；點擊球場區域為 opt-in 設定
- 發球員標示：圓點（●）標記，無 YOUR LEFT/RIGHT 文字標籤
- 不處理 style 風格（顏色、主題）；不處理部署

## Goals / Non-Goals

**Goals:**
- 建立可運行的 React + Vite + TypeScript 開發環境
- 安裝 Tailwind CSS（PostCSS build）與 DaisyUI
- 三個畫面 layout 以 mock data 可視覺預覽：Setup、Game、Game Over
- 手機直式為主，RWD 支援平板/桌機
- `vite dev` 啟動後可在瀏覽器即時預覽

**Non-Goals:**
- GitHub Pages 部署設定
- 接入 core engine（DoublesGame / SinglesGame）
- Style 風格（顏色、品牌）
- 單打 UI 實作（結構與雙打相同，此階段先做雙打 layout）
- 動畫、過場效果、i18n

## Decisions

### 前端環境：React + Vite + TypeScript strict

Vite 提供即時 HMR 開發體驗，與現有 TypeScript strict 環境一致。React 18 + functional components + hooks，不引入狀態管理 lib（mock data 直接 import）。

### 樣式方案：Tailwind CSS + DaisyUI

Tailwind 正式 build（PostCSS plugin）取代 Play CDN，適合 production。DaisyUI 提供語意化元件（btn、badge、stats），減少手寫 utility class 量。Style theme 留後續設定，本階段使用 DaisyUI 預設。

### 球場佈局：CSS Grid 兩行

```
┌─────────────────────────────┐
│  Team A 半場（grid row 1）  │
├─────────────────────────────┤
│  NET 分隔線                 │
├─────────────────────────────┤
│  Team B 半場（grid row 2）  │
└─────────────────────────────┘
```

每半場內用 Flexbox 排列左右球員位置。球場整體高度佔視口主要空間（`h-[60vh]` 左右），讓比賽資訊一眼可見。

### 球員站位座標（鳥瞰絕對）

```
Team A（上方，面朝南/下）：
  screen-left  = A_RIGHT 位置
  screen-right = A_LEFT 位置

Team B（下方，面朝北/上）：
  screen-left  = B_LEFT 位置
  screen-right = B_RIGHT 位置
```

`isStartingRight` 球員加 ● 標記表示首發/發球員。

### Mock data 結構

獨立 `src/mock/gameState.ts` 提供靜態 snapshot，型別與 core engine 一致，方便後續替換為真實 engine state。

```typescript
// 結構示意
export const mockDoublesState = {
  teamA: { name: 'Team A', score: 6, players: [...] },
  teamB: { name: 'Team B', score: 4, players: [...] },
  servingTeam: 'TEAM_A',
  serverNumber: 1 as const,
  status: 'IN_PROGRESS' as const,
}
```

### 畫面路由：簡單 state machine，不引入 React Router

三個畫面（Setup → Game → Game Over）用 `App.tsx` 的 `useState<Screen>` 切換，避免路由設定複雜度。

```typescript
type Screen = 'setup' | 'game' | 'game-over'
```

## Implementation Contract

**啟動行為**：執行 `npm run dev` 後，瀏覽器開啟 `http://localhost:5173` 顯示 Setup 畫面，無 console error。

**畫面切換**：
- Setup 畫面按「開始比賽」→ 切換至 Game 畫面（mock data 顯示）
- Game 畫面按「RESET」→ 切換至 Game Over 畫面
- Game Over 畫面按「Rematch」→ 回到 Setup 畫面

**Game 畫面資訊完整性**（以 mock data 驗證）：
- 三段式計分顯示：`servingScore - receivingScore - serverNumber`（雙打）
- 球場上下兩半，各有 2 個球員名稱，位置依鳥瞰座標顯示
- 發球員以 ● 標記
- 「UNDO」與「RESET」按鈕可見且可點擊（此階段無邏輯，點擊無效果或 console.log）
- 得分固定按鈕（Team A +1 / Team B +1）顯示於球場外，可見且可點擊

**RWD 驗證**：Chrome DevTools 模擬 iPhone SE（375px）與 iPad（768px）下，球場與按鈕不溢出、文字可讀。

**TypeScript**：`npx tsc --noEmit` 無錯誤。

**Scope boundaries**：
- In scope：環境建立、三畫面 layout、mock data、RWD 基本驗證
- Out of scope：core engine 接入、實際計分邏輯、部署、style 主題

## Risks / Trade-offs

- [Risk] DaisyUI 版本與 Tailwind v4 相容性 → 確認使用 DaisyUI v4（支援 Tailwind v4）或鎖定 Tailwind v3 + DaisyUI v3
- [Risk] 鳥瞰座標對 Team A 的顯示（A_RIGHT 在螢幕左）初看反直覺 → 在 GameScreen 元件加 comment 說明設計決策，避免後續誤改
