## MODIFIED Requirements

### Requirement: Games count selection

The Setup screen SHALL provide a control allowing the operator to select the number of games in the match (1 or 3) before starting. Player name fields SHALL initialize with an empty string value; placeholder text SHALL be used to guide input rather than pre-filled default names.

#### Scenario: Default games count on load

- **WHEN** the operator opens the Setup screen
- **THEN** the games count control SHALL default to 1 game

#### Scenario: Selecting games count

- **WHEN** the operator selects "Best of 3" on the games count control
- **THEN** the control SHALL reflect the selection and the submitted SetupConfig SHALL contain `gamesCount: 3`

#### Scenario: Player name fields are empty on load

- **WHEN** the operator opens the Setup screen
- **THEN** all four player name input fields SHALL be empty (value `""`)
- **THEN** each field SHALL display a placeholder (e.g., "球員名字" / "Player name") to indicate expected input

#### Scenario: Empty player name passes through to SetupConfig

- **WHEN** the operator leaves a player name field empty and starts the match
- **THEN** the resulting SetupConfig SHALL contain an empty string `""` for that player's name field

##### Example: games count values

| Selection | SetupConfig.gamesCount |
|-----------|------------------------|
| 1 game    | 1                      |
| Best of 3 | 3                      |
