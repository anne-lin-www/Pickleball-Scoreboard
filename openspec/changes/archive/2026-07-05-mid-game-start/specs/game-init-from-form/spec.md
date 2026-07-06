## ADDED Requirements

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
