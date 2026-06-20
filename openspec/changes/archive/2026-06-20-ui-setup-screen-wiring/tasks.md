## 1. 型別擴充：SetupConfig 加入局數欄位

- [x] 1.1 SetupConfig 補充 gamesCount 欄位：在 `src/screens/SetupScreen.tsx` 的 `SetupConfig` 介面新增 `gamesCount: 1 | 3`，SetupScreen 的 `useState` 初始值設為 `1`，`handleStart` 回傳的物件包含 `gamesCount`。驗收：`npm run build` 無 TypeScript 錯誤，`SetupConfig` 型別包含 `gamesCount`。

- [x] 1.2 在 SetupScreen 的表單加入「局數」UI 選項（1 局 / Best of 3），選擇後更新 `gamesCount` state，符合 Games count selection control Requirement。驗收：瀏覽器開啟 Setup 畫面，預設顯示「1 局」，切換至「Best of 3」後提交，config 值正確。

## 2. 核心：建立 gameInit.ts

- [x] 2.1 建立 `src/core/gameInit.ts`，實作 `createGame(config: SetupConfig): DoublesGame | SinglesGame` 純函式。gameInit.ts 使用識別字字串作為 PlayerId：doubles 模式以 `TEAM_A_P1`、`TEAM_A_P2`、`TEAM_B_P1`、`TEAM_B_P2` 建立 `new DoublesGame(config.firstServingTeam)`；singles 模式，若 `firstServingTeam === 'TEAM_A'` 則以 `('TEAM_A_P1', 'TEAM_B_P1')` 建立，若為 `'TEAM_B'` 則以 `('TEAM_B_P1', 'TEAM_A_P1')` 建立。符合 create game instance from setup config Requirement 與 player IDs are derived from fixed identifiers Requirement。

- [x] 2.2 為 `createGame` 撰寫單元測試 `src/core/gameInit.test.ts`（TDD）：測試案例包含 doubles/singles 各模式回傳正確實例類型、firstServingTeam TEAM_A 與 TEAM_B 各自的初始服務方正確。驗收：`npm test` 所有 gameInit.test.ts 案例通過。

## 3. App 改存 game 實例

- [x] 3.1 App 改存 game 實例，不再傳遞 SetupConfig：更新 `src/App.tsx` 新增 `game` state（`DoublesGame | SinglesGame | null`），`handleStart` 改為同時呼叫 `setConfig(cfg)` 與 `setGame(createGame(cfg))` 後切換畫面，符合 app stores game instance after setup Requirement。驗收：`npm run build` 無錯誤，點擊 Start Game 後 App 切換至 game screen。

- [x] 3.2 更新 `src/screens/GameScreen.tsx` 的 Props 介面：加入 `game: DoublesGame | SinglesGame`（保留 `config: SetupConfig` 和 `onReset`），App.tsx 傳入 `game` prop。GameScreen 內部此 change 不要求使用 game 實例（仍可使用 mock），但 prop 型別需正確，符合 GameScreen receives game instance and config Requirement。驗收：`npm run build` 無 TypeScript 錯誤。
