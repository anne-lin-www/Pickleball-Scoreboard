## ADDED Requirements

### Requirement: Unified view model derivation

The system SHALL provide a pure function `deriveViewModel(game, config)` in `src/core/gameViewModel.ts` that projects the current state of a `DoublesGame` or `SinglesGame` instance into a `GameViewModel` plain object suitable for rendering.

#### Scenario: Doubles game state is projected correctly

- **WHEN** `deriveViewModel` is called with a `DoublesGame` and a `SetupConfig`
- **THEN** `topTeam` SHALL correspond to the team whose `id` matches `config.topTeamId`
- **THEN** each player's `side` SHALL reflect `game.getTeamPositions(teamId)`
- **THEN** `servingTeamId` SHALL equal `game.getServingTeam()`
- **THEN** `serverNumber` SHALL equal `game.getServerNumber()`

#### Scenario: Singles game state is projected correctly

- **WHEN** `deriveViewModel` is called with a `SinglesGame` and a `SetupConfig`
- **THEN** each team SHALL contain exactly one player
- **THEN** `servingTeamId` SHALL be derived from `game.getServingPlayer()` by matching the PlayerId prefix to a TeamId
- **THEN** `serverNumber` SHALL be `1`

#### Scenario: Scores are parsed from score call

- **WHEN** `deriveViewModel` is called after a rally has been scored
- **THEN** `topTeam.score` and `bottomTeam.score` SHALL reflect the current scores derived from `game.getScoreCall()`

##### Example: score parsing after three rallies (doubles)

- **GIVEN** Team A serving, score call is `"3-0-1"`
- **WHEN** `deriveViewModel` is called with `config.topTeamId === 'TEAM_A'`
- **THEN** `topTeam.score === 3`, `bottomTeam.score === 0`, `serverNumber === 1`, `servingTeamId === 'TEAM_A'`

### Requirement: Winner name resolution

When a game is in FINISHED status, `deriveViewModel` SHALL resolve the winner's display name from `SetupConfig`.

#### Scenario: Doubles winner name

- **WHEN** `game.getStatus() === 'FINISHED'` and `game.getWinner() === 'TEAM_A'`
- **THEN** `winnerName` SHALL equal `config.teamAName`

#### Scenario: Singles winner name

- **WHEN** `game.getStatus() === 'FINISHED'` and `game.getWinner()` is a PlayerId starting with `'TEAM_B_'`
- **THEN** `winnerName` SHALL equal `config.teamBPlayer1`
