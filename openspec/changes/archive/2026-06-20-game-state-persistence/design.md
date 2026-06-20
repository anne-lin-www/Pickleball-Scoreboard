## Context

App 目前使用 React state 管理比賽進行中的資料（`SetupConfig` + `DoublesGame | SinglesGame` 實例），App 重整後資料全部消失。`SetupConfig` 是純 plain object，可直接 JSON 序列化。`DoublesGame` / `SinglesGame` 是 class 實例，私有欄位需要透過公開的序列化介面才能持久化。兩個 class 內部均已有 `GameSnapshot` interface 與 `snapshot()` / `restore()` 方法供 undo 使用，可在此基礎上擴充公開序列化能力。

`sessionStorage` 的生命週期特性：F5 重整後保留，關閉分頁或瀏覽器後清除。這使得它可以作為「此次是否為重整」的偵測旗標，而不儲存任何比賽資料。

## Goals / Non-Goals

**Goals:**

- F5 或誤關分頁後，比賽資料自動保存（含 undo 歷史）
- **F5 重整**：App 重新掛載時偵測到 sessionStorage flag 存在，直接靜默恢復至 Game Screen，不問使用者
- **誤關分頁後重開**（< 30 分鐘）：顯示 ResumeDialog，「繼續比賽」為 autoFocus
- **關閉瀏覽器後重開**（≥ 30 分鐘，或誤關超時）：顯示 ResumeDialog，「開新局」為 autoFocus
- 只保存 `screen === 'game'` 狀態；Setup 頁面與 Game Over 頁面不持久化
- 程式內主動離開比賽時，清除 localStorage 與 sessionStorage 資料

**Non-Goals:**

- 不保存 undo 歷史步驟之外的其他統計資料
- 不支援多場同時進行
- 不保存 Game Over 後的結果
- 不支援跨瀏覽器 / 跨裝置同步

## Decisions

### 使用 localStorage 儲存比賽資料，sessionStorage 作為 session flag

`localStorage` 持久存活直到主動 `removeItem`，適合跨分頁關閉的持久化。`sessionStorage` 在 F5 重整後保留但關閉分頁即清除，適合作為「此次是否為重整」的偵測旗標。

兩者結合：
- `localStorage['pickleball_game']`：儲存序列化的比賽狀態與 config，含 `savedAt` 時間戳記
- `sessionStorage['pickleball_session']`：值為 `'1'`，僅代表目前 session 是否曾進入 Game Screen

### 為 Game class 新增公開序列化介面

**決策**：在 `SinglesGame` / `DoublesGame` 上各新增 `serialize(): SerializedXxxGame` 方法與 `static fromSerialized(data): XxxGame` 工廠方法。

序列化型別定義：

```typescript
// SinglesGame 序列化格式
interface SerializedSinglesGame {
  type: 'singles'
  initialServingPlayerId: PlayerId
  playerA: SinglesPlayerState
  playerB: SinglesPlayerState
  servingPlayerId: PlayerId
  status: GameStatus
  winner: PlayerId | null
  history: GameSnapshot[]
}

// DoublesGame 序列化格式
interface SerializedDoublesGame {
  type: 'doubles'
  initialServingTeamId: TeamId
  teamA: DoublesTeamState
  teamB: DoublesTeamState
  servingTeamId: TeamId
  isFirstServe: boolean
  status: GameStatus
  winner: TeamId | null
  history: GameSnapshot[]
}
```

### 使用自訂 Hook 封裝 localStorage 與 sessionStorage 邏輯

新建 `src/hooks/useGamePersistence.ts`，對外暴露：

```typescript
interface PersistedGameState {
  config: SetupConfig
  game: SerializedSinglesGame | SerializedDoublesGame
  savedAt: number  // Date.now() 時間戳記，單位毫秒
}

interface UseGamePersistenceReturn {
  loadPersistedState(): PersistedGameState | null
  saveGameState(config: SetupConfig, game: DoublesGame | SinglesGame): void
  clearGameState(): void          // 清除 localStorage + sessionStorage flag
  markSessionActive(): void       // 設置 sessionStorage['pickleball_session'] = '1'
  isSessionActive(): boolean      // 回傳 sessionStorage['pickleball_session'] !== null
}
```

