## ADDED Requirements

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
