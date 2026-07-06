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

#### Scenario: No game instance before setup is complete and no persisted state

- **WHEN** App first loads and no setup has been submitted and `localStorage['pickleball_game']` is absent
- **THEN** App SHALL render the Setup screen and game instance SHALL be null


<!-- @trace
source: game-state-persistence
updated: 2026-06-20
code:
  - src/components/ResumeDialog.tsx
  - design-preview-B.html
  - package.json
  - src/App.tsx
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
  - src/hooks/useGamePersistence.ts
  - design-preview-A.html
tests:
  - src/hooks/useGamePersistence.test.ts
  - src/core/doubles/DoublesGame.test.ts
  - src/core/singles/SinglesGame.test.ts
-->

---
### Requirement: App routes to Game Screen when persisted state exists

When the user confirms via ResumeDialog, the App SHALL reconstruct the game from persisted state and route to the Game Screen, bypassing the Setup Screen.

#### Scenario: Silent routing to Game Screen on F5 (session active)

- **GIVEN** `localStorage['pickleball_game']` contains valid JSON and `sessionStorage['pickleball_session']` is `'1'`
- **WHEN** the App mounts
- **THEN** the App SHALL render the Game Screen directly with the restored game instance and config
- **THEN** the App SHALL NOT render the Setup Screen or any dialog

#### Scenario: Routing to Game Screen after user confirms resume

- **WHEN** the App has shown the ResumeDialog and the user confirms "Resume"
- **THEN** the App SHALL render the Game Screen with the restored game instance and config
- **THEN** the App SHALL NOT render the Setup Screen
- **THEN** the ResumeDialog SHALL no longer be visible

#### Scenario: Routing stays on Setup Screen when user picks new game

- **WHEN** the App has shown the ResumeDialog and the user selects "New Game"
- **THEN** the App SHALL remain on the Setup Screen
- **THEN** the ResumeDialog SHALL no longer be visible

<!-- @trace
source: ui-setup-screen-wiring, game-state-persistence
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

<!-- @trace
source: game-state-persistence
updated: 2026-06-20
code:
  - src/components/ResumeDialog.tsx
  - design-preview-B.html
  - package.json
  - src/App.tsx
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
  - src/hooks/useGamePersistence.ts
  - design-preview-A.html
tests:
  - src/hooks/useGamePersistence.test.ts
  - src/core/doubles/DoublesGame.test.ts
  - src/core/singles/SinglesGame.test.ts
-->

---
### Requirement: Mid-game setup screen routing

The App SHALL support a `mid-game-setup` screen state. When the operator taps "中途接續現況計分" on `SetupScreen`, the App SHALL transition to `MidGameSetupScreen`. When the operator completes mid-game setup, the App SHALL transition directly to `GameScreen` using the game object built by `buildMidGameState`. When the operator navigates back from `MidGameSetupScreen`, the App SHALL return to `SetupScreen`.

#### Scenario: Transitioning to mid-game setup

- **WHEN** the operator taps "中途接續現況計分" on SetupScreen
- **THEN** App SHALL render `MidGameSetupScreen`
- **THEN** `SetupScreen` SHALL no longer be visible

#### Scenario: Completing mid-game setup starts the game

- **WHEN** the operator submits `MidGameSetupScreen`
- **THEN** App SHALL call `buildMidGameState(input)` and store the resulting game instance
- **THEN** App SHALL call `markSessionActive()` and `saveGameState(config, game)`
- **THEN** App SHALL transition to `GameScreen`

#### Scenario: Navigating back from mid-game setup

- **WHEN** the operator taps back on `MidGameSetupScreen`
- **THEN** App SHALL return to `SetupScreen`
- **THEN** no game instance SHALL be created

#### Scenario: Mid-game state is persisted like a normal game

- **WHEN** the operator starts a mid-game and the page is refreshed
- **THEN** the existing persistence and resume behavior SHALL apply identically to a normally started game

<!-- @trace
source: mid-game-start
updated: 2026-07-05
code:
  - src/screens/MidGameSetupScreen.tsx
  - design-preview-B.html
  - src/App.tsx
  - src/components/CourtDiagramInput.tsx
  - design-preview-A.html
  - src/i18n/strings.ts
  - src/screens/SetupScreen.tsx
  - src/core/midGameStateBuilder.ts
tests:
  - src/core/midGameStateBuilder.test.ts
-->