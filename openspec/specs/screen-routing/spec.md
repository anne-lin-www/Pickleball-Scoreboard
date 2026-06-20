# screen-routing Specification

## Purpose

TBD - created by archiving change 'ui-setup-screen-wiring'. Update Purpose after archive.

## Requirements

### Requirement: App stores game instance after setup

After the operator submits the setup form, the App SHALL create and store a game instance alongside the SetupConfig so both are available to downstream screens.

#### Scenario: Game instance is created on form submission

- **WHEN** the operator submits the Setup form
- **THEN** App SHALL call `createGame(config)` and store the resulting instance in state
- **THEN** App SHALL transition to the game screen

#### Scenario: GameScreen receives game instance and config

- **WHEN** App renders the game screen
- **THEN** GameScreen SHALL receive both the game instance and the SetupConfig as props

#### Scenario: No game instance before setup is complete

- **WHEN** App first loads and no setup has been submitted
- **THEN** App SHALL render the Setup screen and game instance SHALL be null

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