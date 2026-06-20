## MODIFIED Requirements

### Requirement: Games count selection control

The Setup screen SHALL include a games count selection control, displayed before the Start Game button, allowing the operator to choose between 1 game and Best of 3 games. The default selection SHALL be 1 game. The active selection SHALL use `btn-primary` styling, consistent with other selection controls on the Setup screen.

#### Scenario: Default games count on load

- **WHEN** the operator opens the Setup screen
- **THEN** the games count control SHALL be visible and default to "1 game" with the `btn-primary` active style

#### Scenario: Operator selects Best of 3

- **WHEN** the operator selects "Best of 3" on the games count control
- **THEN** the control SHALL reflect the selection with `btn-primary` active style and the submitted SetupConfig SHALL contain `gamesCount: 3`

##### Example: games count submitted values

| Selection | SetupConfig.gamesCount |
|-----------|------------------------|
| 1 game    | 1                      |
| Best of 3 | 3                      |
