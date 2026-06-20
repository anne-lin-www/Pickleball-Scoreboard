## Context

UI v1 使用 DaisyUI 預設 `light` 主題及硬編碼英文字串。記分板的主要使用情境是球場現場操作，包含戶外強光（需淺色高對比）與室內弱光（需深色低光）兩種環境；目標使用族群以繁體中文使用者為主，需要正確的 CJK 字體與在地化字串。

當前字體：Tailwind 預設系統字體堆疊，未引入 Google Fonts。

## Goals / Non-Goals

**Goals:**
- 提供 淺色（Court Day）/ 深色（Midnight Pro）主題切換，偏好以 `localStorage` 持久化
- 提供 zh-TW / en 語言切換，偏好以 `localStorage` 持久化
- 統一全站字體為 Inter + Noto Sans TC（Google Fonts CDN）
- 主題色彩系統以 DaisyUI 自訂主題定義，避免大量 CSS 自訂變數散落各元件
- 視覺差異調校：淺色主題線框加重、深色主題 net 使用低對比度調

**Non-Goals:**
- 不根據 `prefers-color-scheme` 自動套用主題（避免自動切換與手動選擇衝突）
- 不根據 `navigator.language` 自動選擇語言
- 不引入第三方 i18n 套件（react-i18next 等）
- 不實作主題切換動畫
- 不修改 `src/core/` 任何邏輯

## Decisions

### 主題實作：DaisyUI 自訂多主題 + data-theme attribute

**選擇**：在 `tailwind.config.ts` 的 `daisyui.themes` 定義兩組自訂主題（`court-day` 淺色、`midnight-pro` 深色），透過 `<html data-theme="...">` 切換。

**為何不用 Tailwind dark: 類別**：`dark:` 需要在每個元件手動加上兩套 class，維護成本高；DaisyUI 主題統一由設計 token 決定，元件代碼不需改動。

**為何不用 CSS 自訂變數方案**：DaisyUI 本身就是以 CSS 自訂變數實作主題，使用其主題系統即等同於此方案，且可直接取用 DaisyUI 元件的語意色名（`bg-base-100`、`text-primary` 等）。

### 語言實作：靜態字串物件 + React Context

**選擇**：`src/i18n/strings.ts` 定義 `Strings` 型別及 `STRINGS` 物件（含 `zh-TW` 與 `en` 兩組），`LocaleContext` 提供 `{ locale, setLocale, t }` hook，`t(key)` 回傳對應字串。

**為何不用 i18n 函式庫**：全站字串數量約 20–30 組，靜態物件即可覆蓋，無複數/格式化需求；零依賴，bundle size 最小化。

### 字體統一：Inter + Noto Sans TC via Google Fonts

**選擇**：`index.html` 引入 Google Fonts（Inter 400/600/700/900 + Noto Sans TC 400/600/700/900），`tailwind.config.ts` 設 `fontFamily.sans` 覆蓋為 `['Inter', 'Noto Sans TC', 'sans-serif']`。

**分數數字**：Inter 900 `tabular-nums`，深色主題以隊伍色彩顯示，淺色主題同樣以隊伍色彩顯示（深色版本）。

**為何不用 Bebas Neue**：Bebas Neue 僅支援拉丁字母，不含 CJK；Inter 900 對數字排版已足夠清晰。

### ThemeToggle / LangToggle 放置位置

兩個切換控件置於 `SetupScreen`（開局前設定頁）右上角，比賽進行中（`GameScreen`）不顯示切換按鈕，避免操作干擾。

### 隊伍識別色配色方案：Indigo Pro（靛 + 琥珀 + 祖母綠）

**選擇**：三色分別對應 Team A（靛藍）、Team B（琥珀）、發球指示（祖母綠），作為互相獨立的語意角色。

**為何不用藍/橙/綠（Field Blue）方案**：橙色（orange-400 hue≈26°）在淺色主題要達到 WCAG AA 對比度，必須壓深至 orange-700（hue≈18°），再加上原先設計曾用紅色（hue≈4°）替代，跨主題色相漂移最高達 20°，操作者會感知為「Team B 顏色換了」。

**為何選靛藍而非標準藍**：靛藍（indigo）在 2024–2025 運動品牌中取代傳統海軍藍成為主流，視覺質感較深，適合精品運動俱樂部定位；深/淺主題色相漂移僅 3°（indigo-400 → indigo-700），一致性最佳。

**為何選琥珀（amber）作為 Team B**：琥珀色（hue 25–36°）與靛藍（hue 246°）色相差 210°+，視覺區分最大化；amber-400（dark）→ amber-700（light）色相漂移僅 11°，主題切換後仍是「同一種顏色」感；金黃調性在運動場合中立、全齡友善。

