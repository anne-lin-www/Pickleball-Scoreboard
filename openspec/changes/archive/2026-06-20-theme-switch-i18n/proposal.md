## Why

現行 UI 採用單一 DaisyUI 預設主題，未提供淺色/深色切換，也無多語言支援。記分板在戶外強光（淺色主題）與室內低光（深色主題）的可視性需求截然不同；同時繁體中文使用者為主要目標族群，需要正確的 CJK 字體與語言呈現。

## What Changes

- 新增 **主題切換**（淺色 Court Day / 深色 Midnight Pro），以 CSS 自訂變數實作，DaisyUI 多主題設定支援
- 新增 **語言切換**（繁體中文 zh-TW / 英文 en），以輕量 React Context 實作，不引入第三方 i18n 套件
- 統一字體配置：Inter + Noto Sans TC，同時涵蓋英數與 CJK；分數數字使用 Inter 900 weight
- 主題切換偏好與語言偏好均以 `localStorage` 持久化
- 設計微調：淺色主題線框加重至 1.5px、深色主題 net 使用半透明白；所有圖示與按鈕的對比度符合 WCAG AA

## Non-Goals

- 不引入 react-i18next、i18next 等第三方 i18n 函式庫；字串量小，靜態物件已足夠
- 不支援系統自動偵測語言（`navigator.language`）— 使用者顯式選擇，避免中英混排的佈局問題
- 不實作動畫過渡效果（主題切換）— 避免比賽操作中的視覺干擾
- 不修改核心計分邏輯（`src/core/`）

## Capabilities

### New Capabilities

- `ui-theme-switch`: 淺色/深色主題切換，透過 `data-theme` attribute 控制，`localStorage` 持久化偏好
- `ui-language-switch`: zh-TW / en 語言切換，React Context 提供字串，`localStorage` 持久化偏好

### Modified Capabilities

- `ui-game-screen`: 套用主題 CSS 變數；計分顯示改為隊伍色彩（深色主題 Team A 藍 / Team B 橘；淺色主題 Team A 深藍 / Team B 深紅）；玩家名稱字體統一為 Inter + Noto Sans TC；文字標籤改為多語言字串
- `ui-setup-screen`: 欄位標籤、按鈕文字改為多語言字串；新增主題切換與語言切換控制元件
- `ui-game-over-screen`: 勝利訊息改為多語言字串

## Impact

- 受影響規格：`ui-theme-switch`（新）、`ui-language-switch`（新）、`ui-game-screen`（修改）、`ui-setup-screen`（修改）、`ui-game-over-screen`（修改）
- 受影響程式碼：
  - 新增：`src/theme/ThemeContext.tsx`、`src/i18n/LocaleContext.tsx`、`src/i18n/strings.ts`、`src/components/ThemeToggle.tsx`、`src/components/LangToggle.tsx`
  - 修改：`src/App.tsx`、`src/screens/GameScreen.tsx`、`src/screens/SetupScreen.tsx`、`src/screens/GameOverScreen.tsx`、`tailwind.config.ts`、`src/index.css`
  - 移除：無