localStorage key 固定為 `'pickleball_game'`，sessionStorage key 固定為 `'pickleball_session'`。

### 序列化時機：useEffect 監聽 game 物件參考變更

`DoublesGame` / `SinglesGame` 以 mutation 方式更新內部狀態，React state 存的是物件參考。每次得分時 `GameScreen` 呼叫 `setGame(g => g)` 強制觸發 re-render，`App.tsx` 的 `useEffect` 在每次 game 參考更新時呼叫 `saveGameState`。

### Rehydrate：App mount 時依 session 狀態決定路由

```
App mount 時的決策流程：
  persisted = loadPersistedState()

  if persisted is null:
    → Setup Screen（正常流程）

  else if isSessionActive():
    → 靜默恢復（F5）: handleResume() 直接進 Game Screen, pendingResume = null

  else:
    elapsed = Date.now() - persisted.savedAt
    if elapsed < 30 * 60 * 1000:
      → setPendingResume(persisted), defaultAction = 'resume'
    else:
      → setPendingResume(persisted), defaultAction = 'new-game'
```

由於 `useState` lazy initializer 無法呼叫 state setter，「靜默恢復」路徑需在 initializer 完成後立即以 `useEffect` 或透過初始 state 設定 screen/game/config 來實作。

**具體做法**：lazy initializer 中若偵測到 F5 情境（has persisted + isSessionActive），直接設定初始 screen、game、config（而非走 pendingResume 路徑）。將重建邏輯（`fromSerialized`）提出為 `rehydrateGame(persisted)` 輔助函式，供 lazy initializer 與 `handleResume` 共用。

### ResumeDialog 支援 defaultAction prop

```typescript
interface ResumeDialogProps {
  config: SetupConfig
  onResume: () => void
  onNewGame: () => void
  defaultAction: 'resume' | 'new-game'
}
```

- `defaultAction === 'resume'`：「繼續比賽」有 `autoFocus`
- `defaultAction === 'new-game'`：「開新局」有 `autoFocus`
- 兩個按鈕的視覺樣式固定不變：「繼續比賽」永遠是 primary，「開新局」永遠是 outline

## Implementation Contract

**Behavior:**

- 使用者在 `screen === 'game'` 時按 F5：App 重新掛載後偵測到 sessionStorage flag，直接進入 Game Screen，比賽資料（分數、輪次、undo 歷史）與離開前一致，不顯示任何對話框
- 使用者關閉分頁後在 30 分鐘內重開：顯示 ResumeDialog，「繼續比賽」有焦點，Enter 後恢復比賽
- 使用者關閉瀏覽器後在 30 分鐘後重開：顯示 ResumeDialog，「開新局」有焦點，Enter 後清除資料進入 Setup Screen；使用者仍可點擊「繼續比賽」選擇恢復
- 使用者在 ResumeDialog 選「開新局」：Dialog 關閉，顯示 Setup Screen，localStorage 與 sessionStorage 資料已清除
- `screen === 'setup'` 或 `'game-over'` 時重整：行為不變（正常顯示 Setup Screen，無 Dialog）
- 使用者點選 rematch 或返回 Setup 後：localStorage 與 sessionStorage 資料清除；再次重整顯示 Setup Screen（無 Dialog）

**Interface / Data Shape:**

- localStorage key：`'pickleball_game'`，值為 `JSON.stringify(PersistedGameState)`
- `PersistedGameState.savedAt`：`Date.now()` 的整數毫秒值，每次 `saveGameState` 時更新
- sessionStorage key：`'pickleball_session'`，值為 `'1'`，進入 Game Screen 時設置，`clearGameState()` 時清除
- `SinglesGame.serialize()` 返回 `SerializedSinglesGame`（含 `type: 'singles'`）
- `DoublesGame.serialize()` 返回 `SerializedDoublesGame`（含 `type: 'doubles'`）
- `SinglesGame.fromSerialized(data: SerializedSinglesGame): SinglesGame` — 靜態工廠
- `DoublesGame.fromSerialized(data: SerializedDoublesGame): DoublesGame` — 靜態工廠
- `useGamePersistence()` hook 返回 `{ loadPersistedState, saveGameState, clearGameState, markSessionActive, isSessionActive }`
- `ResumeDialog` props：`config: SetupConfig`, `onResume: () => void`, `onNewGame: () => void`, `defaultAction: 'resume' | 'new-game'`

