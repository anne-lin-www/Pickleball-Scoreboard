# setup-form-state Specification

## Purpose

TBD - created by archiving change 'ui-setup-screen-wiring'. Update Purpose after archive.

## Requirements

### Requirement: Games count selection

The Setup screen SHALL provide a control allowing the operator to select the number of games in the match (1 or 3) before starting.

#### Scenario: Default games count on load

- **WHEN** the operator opens the Setup screen
- **THEN** the games count control SHALL default to 1 game

#### Scenario: Selecting games count

- **WHEN** the operator selects "Best of 3" on the games count control
- **THEN** the control SHALL reflect the selection and the submitted SetupConfig SHALL contain `gamesCount: 3`

##### Example: games count values

| Selection | SetupConfig.gamesCount |
|-----------|------------------------|
| 1 game    | 1                      |
| Best of 3 | 3                      |

<!-- @trace
source: ui-setup-screen-wiring
updated: 2026-06-20
code:
  - src/core/gameInit.ts
  - design-preview-B.html
  - src/App.tsx
  - src/core/gameViewModel.ts
  - src/i18n/strings.ts
  - src/mock/gameState.ts
  - src/screens/SetupScreen.tsx
  - design-preview-A.html
  - src/screens/GameScreen.tsx
tests:
  - src/core/gameViewModel.test.ts
  - src/core/gameInit.test.ts
-->