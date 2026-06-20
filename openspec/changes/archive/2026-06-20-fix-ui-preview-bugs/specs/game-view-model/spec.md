## MODIFIED Requirements

### Requirement: Unified view model derivation

The system SHALL provide a pure function `deriveViewModel(game, config)` in `src/core/gameViewModel.ts` that projects the current state of a `DoublesGame` or `SinglesGame` instance into a `GameViewModel` plain object suitable for rendering.

The `GameViewModel` interface SHALL include a `servingPlayerId: PlayerId` field identifying the PlayerId of the current server:
- For Doubles: derived from `DoublesGame.getServingPlayerId()`, which correctly handles the first-server exception and server #1/#2 transitions
- For Singles: derived from `SinglesGame.getServingPlayer()`

#### Scenario: Doubles game — servingPlayerId at game start (first-server exception)

- **WHEN** a Doubles game is created with TEAM_A as first serving team
- **THEN** `deriveViewModel` SHALL produce a GameViewModel where `servingPlayerId === 'TEAM_A_P1'` (anchor player serves under first-server exception)

#### Scenario: Doubles game — servingPlayerId after server #1 faults

- **WHEN** server #1 faults and serverNumber advances to 2
- **THEN** `deriveViewModel` SHALL produce a GameViewModel where `servingPlayerId` equals the partner's PlayerId (the server #2 player)

#### Scenario: Singles game — servingPlayerId

- **WHEN** a Singles game is in progress
- **THEN** `deriveViewModel` SHALL produce a GameViewModel where `servingPlayerId` equals the PlayerId of the currently serving player