**為何發球指示用祖母綠（emerald）而非原方案的琥珀**：三色（靛/琥珀/祖母綠）色相分布：246° / 36° / 152°，任意兩色最小間距 94°，均勻分布於色輪；綠色有「進行中/啟動」的普遍語意，適合「當前發球方」的功能角色；祖母綠（emerald）與草綠（green）相比質感更精緻，在深色主題尤其通透。

**色相漂移彙整**（深色 → 淺色，越小越好）：

| 角色 | 深色 | 淺色 | 色相漂移 |
|------|------|------|---------|
| Team A primary | indigo-400 hue 246° | indigo-700 hue 243° | 3° |
| Team B secondary | amber-400 hue 36° | amber-700 hue 25° | 11° |
| Serving accent | emerald-400 hue 153° | emerald-700 hue 152° | 1° |

## Implementation Contract

**主題切換行為**：
- `<html>` 的 `data-theme` attribute 在 `court-day` 與 `midnight-pro` 之間切換
- 切換後立即生效（無動畫），整頁色彩隨 DaisyUI 主題 token 更新
- `localStorage.getItem('pb-theme')` 回傳 `'court-day'` 或 `'midnight-pro'`，重新整理後自動還原

**語言切換行為**：
- 所有 UI 字串（標籤、按鈕、說明文字）即時切換為選定語言
- `localStorage.getItem('pb-locale')` 回傳 `'zh-TW'` 或 `'en'`，重新整理後自動還原
- 切換語言不影響計分狀態

**ThemeContext 介面**：
```ts
interface ThemeContextValue {
  theme: 'court-day' | 'midnight-pro'
  toggleTheme: () => void
}
```

**LocaleContext 介面**：
```ts
type Locale = 'zh-TW' | 'en'
interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof Strings) => string
}
```

**Strings 型別**（字串 key 對照表，需涵蓋所有 UI 文字）：
- Setup 畫面：`gameMode`、`doublesMode`、`singlesMode`、`teamName`、`player1`、`player2`、`firstServe`、`courtOrientation`、`startGame`
- Game 畫面：`net`、`serving`、`scoreLabel`（發球方–接球方–發球序號）、`undo`、`reset`
- GameOver 畫面：`winner`、`rematch`

**DaisyUI 主題 token 對應**（兩組主題需定義的 token，採 Indigo Pro 配色方案）：

| Token | court-day | midnight-pro |
|---|---|---|
| `primary` | `#4338ca`（Team A 靛藍 indigo-700） | `#818cf8`（Team A 靛藍 indigo-400） |
| `secondary` | `#b45309`（Team B 琥珀 amber-700） | `#fbbf24`（Team B 琥珀 amber-400） |
| `accent` | `#047857`（發球 emerald-700） | `#34d399`（發球 emerald-400） |
| `base-100` | `#ffffff` | `#0f172a` |
| `base-200` | `#f1f5f9` | `#1e293b` |
| `base-300` | `#e2e8f0` | `#334155` |
| `base-content` | `#0f172a` | `#f1f5f9` |

**驗收標準**：
1. 點擊 ThemeToggle 後，`<html data-theme>` 值改變，整頁色彩即時更新
2. 重新整理後主題偏好自動還原（`localStorage` 讀取正確）
3. 點擊 LangToggle 後，SetupScreen / GameScreen / GameOverScreen 所有文字標籤即時切換
4. 重新整理後語言偏好自動還原
5. 深色主題下，分數數字：Team A `#818cf8`（靛藍）、Team B `#fbbf24`（琥珀）、發球序號 `#34d399`（祖母綠）；淺色主題下：Team A `#4338ca`（靛藍）、Team B `#b45309`（琥珀）、發球序號 `#047857`（祖母綠）
6. 兩種主題的分數數字、玩家名稱、按鈕文字均清晰可辨（目視檢查）

**範圍邊界**：
- 在範圍內：ThemeContext、LocaleContext、strings.ts、ThemeToggle、LangToggle、三個 Screen 的文字 key 替換、tailwind.config.ts 主題設定、index.html 字體引入、index.css 字體設定
- 範圍外：`src/core/` 任何邏輯、計分狀態、App.tsx routing 邏輯（僅加 Provider 包裹）

## Risks / Trade-offs

- **Google Fonts CDN 依賴** → 離線或網路不穩時字體退回系統字體。接受此風險（記分板主要在有網路的場館使用）。
- **DaisyUI token 覆蓋方式** → DaisyUI v3 的主題設定格式與 v4 不同（v3 用 `daisyui.themes` 陣列）。需確認使用的是 v3 格式，避免設定失效。
- **localStorage 與 SSR** → 本專案為純 CSR（Vite + GitHub Pages），無 SSR 問題。
- **Noto Sans TC 字重** → 只需引入 400/600/700/900，避免引入全部字重造成載入過慢。
