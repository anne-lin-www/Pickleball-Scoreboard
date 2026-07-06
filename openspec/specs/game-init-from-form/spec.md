# game-init-from-form Specification

## Purpose

TBD - created by archiving change 'ui-setup-screen-wiring'. Update Purpose after archive.

## Requirements

### Requirement: Create game instance from setup config

The system SHALL provide a pure function `createGame(config: SetupConfig)` in `src/core/gameInit.ts` that maps a validated SetupConfig to the appropriate game engine instance.

#### Scenario: Doubles mode creates DoublesGame

- **WHEN** `createGame` is called with `config.mode === 'doubles'`
- **THEN** the function SHALL return a `DoublesGame` instance

#### Scenario: Singles mode creates SinglesGame

- **WHEN** `createGame` is called with `config.mode === 'singles'`
- **THEN** the function SHALL return a `SinglesGame` instance

#### Scenario: Player IDs are derived from fixed identifiers

- **WHEN** `createGame` is called with any valid config
- **THEN** the doubles game instance SHALL use player IDs `TEAM_A_P1`, `TEAM_A_P2`, `TEAM_B_P1`, `TEAM_B_P2`
- **THEN** the singles game instance SHALL use player IDs `TEAM_A_P1`, `TEAM_B_P1`

##### Example: player ID mapping

| mode     | player IDs used                                          |
|----------|----------------------------------------------------------|
| doubles  | TEAM_A_P1, TEAM_A_P2, TEAM_B_P1, TEAM_B_P2              |
| singles  | TEAM_A_P1, TEAM_B_P1                                     |

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

---
### Requirement: Mid-game game object construction path

The system SHALL provide a `buildMidGameState(input: MidGameInput)` function in `src/core/midGameStateBuilder.ts` as a second game construction path alongside the existing `createGame(config: SetupConfig)` in `src/core/gameInit.ts`. Both paths SHALL produce a `DoublesGame | SinglesGame` instance accepted by `GameScreen`.

#### Scenario: Mid-game path produces compatible game object

- **WHEN** `buildMidGameState` is called with valid doubles input
- **THEN** the returned `DoublesGame` instance SHALL be accepted as a valid `game` prop by `GameScreen`
- **THEN** `deriveViewModel(game, config)` SHALL produce a valid `GameViewModel` without errors

- **WHEN** `buildMidGameState` is called with valid singles input
- **THEN** the returned `SinglesGame` instance SHALL be accepted as a valid `game` prop by `GameScreen`

#### Scenario: Player IDs are identical between both paths

- **WHEN** `buildMidGameState` is called with doubles input
- **THEN** player IDs SHALL be `TEAM_A_P1`, `TEAM_A_P2`, `TEAM_B_P1`, `TEAM_B_P2`

- **WHEN** `buildMidGameState` is called with singles input
- **THEN** player IDs SHALL be `TEAM_A_P1`, `TEAM_B_P1`

##### Example: player ID convention

| path              | mode    | player IDs                               |
|-------------------|---------|------------------------------------------|
| createGame        | doubles | TEAM_A_P1, TEAM_A_P2, TEAM_B_P1, TEAM_B_P2 |
| buildMidGameState | doubles | TEAM_A_P1, TEAM_A_P2, TEAM_B_P1, TEAM_B_P2 |
| createGame        | singles | TEAM_A_P1, TEAM_B_P1                    |
| buildMidGameState | singles | TEAM_A_P1, TEAM_B_P1                    |

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