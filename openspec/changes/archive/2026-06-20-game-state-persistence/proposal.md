## Why

純前端應用在使用者誤觸 F5 或誤關分頁後，進行中的比賽資料會完全消失，導致比賽記錄無法繼續。需要在不引入後端的情況下，讓比賽資料能在意外頁面離開後自動恢復，同時讓使用者有機會選擇繼續或重新開局。

進一步分析使用者行為：關閉瀏覽器後重開，代表使用者活動已終止（極高機率為新局）；而誤觸 F5 則代表使用者希望維持現狀。這兩種情境應給予不同的預設行為，而非一律彈出對話框。

## What Changes

- 每次 `GameState` 更新時透過 `useEffect` 將資料（含 `savedAt` 時間戳記）同步寫入 `localStorage`
- 進入 Game Screen 時在 `sessionStorage` 設置 session flag（`sessionStorage` 在 F5 重整後保留，但分頁/瀏覽器關閉後清除），用於區分以下情境：
  - **F5 重整**（sessionStorage flag 存在）→ 靜默自動恢復至 Game Screen，不顯示對話框，使用者幾乎感覺不到中斷
  - **關閉分頁或瀏覽器後重開**（sessionStorage flag 不存在）→ 顯示 ResumeDialog，依 `savedAt` 時間戳記決定預設焦點：
    - 距上次儲存 **< 30 分鐘** → 「繼續比賽」為 autoFocus（誤關分頁情境，Enter 鍵繼續）
    - 距上次儲存 **≥ 30 分鐘** → 「開新局」為 autoFocus（結束活動後重開，Enter 鍵開新局）
- 在使用者明確離開比賽（Game Over 後選擇 rematch 或返回 Setup）時，主動清除 `localStorage` 與 `sessionStorage` 資料
- `GameState` 型別需確保完整可序列化（避免直接儲存 `Date` 物件）

## Non-Goals

- 不支援多場比賽同時記錄（只保存一場進行中比賽）
- 不支援比賽歷史紀錄（Game Over 後即清除）
- 不引入後端或雲端同步
- `sessionStorage` 只作為 session 偵測 flag 使用，不儲存比賽資料本身

## Capabilities

### New Capabilities

- `game-state-persistence`: 將進行中的 GameState 持久化至 localStorage，App 啟動時依 sessionStorage flag 與 savedAt 時間戳記，決定靜默恢復或以 ResumeDialog 讓使用者選擇繼續或開新局

### Modified Capabilities

- `screen-routing`: App 啟動時若偵測到已存有比賽資料，依 session 狀態與儲存時間決定路由行為（靜默進入 Game Screen、以繼續為主的 ResumeDialog、或以開新局為主的 ResumeDialog）

## Impact

- Affected specs: `game-state-persistence`（修改）、`screen-routing`（修改）
- Affected code:
  - Modified: `src/hooks/useGamePersistence.ts`（新增 savedAt、markSessionActive、isSessionActive、clearGameState 同時清除 sessionStorage）
  - Modified: `src/components/ResumeDialog.tsx`（新增 defaultAction prop 控制 autoFocus 按鈕）
  - Modified: `src/App.tsx`（session flag 偵測、時間戳記計算、F5 靜默恢復、defaultAction 傳遞）
