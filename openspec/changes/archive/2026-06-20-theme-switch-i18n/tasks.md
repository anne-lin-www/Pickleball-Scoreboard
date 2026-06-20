## 1. 字體與基礎設定

- [x] 1.1 字體統一：Inter + Noto Sans TC via Google Fonts — 在 `index.html` 引入 Google Fonts（Inter 400/600/700/900 + Noto Sans TC 400/600/700/900）；在 `tailwind.config.ts` 設定 `fontFamily.sans` 為 `['Inter', 'Noto Sans TC', 'sans-serif']`。驗證：`npm run build` 無型別錯誤，開啟瀏覽器 DevTools 確認 `font-family` computed value 包含 Inter。

- [x] 1.2 主題實作：DaisyUI 自訂多主題 + data-theme attribute（隊伍識別色配色方案：Indigo Pro（靛 + 琥珀 + 祖母綠））— 在 `tailwind.config.ts` 的 `daisyui.themes` 陣列新增兩組自訂主題（Indigo Pro 配色）：`midnight-pro`（深色：`primary` `#818cf8`、`secondary` `#fbbf24`、`accent` `#34d399`、`base-100` `#0f172a`）與 `court-day`（淺色：`primary` `#4338ca`、`secondary` `#b45309`、`accent` `#047857`、`base-100` `#ffffff`），完整設定所有 7 個 token（`base-100/200/300/base-content/primary/secondary/accent`）。驗證：套用 `data-theme="court-day"` 後 `bg-primary` CSS 計算值為 `#4338ca`，`data-theme="midnight-pro"` 後 `bg-primary` 為 `#818cf8`。

## 2. ThemeContext 實作（主題切換、ui-theme-switch）

- [x] 2.1 建立 `src/theme/ThemeContext.tsx`，定義 `ThemeContextValue`（`{ theme: 'court-day' | 'midnight-pro'; toggleTheme: () => void }`），並在 `useEffect` 初始化時讀取 `localStorage['pb-theme']`；預設值為 `midnight-pro`（Two DaisyUI custom themes、Theme persistence via localStorage）。驗證：`localStorage` 無值時 `<html data-theme>` 為 `midnight-pro`。

- [x] 2.2 `toggleTheme` 呼叫後須同步更新 `document.documentElement.setAttribute('data-theme', ...)` 並寫入 `localStorage['pb-theme']`，切換方向：`midnight-pro` ↔ `court-day`（ThemeContext React interface、Theme toggle switches value）。驗證：點擊切換後 `document.documentElement.getAttribute('data-theme')` 與 `localStorage['pb-theme']` 值一致，再次整理頁面後還原。

## 3. LocaleContext 實作（語言切換、ui-language-switch）

- [x] 3.1 語言實作：靜態字串物件 + React Context — 建立 `src/i18n/strings.ts`，定義 `Strings` type 與 `STRINGS` 物件，覆蓋 Two supported locales（`zh-TW` 與 `en`），含所有 17 個 key：`gameMode/doublesMode/singlesMode/teamName/player1/player2/firstServe/courtOrientation/topTeam/startGame/net/serving/scoreLabel/undo/reset/winnerLabel/rematch`（Strings type covers all UI text）。驗證：TypeScript strict mode 下 `STRINGS['zh-TW']` 和 `STRINGS['en']` 均無缺 key 錯誤；所有 key 值均為非空字串。

- [x] 3.2 建立 `src/i18n/LocaleContext.tsx`，定義 `LocaleContextValue`（`{ locale: 'zh-TW' | 'en'; setLocale: (l: Locale) => void; t: (key: keyof Strings) => string }`），讀取 `localStorage['pb-locale']`，預設 `zh-TW`（LocaleContext React interface、Locale persistence via localStorage）。驗證：`localStorage` 無值時 `locale` 為 `zh-TW`；`t('startGame')` 在 `zh-TW` 回傳 `開始比賽`，在 `en` 回傳 `Start Match`。

## 4. 切換控件元件

