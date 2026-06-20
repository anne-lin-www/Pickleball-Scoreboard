# ui-game-over-screen Specification

## Purpose

The Game Over screen is displayed when a match ends (either by a team reaching the win condition or the operator pressing Reset). It announces the winner and provides a Rematch action to return the operator to the Setup screen.

## Requirements

### Requirement: Winner announcement

The Game Over screen SHALL prominently display the name of the winning team.

#### Scenario: Winner displayed on game end

- **WHEN** the Game Over screen is shown
- **THEN** the winning team's name SHALL be displayed in large, readable text as the primary content of the screen

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
### Requirement: Rematch action

The Game Over screen SHALL provide a Rematch button that returns the operator to the Setup screen.

#### Scenario: Rematch navigates to Setup

- **WHEN** the operator presses the Rematch button
- **THEN** the app SHALL transition to the Setup screen

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
### Requirement: Localized Game Over screen text

All static text on the Game Over screen SHALL use the active locale string via the `t` function from `LocaleContext`. The winner label and the rematch button SHALL be localized.

#### Scenario: Labels in zh-TW

- **WHEN** locale is `zh-TW` and the Game Over screen is displayed
- **THEN** the winner label SHALL display `勝利隊伍` and the rematch button SHALL display `再來一局`

#### Scenario: Labels in en

- **WHEN** locale is `en` and the Game Over screen is displayed
- **THEN** the winner label SHALL display `Winner` and the rematch button SHALL display `Rematch`

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