## Context

設定畫面（`src/screens/SetupScreen.tsx`）目前採用純表單輸入，雙打模式以「球員一/球員二」標籤區分，場地方向以隊名按鈕選擇。操作人員站在球場旁的空間直覺（上半/下半）與現有抽象標籤不符。

此變更在雙打模式下新增球場圖輸入模式，並修正表單模式的兩個 UX 問題（預設值、首發提示位置）。兩種模式產出的 `SetupConfig` 結構完全相同，下游（`gameInit.ts`、`GameScreen.tsx`）不需修改。

## Goals / Non-Goals

**Goals:**

- 雙打模式新增球場圖輸入模式，讓操作人員按現場視角（上半/下半）填入資料
- 球場圖模式整合首發方選擇（點擊半區）與場地方向設定（上半 = topTeam）
- 修正表單模式：球員名字預設值改為空字串
- 修正表單模式：「球員二 = 首發」提示移至球員二輸入欄旁
- 兩種模式產出相同的 `SetupConfig`，不影響下游

**Non-Goals:**

- 不修改 `SetupConfig` 介面（不新增欄位）
- 不修改 `DoublesGame` 核心演算法
- 不支援球場圖內的拖曳互動
- 單打模式不加球場圖

## Decisions

### 球場圖提取為獨立元件 `CourtDiagramInput`

**決策**：球場圖 UI 邏輯封裝在 `src/components/CourtDiagramInput.tsx`，`SetupScreen` 透過 props 傳入目前的表單狀態並接收 onChange 回呼。

**理由**：`SetupScreen` 已有大量表單狀態，若將圖模式 inline 會讓元件超過 300 行難以維護；獨立元件也可複用 `GameScreen` 的球場圖視覺語言。

**替代方案**：inline 在 `SetupScreen`——被排除，原因是關注點混雜。

---

### 兩種模式共用相同的 state，切換不重置

**決策**：`setupInputMode`（`'form' | 'diagram'`）只控制渲染，底層 state（`teamAName`, `teamAPlayer1`, `topTeamId`, `firstServingTeam` 等）在切換時保留。

**理由**：避免切換時清空已輸入的資料，降低操作失誤風險。

**替代方案**：切換時重置——被排除，會造成資料遺失。

---

### 球場圖上半對應 topTeamId，以 UI state 推導

**決策**：球場圖模式中，上半的隊名輸入欄代表 `topTeamId = 'TEAM_A'`，下半代表 `topTeamId = 'TEAM_B'`。若使用者在圖模式填了上半 Team A、下半 Team B，切回表單時「球場方向」按鈕自動反映此值。

**理由**：`topTeamId` 已是 `SetupConfig` 的一部分，不需新增欄位；球場圖視覺上已經傳達「上半 = top」語義，不需額外說明。

---

### 首發方選擇：點擊半區高亮，不另設按鈕

**決策**：球場圖模式中，點擊上半或下半區域 → 設定該隊為 `firstServingTeam`，同時以 `bg-primary/10` 或 `bg-secondary/10` 高亮（沿用 `GameScreen` 的視覺語言）。「首先發球」按鈕列在圖模式下隱藏。

**理由**：點擊互動比額外按鈕更直覺；高亮色與比賽畫面一致，降低學習成本。

---

### 表單模式的「球員二 = 首發」提示位置

**決策**：將 `initialServer` 提示文字從「首先發球」section 移至球員二輸入欄正下方（inline hint），對兩隊各自顯示。

**理由**：提示與輸入欄空間相鄰，資訊關聯性更明確。

## Implementation Contract

### `CourtDiagramInput` 元件介面

```ts
interface CourtDiagramInputProps {
  teamAName: string
  teamBName: string
  teamAPlayer1: string
  teamAPlayer2: string
  teamBPlayer1: string
  teamBPlayer2: string
  topTeamId: TeamId          // 'TEAM_A' = 上半是 A, 'TEAM_B' = 上半是 B
  firstServingTeam: TeamId
  onChange: (patch: Partial<CourtDiagramInputState>) => void
}

type CourtDiagramInputState = Pick<SetupConfig,
  'teamAName' | 'teamBName' |
  'teamAPlayer1' | 'teamAPlayer2' |
  'teamBPlayer1' | 'teamBPlayer2' |
  'topTeamId' | 'firstServingTeam'
>
```

`onChange` 以 partial patch 呼叫，`SetupScreen` 以 spread 合併至現有 state。

### 球場圖版面結構

```
┌──────────────────────────────────┐
│  [隊名輸入欄]          (上半隊)  │  ← topTeamId 所指的隊
│  ┌────────────┬────────────┐     │
│  │  [左球員]  │  [右球員]  │     │  ← 點擊此半區 = 設為首發（高亮）
│  └────────────┴────────────┘     │
├──────────── 球網 ────────────────┤
│  ┌────────────┬────────────┐     │
│  │  [左球員]  │  [右球員]  │     │  ← 點擊此半區 = 設為首發（高亮）
│  └────────────┴────────────┘     │
│  [隊名輸入欄]          (下半隊)  │
└──────────────────────────────────┘
```

左欄 = Player 1（`isStartingRight: false`，起始左側）
右欄 = Player 2（`isStartingRight: true`，起始右側，首發）

### `SetupConfig` 不變

兩種模式最終產出的 `SetupConfig` 欄位、型別完全相同。`gameInit.ts` 和 `GameScreen` 不需任何修改。

### 表單模式球員 state 預設值

`SetupScreen` 中 `teamAPlayer1`、`teamAPlayer2`、`teamBPlayer1`、`teamBPlayer2` 的 `useState` 初始值由 `'Player 1'` / `'Player 2'` 改為空字串 `''`。

### 驗收條件

1. 雙打模式下出現「表單 / 球場圖」切換，單打模式下不出現
2. 切換模式時，已輸入的隊名/球員名字不被清除
3. 球場圖模式中：點擊上半 → 上半高亮，`firstServingTeam` = 上半隊；點擊下半同理
4. 球場圖模式中：「首先發球」按鈕列不顯示；「球場方向」按鈕不顯示
5. 兩種模式點擊「開始比賽」產出的 `SetupConfig` 結構一致
6. 表單模式：球員輸入欄初始為空（非 "Player 1"）

## Risks / Trade-offs

- **[觸控目標大小]** 球場圖格子在小螢幕可能太小難以點擊 → 設定最小高度（`min-h`）確保觸控面積
- **[i18n 新增字串]** 需同步更新 `zh-TW` 和 `en` 兩個 locale → tasks 中明確列出需新增的字串 key