- [x] 4.1 ThemeToggle / LangToggle 放置位置：建立 `src/components/ThemeToggle.tsx`，渲染一個可點擊按鈕，顯示當前主題圖示（深色用 🌙，淺色用 ☀️），呼叫 `toggleTheme`（ThemeToggle component placement）。驗證：在 SetupScreen 可見；在 GameScreen 不可見（需在下一步整合後手動驗證）。

- [x] 4.2 建立 `src/components/LangToggle.tsx`，渲染一個可點擊按鈕，點擊後切換 `locale`（`zh-TW` ↔ `en`），顯示當前語言標籤（`繁中` / `EN`）；此元件與 ThemeToggle 並排於 SetupScreen 右上角（LangToggle component placement）。驗證：點擊後 `localStorage['pb-locale']` 值改變，頁面標籤即時更新。

## 5. App 根層整合

- [x] 5.1 在 `src/App.tsx` 用 `ThemeProvider` 與 `LocaleProvider` 包裹整個元件樹，確保所有 screen 可存取 context（ThemeContext React interface、LocaleContext React interface）。驗證：`npm run build` 無錯誤；三個 screen 可正常讀取 `useTheme()` 與 `useLocale()` hook。

## 6. SetupScreen 更新（ui-setup-screen）

- [x] 6.1 在 SetupScreen 頂部右側渲染 `ThemeToggle` 與 `LangToggle`，確保在 375px 寬度螢幕不換行（ThemeToggle and LangToggle controls on Setup screen）。驗證：Playwright 截圖 375px 寬 SetupScreen，目視確認兩個按鈕均可見於右上角。

- [x] 6.2 將 SetupScreen 所有硬編碼字串替換為 `t(key)` 呼叫（模式切換標籤、隊伍/球員欄位標籤、發球選擇、場地方向、開始按鈕）（Localized Setup screen labels）。驗證：切換 LangToggle 後，SetupScreen 所有標籤立即切換語言，無殘留英文/中文硬編碼字串。

## 7. GameScreen 更新（ui-game-screen）

- [x] 7.1 將 GameScreen 分數顯示改為隊伍色彩：伺服分數使用 `text-primary`，接球分數使用 `text-secondary`，發球序號使用 `text-accent`（Team-colored score display）。驗證：切換主題後分數數字顏色隨 DaisyUI token 改變；Playwright 截圖兩個主題下分數顏色有明顯差異。

- [x] 7.2 將 GameScreen 服務方半場背景改為隊伍色彩淺色調（Team A 服務時 `bg-primary/10`，Team B 服務時 `bg-secondary/10`）；非服務方使用 `bg-base-100`（Themed court half backgrounds）。驗證：目視確認服務方半場有淡色背景，非服務方為基底色。

- [x] 7.3 將 GameScreen 所有靜態文字替換為 `t(key)`：球網標籤、分數副標籤、Undo 按鈕、Reset 按鈕（Localized UI text labels）。驗證：切換語言後 GameScreen 所有標籤立即切換，無硬編碼字串殘留。

- [x] 7.4 確認 GameScreen 所有文字套用 `font-sans`（Inter + Noto Sans TC），分數數字加上 `font-black tabular-nums`（Font family on Game screen、Score numerals are tabular）。驗證：DevTools 確認分數 `font-weight: 900`，`font-variant-numeric: tabular-nums`。

## 8. GameOverScreen 更新（ui-game-over-screen）

- [x] 8.1 將 GameOverScreen 勝利標籤與 Rematch 按鈕替換為 `t('winnerLabel')` 與 `t('rematch')`（Localized Game Over screen text）。驗證：在 zh-TW 顯示 `勝利隊伍` / `再來一局`；在 en 顯示 `Winner` / `Rematch`。

## 9. 整合驗證

- [x] 9.1 啟動 dev server（`npm run dev`），使用 Playwright MCP 截圖 SetupScreen、GameScreen、GameOverScreen 在兩個主題 × 兩個語言共四種組合，目視確認色彩、字體、標籤均正確（所有 screen 的 ui-theme-switch 與 ui-language-switch 需求）。

- [x] 9.2 執行 `npm run build`，確認 TypeScript strict mode 無錯誤、build 成功（所有 context 型別正確，無 `any` 使用）。驗證：`npm run build` exit code 0。
