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
### Requirement: Player name input labels in Doubles mode

In Doubles mode, each team's player name input fields SHALL display a label that identifies the player's serving order role. The label SHALL be visible above or adjacent to the input field.

- Player 1 input label: 「球員一（1位）」 / "Player 1"
- Player 2 input label: 「球員二（2位）」 / "Player 2"

#### Scenario: Labels shown in Doubles mode

- **WHEN** the operator selects Doubles mode
- **THEN** each team SHALL show two labeled player inputs: Player 1 (1位) and Player 2 (2位)

#### Scenario: Labels hidden in Singles mode

- **WHEN** the operator selects Singles mode
- **THEN** only one player input per team is shown (no Player 2 label visible)


<!-- @trace
source: fix-player-1-2-convention
updated: 2026-06-20
code:
  - design-preview-A.html
  - src/i18n/strings.ts
  - src/screens/SetupScreen.tsx
  - design-preview-B.html
  - src/core/doubles/DoublesGame.ts
tests:
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: First serving team selection

The Setup screen SHALL provide a control for the operator to choose which team serves first.

In form mode, the control SHALL be a button row displaying the two team names.

In court diagram mode, the serving team SHALL be selected by tapping a court half (see `setup-court-diagram-input` spec). The button row SHALL NOT be shown in diagram mode.

#### Scenario: Serving team options in form mode

- **WHEN** form mode is active
- **THEN** two buttons SHALL be available: Team A serves first, Team B serves first

#### Scenario: Serving team selection in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the serving team button row SHALL NOT be visible; serving team is selected by tapping a court half


<!-- @trace
source: setup-screen-court-diagram-mode
updated: 2026-07-05
code:
  - design-preview-A.html
  - src/screens/SetupScreen.tsx
  - src/i18n/strings.ts
  - src/components/CourtDiagramInput.tsx
  - design-preview-B.html
-->

---
### Requirement: Initial server info display

The Setup screen SHALL display a dynamic info hint identifying the player who will serve first. In form mode, the hint SHALL appear directly below the Player 2 name input field for the first-serving team, adjacent to that input, rather than below the first-serve selector. In court diagram mode, the hint is replaced by the visual highlight on the selected court half and SHALL NOT be shown as a separate text element.

The hint text SHALL be: 「開局發球者：{team name} 球員二（Player 2）」 (zh-TW)

The hint SHALL update immediately when the operator changes the first-serving team selection.

#### Scenario: Info hint shown adjacent to Player 2 input in form mode

- **WHEN** form mode is active and the operator selects Team A as the first serving team
- **THEN** the hint 「開局發球者：{Team A name} 球員二（Player 2）」 SHALL appear directly below the Team A Player 2 input field

- **WHEN** form mode is active and the operator switches to Team B as the first serving team
- **THEN** the hint SHALL move to appear below Team B's Player 2 input and SHALL NOT appear below Team A's Player 2 input

#### Scenario: Info hint hidden in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the initial server text hint SHALL NOT be shown

#### Scenario: Hint only shown in Doubles mode

- **WHEN** Singles mode is active
- **THEN** the initial server hint SHALL NOT be shown


<!-- @trace
source: setup-screen-court-diagram-mode
updated: 2026-07-05
code:
  - design-preview-A.html
  - src/screens/SetupScreen.tsx
  - src/i18n/strings.ts
  - src/components/CourtDiagramInput.tsx
  - design-preview-B.html
-->

---
### Requirement: Court orientation setting

The Setup screen SHALL allow the operator to choose which team appears at the top of the game screen.

In form mode, the control SHALL be a button row (Team A on Top / Team B on Top).

In court diagram mode, the top half of the diagram implicitly defines the top team. The orientation button row SHALL NOT be shown in diagram mode.

#### Scenario: Default court orientation

- **WHEN** the operator has not changed the orientation setting
- **THEN** Team A SHALL appear at the top by default

#### Scenario: Swapping court orientation in form mode

- **WHEN** form mode is active and the operator selects Team B at the top
- **THEN** Team B SHALL appear at the top half of the court on the Game screen and Team A at the bottom

#### Scenario: Court orientation in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the orientation button row SHALL NOT be visible; the team entered in the top half of the diagram defines the top team


<!-- @trace
source: setup-screen-court-diagram-mode
updated: 2026-07-05
code:
  - design-preview-A.html
  - src/screens/SetupScreen.tsx
  - src/i18n/strings.ts
  - src/components/CourtDiagramInput.tsx
  - design-preview-B.html
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

---
### Requirement: Games count selection control

The Setup screen SHALL include a games count selection control, displayed before the Start Game button, allowing the operator to choose between 1 game and Best of 3 games. The default selection SHALL be 1 game. The active selection SHALL use `btn-primary` styling, consistent with other selection controls on the Setup screen.

#### Scenario: Default games count on load

- **WHEN** the operator opens the Setup screen
- **THEN** the games count control SHALL be visible and default to "1 game" with the `btn-primary` active style

#### Scenario: Operator selects Best of 3

- **WHEN** the operator selects "Best of 3" on the games count control
- **THEN** the control SHALL reflect the selection with `btn-primary` active style and the submitted SetupConfig SHALL contain `gamesCount: 3`

##### Example: games count submitted values

| Selection | SetupConfig.gamesCount |
|-----------|------------------------|
| 1 game    | 1                      |
| Best of 3 | 3                      |

<!-- @trace
source: fix-ui-preview-bugs
updated: 2026-06-20
code:
  - src/core/gameViewModel.ts
  - src/screens/SetupScreen.tsx
  - design-preview-B.html
  - src/screens/GameScreen.tsx
  - src/core/doubles/DoublesGame.ts
  - design-preview-A.html
tests:
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Input mode toggle control in Doubles

The Setup screen SHALL display a segmented toggle control ("表單" / "球場圖" in zh-TW; "Form" / "Court" in en) in Doubles mode, placed between the game mode selector and the team/player input area. This toggle SHALL control whether form mode or court diagram mode is used for team and player name entry.

#### Scenario: Toggle appears only in Doubles mode

- **WHEN** the operator selects Doubles mode
- **THEN** the input mode toggle SHALL be visible

- **WHEN** the operator selects Singles mode
- **THEN** the input mode toggle SHALL NOT be visible


<!-- @trace
source: setup-screen-court-diagram-mode
updated: 2026-07-05
code:
  - design-preview-A.html
  - src/screens/SetupScreen.tsx
  - src/i18n/strings.ts
  - src/components/CourtDiagramInput.tsx
  - design-preview-B.html
-->

---