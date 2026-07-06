## 1. i18n 與表單修正

- [x] 1.1 在 `src/i18n/strings.ts` 新增 `setupInputMode`、`formMode`、`diagramMode`、`playerNamePlaceholder` 字串 key（zh-TW 與 en 各一組），使切換按鈕與佔位提示文字可本地化。驗收：`Strings` 介面編譯無錯誤，zh-TW 值為「表單」/「球場圖」/「球員名字」，en 值為「Form」/「Court」/「Player name」

- [x] 1.2 修正 `src/screens/SetupScreen.tsx` 中四個球員名字 `useState` 初始值由 `'Player 1'`/`'Player 2'` 改為空字串 `''`（表單模式球員 state 預設值，Games count selection spec 新增的球員預設值行為）。所有球員 input 加上 `placeholder={t('playerNamePlaceholder')}`。驗收：開啟設定畫面後，四個球員欄位初始為空，輸入欄顯示佔位提示文字

- [x] 1.3 在 `src/screens/SetupScreen.tsx` 中，將 `initialServer` 提示文字從「首先發球」selector 下方移至球員二輸入欄正下方，僅對 `firstServingTeam` 所指的隊顯示（表單模式的「球員二 = 首發」提示位置，Initial server info display spec）。驗收：切換首發隊伍時，提示文字跟著移動至對應隊的球員二輸入欄下方；另一隊的球員二欄下方不顯示提示

## 2. `CourtDiagramInput` 元件

- [x] 2.1 建立 `src/components/CourtDiagramInput.tsx`，定義 `CourtDiagramInputProps` 與 `CourtDiagramInputState` 介面（`CourtDiagramInput` 元件介面，設計文件「球場圖提取為獨立元件 `CourtDiagramInput`」，Court diagram input mode for Doubles spec）：`teamAName`, `teamBName`, `teamAPlayer1`, `teamAPlayer2`, `teamBPlayer1`, `teamBPlayer2`, `topTeamId`, `firstServingTeam`, `onChange: (patch: Partial<CourtDiagramInputState>) => void`。驗收：TypeScript 編譯無錯誤，props 型別與 `SetupConfig` 對應欄位一致

- [x] 2.2 實作球場圖版面結構：上半區（隊名 input + 左右球員 input）→ 球網分隔（顯示 `t('net')`）→ 下半區（左右球員 input + 隊名 input），對應 Court diagram layout spec。驗收：畫面呈現上下兩個半區與球網分隔；上半左格對應 Player 1，右格對應 Player 2

- [x] 2.3 實作 `topTeamId` 對應邏輯：當 `topTeamId === 'TEAM_A'` 時，上半綁定 Team A 欄位（`teamAName`, `teamAPlayer1`, `teamAPlayer2`），下半綁定 Team B 欄位；`topTeamId === 'TEAM_B'` 時相反（Court diagram sets topTeamId implicitly spec）。驗收：在兩種 `topTeamId` 下，隊名 input 的 `value` 與 `onChange` 均正確綁定，切換後 input 內容對應正確欄位

- [x] 2.4 實作首發方點擊選擇：點擊上半區呼叫 `onChange({ firstServingTeam: <上半隊id> })`，點擊下半區呼叫 `onChange({ firstServingTeam: <下半隊id> })`；首發隊半區以 `bg-primary/10` 或 `bg-secondary/10` 高亮，非首發隊為 `bg-base-100`（首發方選擇：點擊半區高亮，不另設按鈕，First serving team selection in court diagram mode spec）。驗收：點擊上半後上半高亮，再點下半後下半高亮，`onChange` 每次帶出正確的 `firstServingTeam`

- [x] 2.5 確認 `CourtDiagramInput` 輸入的 `onChange` patch 合併進 `SetupScreen` state 後，兩種模式送出的 `SetupConfig` 結構一致（`SetupConfig` 不變，Court diagram produces identical SetupConfig spec）。驗收條件：在 diagram 模式填入相同資料後點「開始比賽」，`onStart` 收到的 `SetupConfig` 欄位與型別與 form 模式完全一致

## 3. `SetupScreen` 整合

- [x] 3.1 在 `src/screens/SetupScreen.tsx` 新增 `setupInputMode: 'form' | 'diagram'` state（預設 `'form'`），並在 Doubles 模式下渲染「表單 / 球場圖」切換按鈕（使用現有 `join` 按鈕樣式），Singles 模式下不渲染（Input mode toggle control in Doubles spec、設計文件「兩種模式共用相同的 state，切換不重置」）。驗收：Doubles 模式下顯示切換按鈕；Singles 模式下切換按鈕消失；切換後已輸入的隊名/球員名不被清除

- [x] 3.2 在 `SetupScreen` 中，當 `setupInputMode === 'diagram'` 時：渲染 `<CourtDiagramInput>` 取代現有的隊伍/球員表單區塊，同時隱藏「首先發球」按鈕列與「球場方向」按鈕列（First serving team selection spec、Court orientation setting spec）。驗收：diagram 模式下，表單區塊、首先發球按鈕列、球場方向按鈕列均不可見；`<CourtDiagramInput>` 可見

- [x] 3.3 確保 `<CourtDiagramInput>` 的 `onChange` 以 partial patch 更新 `SetupScreen` state，`topTeamId` 與 `firstServingTeam` 在 diagram 模式下由元件更新（設計文件「球場圖上半對應 topTeamId，以 UI state 推導」）。驗收：在 diagram 模式點擊下半區後切換回 form 模式，「球場方向」按鈕反映 diagram 中的設定；首先發球按鈕同理

## 4. 觸控與 RWD 驗收

- [x] 4.1 在 375px 寬度視口（手機）下驗收球場圖模式的觸控目標大小。每個半區最小高度 `min-h-[120px]`（設計文件「觸控目標大小」風險）。驗收：使用 Playwright 或瀏覽器 DevTools 375px 視口，上下半區均可正常點擊/觸控，輸入欄可聚焦並輸入文字
