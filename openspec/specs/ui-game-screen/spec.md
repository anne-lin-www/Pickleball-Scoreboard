# ui-game-screen Specification

## Purpose

The Game screen is the main operational view during a match. It displays the court in a bird's-eye layout, shows the live score in pickleball's standard three-segment format, marks the current server, and provides the operator with scoring, undo, and reset controls.

## Requirements

### Requirement: Bird's-eye court layout

The Game screen SHALL display the court as a top-down (bird's-eye) view with the top team's half at the top of the viewport and the bottom team's half at the bottom, separated by a net indicator.

#### Scenario: Court fills main viewport

- **WHEN** the operator views the Game screen on a mobile device (portrait)
- **THEN** the court area SHALL occupy the majority of the visible viewport height

#### Scenario: Absolute coordinate positioning

- **WHEN** Team A is assigned to the top half of the court
- **THEN** Team A's RIGHT-side player SHALL appear on the left side of the screen and Team A's LEFT-side player SHALL appear on the right side of the screen (bird's-eye absolute: A faces south toward the net)

- **WHEN** Team B is assigned to the bottom half of the court
- **THEN** Team B's LEFT-side player SHALL appear on the left side of the screen and Team B's RIGHT-side player SHALL appear on the right side of the screen (bird's-eye absolute: B faces north toward the net)

##### Example: Doubles positions at score 0 (even — anchor on RIGHT)

- **GIVEN** Team A at top; Team A anchor player (isStartingRight=true) has score 0 (even)
- **THEN** anchor player SHALL appear on the screen-right position in Team A's half (A's LEFT side = screen-right in bird's-eye)

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Three-segment score display

The Game screen SHALL display the current score in pickleball's standard three-segment format for Doubles: `serving score – receiving score – server number`.

#### Scenario: Score call visible at a glance

- **WHEN** the operator views the Game screen
- **THEN** the three-segment score SHALL be displayed in large, readable text outside the court area

##### Example: Score call format

| Serving score | Receiving score | Server number | Display |
|--------------|----------------|---------------|---------|
| 6 | 4 | 1 | 6 – 4 – 1 |
| 0 | 0 | 2 | 0 – 0 – 2 |
| 10 | 10 | 1 | 10 – 10 – 1 |

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Serving player indicator

The Game screen SHALL mark the current server with a visible indicator (●) next to their name on the court.

#### Scenario: Server marked on court

- **WHEN** a player is the current server
- **THEN** a ● symbol SHALL appear adjacent to that player's name on the court display

#### Scenario: Non-servers unmarked

- **WHEN** a player is not the current server
- **THEN** no ● indicator SHALL appear next to their name

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Fixed scoring buttons

The Game screen SHALL display two fixed action buttons — one per team — for the operator to record which team won a rally.

#### Scenario: Buttons always visible

- **WHEN** the operator views the Game screen
- **THEN** Team A scoring button and Team B scoring button SHALL be visible outside the court area and reachable by thumb on a mobile device

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Undo action

The Game screen SHALL provide an Undo button that allows the operator to reverse the last recorded rally.

#### Scenario: Undo button present

- **WHEN** the operator views the Game screen
- **THEN** an Undo button SHALL be visible and tappable

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Reset action

The Game screen SHALL provide a Reset button to end the current game and navigate to the Game Over screen.

#### Scenario: Reset button present

- **WHEN** the operator views the Game screen
- **THEN** a Reset button SHALL be visible and tappable

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Tap-court scoring (opt-in)

The Game screen SHALL support an optional interaction mode where tapping the top or bottom half of the court records a point for the respective team. This mode SHALL be disabled by default and enabled only via a settings toggle.

#### Scenario: Default state — tap court disabled

- **WHEN** the operator has not enabled tap-court scoring in settings
- **THEN** tapping the court area SHALL produce no scoring action

#### Scenario: Enabled state — tap court records point

- **WHEN** tap-court scoring is enabled in settings
- **WHEN** the operator taps the top half of the court
- **THEN** the team assigned to the top half SHALL receive a point

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->


<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->

---
### Requirement: Responsive layout

The Game screen SHALL adapt its layout for mobile portrait, tablet, and desktop viewports without content overflow or illegible text.

#### Scenario: Mobile portrait (375px width)

- **WHEN** viewed on a 375px-wide viewport
- **THEN** court, score, and buttons SHALL all be visible without horizontal scrolling

#### Scenario: Tablet and desktop (768px+ width)

- **WHEN** viewed on a 768px or wider viewport
- **THEN** the layout SHALL use available horizontal space to increase court and score readability

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
-->

<!-- @trace
source: ui-layout-preview
updated: 2026-06-20
code:
  - index.html
  - screenshot-game-375.png
  - src/screens/GameScreen.tsx
  - postcss.config.ts
  - .playwright-mcp/page-2026-06-20T07-29-23-513Z.yml
  - src/App.tsx
  - src/screens/GameOverScreen.tsx
  - screenshot-rematch-back.png
  - src/index.css
  - .playwright-mcp/page-2026-06-20T07-36-04-849Z.yml
  - .playwright-mcp/page-2026-06-20T07-33-50-200Z.yml
  - .playwright-mcp/page-2026-06-20T07-35-10-110Z.yml
  - src/mock/gameState.ts
  - screenshot-game-375-fixed.png
  - .playwright-mcp/page-2026-06-20T07-35-15-864Z.yml
  - screenshot-game-375-v2.png
  - screenshot-setup-375.png
  - .playwright-mcp/page-2026-06-20T07-33-54-806Z.yml
  - package.json
  - .playwright-mcp/page-2026-06-20T07-31-44-398Z.yml
  - .playwright-mcp/page-2026-06-20T07-28-56-666Z.yml
  - .playwright-mcp/page-2026-06-20T07-25-42-720Z.yml
  - screenshot-game-768.png
  - src/screens/SetupScreen.tsx
  - screenshot-game-768-v2.png
  - src/vite-env.d.ts
  - tsconfig.json
  - vite.config.ts
  - .playwright-mcp/page-2026-06-20T07-31-39-557Z.yml
  - screenshot-gameover.png
  - tailwind.config.ts
  - .playwright-mcp/page-2026-06-20T07-35-54-823Z.yml
  - src/main.tsx
-->
---
### Requirement: Team-colored score display

The three-segment score SHALL display each team's score in that team's theme color using DaisyUI semantic tokens. Team A score SHALL use `text-primary` and Team B score SHALL use `text-secondary`. The server number SHALL use `text-accent`. In `midnight-pro` theme, `primary` resolves to `#818cf8` (indigo-400), `secondary` to `#fbbf24` (amber-400), and `accent` to `#34d399` (emerald-400). In `court-day` theme, `primary` resolves to `#4338ca` (indigo-700), `secondary` to `#b45309` (amber-700), and `accent` to `#047857` (emerald-700).

#### Scenario: Score colors in midnight-pro

- **WHEN** `midnight-pro` theme is active and Team A is serving with score 6–4–1
- **THEN** the `6` SHALL render in `#818cf8` (indigo), the `4` in `#fbbf24` (amber), and the `1` in `#34d399` (emerald)

#### Scenario: Score colors in court-day

- **WHEN** `court-day` theme is active and Team A is serving with score 6–4–1
- **THEN** the `6` SHALL render in `#4338ca` (indigo), the `4` in `#b45309` (amber), and the `1` in `#047857` (emerald)

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Localized UI text labels

All static text labels on the Game screen SHALL use the active locale string via the `t` function from `LocaleContext`. The net label, score sub-label, undo button, and reset button SHALL all be localized.

#### Scenario: Labels switch on locale change

- **WHEN** locale changes from `zh-TW` to `en` while on the Game screen
- **THEN** the net label SHALL change from `球網` to `Net`, the undo button from `↩ 復原` to `↩ Undo`, and the reset button from `重設` to `Reset`

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Themed court half backgrounds

The serving team's court half SHALL use a visually distinct background derived from the team's DaisyUI `primary` or `secondary` token at low opacity (`/10`). In `midnight-pro`, Team A serving half uses `bg-primary/10` (indigo tint on dark); Team B serving half uses `bg-secondary/10` (amber tint on dark). In `court-day`, the same classes apply but resolve to lighter indigo and amber tints on white. The non-serving half SHALL use `bg-base-100`.

#### Scenario: Serving half highlighted in midnight-pro

- **WHEN** Team A is serving in `midnight-pro` theme
- **THEN** Team A's court half SHALL have an indigo-tinted background (`bg-primary/10`) and Team B's half SHALL use `bg-base-100`

#### Scenario: Serving half highlighted in court-day

- **WHEN** Team B is serving in `court-day` theme
- **THEN** Team B's court half SHALL have an amber-tinted background (`bg-secondary/10`) and Team A's half SHALL use `bg-base-100`

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Font family on Game screen

All text on the Game screen SHALL use the unified font stack `Inter, Noto Sans TC, sans-serif`. Score numbers SHALL use `font-weight: 900` with `font-feature-settings: 'tnum'` (tabular numerals).

#### Scenario: Score numerals are tabular

- **WHEN** the operator views the Game screen
- **THEN** score digits SHALL be fixed-width (tabular) so the layout does not shift as numbers change

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Score button records rally in game engine

When the operator presses a team's +1 button, the Game screen SHALL call `winRally` on the game instance and update the displayed score, serving indicators, and player positions to reflect the new game state.

#### Scenario: Top team scores via button

- **WHEN** the operator presses the top team's +1 button
- **THEN** `winRally` SHALL be called with the top team's identifier
- **THEN** the score display SHALL update to reflect the new game state
- **THEN** serving indicators and player positions SHALL update if service changes

#### Scenario: Bottom team scores via button

- **WHEN** the operator presses the bottom team's +1 button
- **THEN** `winRally` SHALL be called with the bottom team's identifier
- **THEN** the score display SHALL update to reflect the new game state


<!-- @trace
source: ui-game-screen-wiring
updated: 2026-06-20
code:
  - src/core/gameInit.ts
  - design-preview-B.html
  - src/App.tsx
  - src/core/gameViewModel.ts
  - design-preview-A.html
  - src/screens/GameScreen.tsx
  - src/i18n/strings.ts
  - src/mock/gameState.ts
  - src/screens/SetupScreen.tsx
tests:
  - src/core/gameInit.test.ts
  - src/core/gameViewModel.test.ts
-->

---
### Requirement: Undo reverses last recorded rally

When the operator presses the Undo button, the Game screen SHALL call `undo` on the game instance and update all displayed state to reflect the reverted game state.

#### Scenario: Undo after a rally

- **WHEN** the operator presses the Undo button after at least one rally has been recorded
- **THEN** `game.undo()` SHALL be called
- **THEN** the score, serving team, server number, and player positions SHALL revert to the state before the last rally

#### Scenario: Undo at game start

- **WHEN** the operator presses the Undo button with no rally history
- **THEN** `game.undo()` SHALL be called without error
- **THEN** the displayed state SHALL remain unchanged


<!-- @trace
source: ui-game-screen-wiring
updated: 2026-06-20
code:
  - src/core/gameInit.ts
  - design-preview-B.html
  - src/App.tsx
  - src/core/gameViewModel.ts
  - design-preview-A.html
  - src/screens/GameScreen.tsx
  - src/i18n/strings.ts
  - src/mock/gameState.ts
  - src/screens/SetupScreen.tsx
tests:
  - src/core/gameInit.test.ts
  - src/core/gameViewModel.test.ts
-->

---
### Requirement: Tap-court scoring wires to game engine

When tap-court mode is enabled and the operator taps a court half, the Game screen SHALL call `winRally` for the tapped team, identical in outcome to pressing that team's +1 button.

#### Scenario: Court tap scores for tapped team

- **WHEN** tap-court mode is enabled and the operator taps the top court half
- **THEN** `winRally` SHALL be called with the top team's identifier
- **THEN** the game state SHALL update identically to pressing the top team's +1 button

<!-- @trace
source: ui-game-screen-wiring
updated: 2026-06-20
code:
  - src/core/gameInit.ts
  - design-preview-B.html
  - src/App.tsx
  - src/core/gameViewModel.ts
  - design-preview-A.html
  - src/screens/GameScreen.tsx
  - src/i18n/strings.ts
  - src/mock/gameState.ts
  - src/screens/SetupScreen.tsx
tests:
  - src/core/gameInit.test.ts
  - src/core/gameViewModel.test.ts
-->