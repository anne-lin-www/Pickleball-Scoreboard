## ADDED Requirements

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
