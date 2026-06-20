# ui-setup-screen Specification

## Purpose

The Setup screen is the entry point of the app. It collects match configuration from the operator before the game begins: game mode (Doubles or Singles), team and player names, which team serves first, and the visual court orientation.

## Requirements

### Requirement: Mode selection

The Setup screen SHALL display a toggle control allowing the operator to select between Doubles and Singles mode before the match begins.

#### Scenario: Default mode on load

- **WHEN** the operator opens the app for the first time
- **THEN** Doubles mode SHALL be selected by default

#### Scenario: Switching modes updates player fields

- **WHEN** the operator switches to Singles mode
- **THEN** the player name input fields SHALL reduce to one per team (Player 1 only)

- **WHEN** the operator switches to Doubles mode
- **THEN** the player name input fields SHALL show two per team (Player 1 and Player 2)

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
### Requirement: Team and player name entry

The Setup screen SHALL provide text input fields for team names and player names.

#### Scenario: Doubles mode fields

- **WHEN** Doubles mode is active
- **THEN** the form SHALL display: Team A name, Team A Player 1 name, Team A Player 2 name, Team B name, Team B Player 1 name, Team B Player 2 name

#### Scenario: Singles mode fields

- **WHEN** Singles mode is active
- **THEN** the form SHALL display: Team A name, Team A Player 1 name, Team B name, Team B Player 1 name

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
### Requirement: First serving team selection

The Setup screen SHALL provide a control for the operator to choose which team serves first.

#### Scenario: Serving team options

- **WHEN** the operator views the Setup screen
- **THEN** two options SHALL be available: Team A serves first, Team B serves first

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
### Requirement: Court orientation setting

The Setup screen SHALL allow the operator to choose which team appears at the top of the game screen, establishing the visual orientation of the court relative to the operator's physical position.

#### Scenario: Default court orientation

- **WHEN** the operator has not changed the orientation setting
- **THEN** Team A SHALL appear at the top of the game screen by default

#### Scenario: Swapping court orientation

- **WHEN** the operator selects Team B at the top
- **THEN** Team B SHALL appear at the top half of the court on the Game screen and Team A at the bottom

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
### Requirement: Start match action

The Setup screen SHALL provide a button to proceed to the Game screen.

#### Scenario: Proceed to game

- **WHEN** the operator presses the start match button
- **THEN** the app SHALL transition to the Game screen displaying the court with the configured team and player names

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
### Requirement: ThemeToggle and LangToggle controls on Setup screen

The Setup screen SHALL render a `ThemeToggle` button and a `LangToggle` button in the top-right area of the screen. Both controls SHALL be visible without scrolling on a 375px-wide mobile viewport.

#### Scenario: Both controls visible on load

- **WHEN** the operator opens the Setup screen
- **THEN** a theme toggle button and a language toggle button SHALL both be visible in the top-right area of the screen

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
### Requirement: Localized Setup screen labels

All static text labels and button captions on the Setup screen SHALL use the active locale string via the `t` function from `LocaleContext`. This includes the mode toggle, team name inputs, player name inputs, first serve selector, court orientation selector, and the start match button.

#### Scenario: Labels switch on locale change

- **WHEN** locale changes from `zh-TW` to `en` while on the Setup screen
- **THEN** the start button SHALL change from `開始比賽` to `Start Match` and all form labels SHALL switch to their English equivalents

#### Scenario: zh-TW default on first load

- **WHEN** no locale preference is stored in localStorage
- **THEN** all Setup screen labels SHALL display in Traditional Chinese

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