## Why

核心計分邏輯已透過 TDD 完成並驗證，現階段需要建立 React + Vite 前端環境，以 mock data 呈現 UI layout 的 presentation preview，讓設計方向在正式接入 core engine 前可被視覺驗證。

## What Changes

- 初始化 React + Vite + TypeScript 前端環境（整合至現有專案）
- 安裝 Tailwind CSS（正式 build）與 DaisyUI 元件庫
- 建立三個畫面的 UI layout 元件：Setup、Game、Game Over
- Game 畫面以 mock data 呈現俯瞰球場、計分板、球員站位、操作按鈕
- 開發環境 `vite dev` 可即時預覽，不涉及 GitHub Pages 部署設定

## Non-Goals

- GitHub Pages 部署設定（留待後續階段）
- 接入 `DoublesGame` / `SinglesGame` core engine（mock data 先行）
- Style 風格設計（顏色、主題、品牌識別）
- 雙打以外的模式 UI（單打 UI 結構相同，複用為主）
- 動畫與過場效果
- i18n / 多語系

## Capabilities

### New Capabilities

- `ui-setup-screen`: 賽前設定畫面，選擇模式（單打/雙打）、輸入隊伍與球員名稱、選擇首發隊伍
- `ui-game-screen`: 比賽主畫面，俯瞰球場佈局、三段式計分顯示、球員站位、發球員標示、得分按鈕、Undo/Reset
- `ui-game-over-screen`: 比賽結束畫面，顯示獲勝隊伍、提供 Rematch 按鈕

### Modified Capabilities

（無）

## Impact

- Affected specs: ui-setup-screen、ui-game-screen、ui-game-over-screen（新建）
- Affected code:
  - New: `index.html`
  - New: `vite.config.ts`
  - New: `tailwind.config.ts`
  - New: `postcss.config.ts`
  - New: `src/main.tsx`
  - New: `src/App.tsx`
  - New: `src/index.css`
  - New: `src/screens/SetupScreen.tsx`
  - New: `src/screens/GameScreen.tsx`
  - New: `src/screens/GameOverScreen.tsx`
  - New: `src/mock/gameState.ts`
  - Modified: `package.json`