**Failure Modes:**

- `localStorage` parse 失敗（資料損壞）→ `loadPersistedState()` 捕捉 exception，回傳 `null`，並呼叫 `clearGameState()` 清除損壞資料，走正常 Setup 流程
- `localStorage` 不可用（如無痕模式限制）→ `saveGameState` / `clearGameState` 靜默失敗（try/catch），不影響 UI，不顯示 Dialog
- `sessionStorage` 不可用 → `markSessionActive` / `isSessionActive` 靜默失敗，`isSessionActive()` 預設回傳 `false`（保守地顯示 Dialog 而非靜默恢復）

**Acceptance Criteria:**

- 手動測試：Game Screen 中按 F5，重整後直接回到 Game Screen，比分正確，不出現 Dialog
- 手動測試：關閉分頁重開（< 30 分鐘）→ 出現 ResumeDialog，「繼續比賽」有焦點
- 手動測試：修改 localStorage 內 savedAt 為 2 小時前的時間戳記，重整 → 出現 ResumeDialog，「開新局」有焦點
- 手動測試：選「開新局」→ 顯示 Setup Screen，`localStorage.getItem('pickleball_game')` 為 `null`
- 手動測試：rematch 後重整，不出現 ResumeDialog
- 單元測試：`SinglesGame.serialize()` → `SinglesGame.fromSerialized()` 往返後所有 getter 返回值相同
- 單元測試：`DoublesGame.serialize()` → `DoublesGame.fromSerialized()` 往返後所有 getter 返回值相同
- 單元測試：`loadPersistedState()` 在 localStorage 含損壞 JSON 時回傳 `null`
- 單元測試：`markSessionActive()` 設置 sessionStorage key；`isSessionActive()` 在 flag 存在/不存在時回傳正確值
- 單元測試：`saveGameState()` 寫入的 JSON 包含 `savedAt` 數值欄位

**Scope Boundaries:**

- In scope：`SinglesGame` / `DoublesGame` 序列化介面、`useGamePersistence` hook（含 savedAt、session flag）、`ResumeDialog` defaultAction prop、`App.tsx` 的 session 偵測路由邏輯與時間戳記判斷
- Out of scope：Dialog 動畫效果、GameScreen 本身的狀態管理重構、gamesCount（多局制）實作、localStorage quota 管理、30 分鐘門檻的使用者自訂設定

## Risks / Trade-offs

- [Risk] `DoublesGame` / `SinglesGame` 私有 interface 若未來異動，序列化格式需同步更新 → Mitigation：序列化型別與 class 內部型別共用，型別異動時 TypeScript 編譯器提示不相容
- [Risk] Game class 以 mutation 更新，`useEffect` 依賴 game 物件參考才能觸發 → Mitigation：`GameScreen` 已在每次操作後呼叫 `setGame(g => g)`，設計沿用此模式
- [Risk] ResumeDialog 的 `autoFocus` 在部分行動裝置可能不被觸發 → Mitigation：主要觸控操作不依賴鍵盤焦點，Enter 快速確認僅為桌面端優化
- [Risk] `useState` lazy initializer 無法呼叫 setState → Mitigation：F5 靜默恢復透過初始 state 值直接設定（而非 handler 呼叫），需將 `rehydrateGame` 邏輯提前到 initializer 層
- [Risk] 無法區分「關閉單一分頁」與「關閉整個瀏覽器」→ Accepted：兩者皆清除 sessionStorage，以 savedAt 時間戳記判斷意圖，30 分鐘門檻為可接受的啟發式取捨
