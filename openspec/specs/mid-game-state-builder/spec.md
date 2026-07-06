# mid-game-state-builder Specification

## Purpose

TBD - created by archiving change 'mid-game-start'. Update Purpose after archive.

## Requirements

### Requirement: buildMidGameState pure function

The system SHALL provide a pure function `buildMidGameState(input: MidGameInput): DoublesGame | SinglesGame` in `src/core/midGameStateBuilder.ts`. The function SHALL construct a valid game object representing the mid-game state by assembling a serialized state and calling `fromSerialized()`. It SHALL not mutate any external state.

#### Scenario: Doubles input produces DoublesGame

- **WHEN** `buildMidGameState` is called with `input.mode === 'doubles'`
- **THEN** the function SHALL return a `DoublesGame` instance
- **THEN** `game.getScoreCall()` SHALL return `"${servingTeamScore}-${receivingTeamScore}-${serverNumber}"`
- **THEN** `game.getServingTeam()` SHALL equal `input.servingTeamId`

#### Scenario: Singles input produces SinglesGame

- **WHEN** `buildMidGameState` is called with `input.mode === 'singles'`
- **THEN** the function SHALL return a `SinglesGame` instance
- **THEN** `game.getScoreCall()` SHALL return `"${servingTeamScore}-${receivingTeamScore}"`
- **THEN** `game.getServingPlayer()` SHALL equal the player ID of `input.servingTeamId`


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

---
### Requirement: Doubles serving player derivation

For Doubles mode, `buildMidGameState` SHALL derive `currentServingPlayerId` and `isStartingRight` from the serving team score parity and the left/right player positions in the input.

Rule:
- serving team score is even → right-cell player is the current server AND `isStartingRight: true`
- serving team score is odd → left-cell player is the current server AND `isStartingRight: true`

The receiving team's `isStartingRight` SHALL be set as: right-cell player = `true`, left-cell player = `false`. This does not affect game logic because `isFirstServe` is always `false` at mid-game start.

#### Scenario: Even serving score → right player serves

- **WHEN** `input.servingTeamScore` is even (e.g., 4)
- **THEN** `game.getServingPlayerId()` SHALL equal the right-cell player ID of the serving team

#### Scenario: Odd serving score → left player serves

- **WHEN** `input.servingTeamScore` is odd (e.g., 5)
- **THEN** `game.getServingPlayerId()` SHALL equal the left-cell player ID of the serving team

##### Example: serving player derivation

| servingTeamScore | serverSide | currentServingPlayerId      |
|-----------------|------------|------------------------------|
| 0 (even)        | RIGHT      | serving team right-cell ID   |
| 3 (odd)         | LEFT       | serving team left-cell ID    |
| 6 (even)        | RIGHT      | serving team right-cell ID   |
| 7 (odd)         | LEFT       | serving team left-cell ID    |


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

---
### Requirement: Singles player side derivation

For Singles mode, `buildMidGameState` SHALL compute each player's `currentSide` from their own score using `score % 2 === 0 ? 'RIGHT' : 'LEFT'`. The operator SHALL NOT need to provide player side positions.

#### Scenario: Player side matches score parity

- **WHEN** `buildMidGameState` is called with Singles input
- **THEN** the serving player's `currentSide` SHALL equal `servingTeamScore % 2 === 0 ? 'RIGHT' : 'LEFT'`
- **THEN** the receiving player's `currentSide` SHALL equal `receivingTeamScore % 2 === 0 ? 'RIGHT' : 'LEFT'`

##### Example: singles side derivation

| servingScore | receivingScore | serving side | receiving side |
|-------------|----------------|--------------|----------------|
| 0           | 0              | RIGHT        | RIGHT          |
| 3           | 2              | LEFT         | RIGHT          |
| 6           | 5              | RIGHT        | LEFT           |


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

---
### Requirement: Mid-game state invariants

`buildMidGameState` SHALL always produce a game object with the following properties regardless of input:

- `isFirstServe` SHALL be `false`
- `history` SHALL be empty (length 0)
- Game `status` SHALL be `'IN_PROGRESS'`
- Player IDs SHALL follow the convention `TEAM_A_P1`, `TEAM_A_P2`, `TEAM_B_P1`, `TEAM_B_P2` (doubles) or `TEAM_A_P1`, `TEAM_B_P1` (singles)

#### Scenario: isFirstServe is always false

- **WHEN** `buildMidGameState` is called with any valid input
- **THEN** the resulting game's internal `isFirstServe` SHALL be `false`
- **THEN** `game.getServingPlayerId()` SHALL return `currentServingPlayerId` directly (not the anchor override)

#### Scenario: history is always empty

- **WHEN** `buildMidGameState` is called with any valid input
- **THEN** calling `game.undo()` immediately after SHALL have no observable effect on score or serving team

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