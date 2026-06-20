## 1. 前端環境建立

- [x] 1.1 【前端環境：React + Vite + TypeScript strict】安裝 React 18、ReactDOM、Vite、相關 TypeScript 型別定義至 `package.json`，並新增 `dev`、`build`、`preview` scripts；驗證：執行 `npm run dev` 後 terminal 顯示 Vite 啟動 URL，瀏覽器無 console error

- [x] 1.2 【前端環境：React + Vite + TypeScript strict】建立 `vite.config.ts`（使用 `@vitejs/plugin-react`）、`index.html` 入口、`src/main.tsx`（掛載 `<App />`）、`src/App.tsx`（回傳空 div）；驗證：`npm run dev` 開啟 `http://localhost:5173` 顯示空白頁面，無 console error

- [x] 1.3 【樣式方案：Tailwind CSS + DaisyUI】安裝 Tailwind CSS v3 + DaisyUI v3（PostCSS plugin）至 devDependencies，建立 `tailwind.config.ts`（content 指向 `./src/**/*.{ts,tsx}`，plugins 加入 daisyui）與 `postcss.config.ts`；驗證：在 `src/index.css` 加入 Tailwind directives，`App.tsx` 使用 `btn` class 後瀏覽器顯示 DaisyUI 樣式按鈕

## 2. Mock 資料與型別

- [x] 2.1 【Mock data 結構】建立 `src/mock/gameState.ts`，定義 `MockDoublesState` 型別（含 teamA、teamB 各有 name、score、players 陣列，players 含 id、isStartingRight、currentSide；servingTeam、serverNumber、status），並匯出 `mockDoublesState` 靜態物件（score: 6-4、servingTeam: TEAM_A、serverNumber: 1、狀態: IN_PROGRESS）；驗證：`npx tsc --noEmit` 無錯誤，所有欄位有明確型別，無 `any`

## 3. Setup 畫面

- [x] 3.1 建立 `src/screens/SetupScreen.tsx`，實作 **Mode selection** 需求：顯示單打/雙打切換控制（預設雙打），切換模式時球員欄位數量隨之變動（雙打：每隊 2 名球員；單打：每隊 1 名球員）；驗證：瀏覽器手動切換模式，欄位數量即時更新

- [x] 3.2 在 `SetupScreen.tsx` 加入 **Team and player name entry** 需求：雙打模式顯示 6 個輸入欄（Team A 名稱、A P1、A P2、Team B 名稱、B P1、B P2）；單打模式顯示 4 個輸入欄；驗證：DevTools 375px 寬度下所有欄位可見、可輸入，不溢出

- [x] 3.3 在 `SetupScreen.tsx` 加入 **First serving team selection** 與 **Court orientation setting** 需求：提供首發隊選擇（Team A / Team B）、上下隊方向選擇（預設 Team A 在上）；驗證：選項可互動，選擇結果可透過 props callback 傳遞

- [x] 3.4 在 `SetupScreen.tsx` 加入 **Start match action** 需求：「開始比賽」按鈕，點擊後呼叫 `onStart` callback；在 `App.tsx` 以 `useState<Screen>` 實作 **畫面路由：簡單 state machine，不引入 React Router**（`setup → game → game-over → setup`）；驗證：點擊按鈕後畫面切換至 Game 畫面

## 4. Game 畫面

- [x] 4.1 建立 `src/screens/GameScreen.tsx`，實作 **Bird's-eye court layout** 需求：依【球場佈局：CSS Grid 兩行】設計，以 CSS Grid 兩行呈現上下半場，中間加入 NET 分隔線，球場高度約 60vh，佔視口主要空間；驗證：DevTools 375px 下球場上下半場與 NET 可見，無水平溢出

- [x] 4.2 在 `GameScreen.tsx` 實作【球員站位座標（鳥瞰絕對）】與 **Bird's-eye court layout** - absolute coordinate positioning 需求：Team A（上方）的 RIGHT 球員顯示在螢幕左、LEFT 球員在螢幕右；Team B（下方）的 LEFT 球員在螢幕左、RIGHT 球員在螢幕右；加入 comment 說明鳥瞰絕對座標設計決策；驗證：對照 `mockDoublesState` 中球員 `currentSide`，螢幕位置符合鳥瞰規則

- [x] 4.3 在 `GameScreen.tsx` 實作 **Serving player indicator** 需求：目前發球員名稱旁顯示 ● 符號，非發球員無標記；以 `mockDoublesState.servingTeam` 與 `serverNumber` 判斷；驗證：瀏覽器顯示 ● 僅出現在正確球員旁

- [x] 4.4 在 `GameScreen.tsx` 實作 **Three-segment score display** 需求：於球場外以大字顯示 `servingScore – receivingScore – serverNumber`（如 `6 – 4 – 1`）；驗證：375px 下數字清晰可讀，DevTools 模擬遠距閱讀（縮至 50% zoom）仍可辨識

- [x] 4.5 在 `GameScreen.tsx` 實作 **Fixed scoring buttons** 需求：Team A +1 與 Team B +1 兩顆固定按鈕顯示於球場外，此階段點擊執行 `console.log`；**Undo action** 與 **Reset action** 需求：Undo 和 Reset 按鈕可見且可點擊（Reset 點擊呼叫 `onReset` callback 切換至 Game Over 畫面）；驗證：375px 下四顆按鈕皆可見、可點擊，拇指可達

- [x] 4.6 在 `GameScreen.tsx` 實作 **Tap-court scoring (opt-in)** 需求：加入 `tapCourtEnabled` props（預設 false），當啟用時點擊上半場 → console.log Team A 得分，點擊下半場 → console.log Team B 得分；停用時點擊球場無效果；驗證：手動切換 props 值，行為符合規格

- [x] 4.7 驗證 **Responsive layout** 需求：使用 Chrome DevTools 模擬 iPhone SE（375px）與 iPad（768px），確認球場、計分、按鈕無溢出、文字可讀；768px 下佈局利用橫向空間；驗證：截圖兩種裝置尺寸，目視確認

## 5. Game Over 畫面

- [x] 5.1 建立 `src/screens/GameOverScreen.tsx`，實作 **Winner announcement** 需求：以大字顯示獲勝隊伍名稱為頁面主要內容；**Rematch action** 需求：「Rematch」按鈕點擊後呼叫 `onRematch` callback 切換回 Setup 畫面；驗證：從 Game 畫面點 Reset 進入 Game Over 畫面，看到獲勝隊伍名稱；點擊 Rematch 回到 Setup 畫面

## 6. TypeScript 型別驗證

- [x] 6.1 執行 `npx tsc --noEmit`，確認三個畫面元件、mock data、App.tsx 皆無型別錯誤，無 `any` 使用；驗證：command 無錯誤輸出
