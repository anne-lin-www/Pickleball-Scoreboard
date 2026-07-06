## 1. 核心邏輯：`buildMidGameState`（TDD）

- [x] 1.1 建立 `src/core/midGameStateBuilder.ts`（`buildMidGameState` 作為純函式，獨立於 UI，`buildMidGameState(input)` 行為），定義 `MidGameDoublesInput`、`MidGameSinglesInput`、`MidGameInput` 型別介面（設計文件「`MidGameInput` 型別定義」、buildMidGameState pure function spec），以及 `buildMidGameState(input: MidGameInput): DoublesGame | SinglesGame` 函式簽章。驗收：TypeScript 編譯無錯誤，函式可從 App 層 import

- [x] 1.2 實作並測試雙打發球者推導邏輯（雙打發球者自動推導，不需額外輸入，Doubles serving player derivation spec、Mid-game state invariants spec）：TDD 撰寫 `src/core/midGameStateBuilder.test.ts`，涵蓋 4 個案例：偶數得分→右格為 currentServingPlayerId；奇數得分→左格為 currentServingPlayerId；`isFirstServe` 恆為 false；`history` 恆為空。驗收：`npx vitest run src/core/midGameStateBuilder.test.ts` 全部通過

- [x] 1.3 實作並測試單打球員位置自動計算（單打球員位置自動計算，不需球場圖左右格，Singles player side derivation spec）：在 `midGameStateBuilder.test.ts` 新增案例：servingScore=3 → serving player currentSide='LEFT'；receivingScore=2 → receiving player currentSide='RIGHT'；雙方得分為 0 → 雙方 currentSide='RIGHT'。驗收：`npx vitest run src/core/midGameStateBuilder.test.ts` 全部通過

- [x] 1.4 驗證 `buildMidGameState` 產出的遊戲物件可被 `deriveViewModel` 正常消費（Mid-game game object construction path spec、Mid-game path produces compatible game object spec）：在 `midGameStateBuilder.test.ts` 新增整合測試，呼叫 `buildMidGameState` 後再呼叫 `deriveViewModel(game, config)`，確認回傳的 `GameViewModel` 不拋出例外且 `servingTeamId`、`serverNumber` 與輸入一致。驗收：測試通過，無 TypeScript 型別錯誤

## 2. App 狀態機擴充

- [x] 2.1 在 `src/App.tsx` 中，將 `Screen` type 由 `'setup' | 'game' | 'game-over'` 改為 `'setup' | 'mid-game-setup' | 'game' | 'game-over'`（`App.tsx` screen 狀態機擴充，Mid-game setup screen routing spec）。新增 `handleGoToMidGameSetup()` 將 screen 設為 `'mid-game-setup'`、`handleBackFromMidGame()` 將 screen 設為 `'setup'`、`handleMidGameStart(config, game)` 設定 config 與 game 後轉 `'game'` 並呼叫 `markSessionActive()` 與 `saveGameState(config, game)`。驗收：TypeScript 編譯無錯誤；現有 setup → game 流程不受影響

## 3. `SetupScreen` 次要 CTA

- [x] 3.1 在 `src/screens/SetupScreen.tsx` 的「開始新局」按鈕下方新增次要 CTA 區塊（`SetupScreen` CTA，Mid-game setup screen layout spec）：顯示提示文字「比賽已開始？」與 `btn-outline` 樣式的「中途接續現況計分」按鈕，點擊呼叫 `onMidGame` prop。在 `src/i18n/strings.ts` 新增 `midGamePrompt`、`midGameCta` 字串 key（zh-TW / en 各一組）。驗收：按鈕顯示於主按鈕下方；點擊後 App 切換至 mid-game-setup screen

## 4. `MidGameSetupScreen` 元件

- [x] 4.1 建立 `src/screens/MidGameSetupScreen.tsx`，包含頂部 back affordance（呼叫 `onBack`）與 Doubles/Singles 模式切換（Mid-game mode selection spec）。新增 props 介面：`onBack: () => void`、`onStart: (config: SetupConfig, game: DoublesGame | SinglesGame) => void`。驗收：TypeScript 編譯無錯誤；模式切換按鈕可見且可點擊

- [x] 4.2 實作球場俯瞰圖：雙打模式顯示上下半區各含隊名 input 與左右兩格球員 input；單打模式顯示上下半區各含單格球員 input（Court diagram for mid-game setup spec）。點擊半區設為發球方（高亮顯示）。驗收：雙打模式下左右格可輸入文字；點擊上半區後上半高亮；點擊下半區後下半高亮

- [x] 4.3 實作分數輸入欄位：雙打 3 個欄位（type=number min=0）+ 發球序號切換按鈕 `[1][2]`；單打 2 個欄位（Score input fields spec）。在 `src/i18n/strings.ts` 新增 `servingScore`、`receivingScore`、`serverNumber`、`resumeScoring`、`backToSetup` 字串 key。驗收：雙打模式下 3 個輸入欄與 `[1][2]` 按鈕可見；單打模式下只顯示 2 個輸入欄

- [x] 4.4 實作位置一致性警告（雙打）：即時計算發球方得分奇偶是否與球場圖左右格一致（非阻斷式位置一致性警告（雙打），位置一致性警告條件（雙打），Position consistency warning for Doubles spec）；不符時在發球方半區下方顯示警告文字；「開始接續計分」按鈕不因警告而 disabled。驗收：輸入偶數得分但左格為預期發球者時顯示「⚠️ 得分為偶數，發球者應在右側」；清除分數或位置調整一致後警告消失

- [x] 4.5 實作「開始接續計分」按鈕：點擊時呼叫 `buildMidGameState(input)` 建立遊戲物件，以 `{ mode, topTeamId, teamAName, teamBName, teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2, firstServingTeam, gamesCount: 1 }` 組裝 `SetupConfig`，再呼叫 `onStart(config, game)`（Start mid-game action spec）。驗收：點擊後 App 切換至 GameScreen；GameScreen 顯示的分數與操作人員輸入的分數一致（例如輸入 5-3-2 → 顯示 5–3–2）

## 5. 整合驗收

- [x] 5.1 端對端手動驗收（Mid-game state is persisted like a normal game spec）：雙打中途接續 → 進入 GameScreen 計分 → 重新整理頁面 → 確認 ResumeDialog 出現且選擇 Resume 後回到正確的中途狀態。驗收：重整後 GameScreen 顯示的分數與接續前一致；undo 最多只能回到接續點（第一次 undo 無效）
