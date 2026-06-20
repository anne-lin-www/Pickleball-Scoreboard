## ADDED Requirements

### Requirement: Mode selection

The Setup screen SHALL display a toggle control allowing the operator to select between Doubles and Singles mode before the match begins.

#### Scenario: Default mode on load

- **WHEN** the operator opens the app for the first time
- **THEN** Doubles mode SHALL be selected by default

#### Scenario: Switching modes updates player fields

- **WHEN** the operator switches to Singles mode
- **THEN** the player name input fields SHALL reduce to one per team (Player 1 only)

- **WHEN** the operator switches to Doubles mode
- **THEN** the player name input fields SHALL show two per team (Player 1 and Player 2)

### Requirement: Team and player name entry

The Setup screen SHALL provide text input fields for team names and player names.

#### Scenario: Doubles mode fields

- **WHEN** Doubles mode is active
- **THEN** the form SHALL display: Team A name, Team A Player 1 name, Team A Player 2 name, Team B name, Team B Player 1 name, Team B Player 2 name

#### Scenario: Singles mode fields

- **WHEN** Singles mode is active
- **THEN** the form SHALL display: Team A name, Team A Player 1 name, Team B name, Team B Player 1 name

### Requirement: First serving team selection

The Setup screen SHALL provide a control for the operator to choose which team serves first.

#### Scenario: Serving team options

- **WHEN** the operator views the Setup screen
- **THEN** two options SHALL be available: Team A serves first, Team B serves first

### Requirement: Court orientation setting

The Setup screen SHALL allow the operator to choose which team appears at the top of the game screen, establishing the visual orientation of the court relative to the operator's physical position.

#### Scenario: Default court orientation

- **WHEN** the operator has not changed the orientation setting
- **THEN** Team A SHALL appear at the top of the game screen by default

#### Scenario: Swapping court orientation

- **WHEN** the operator selects Team B at the top
- **THEN** Team B SHALL appear at the top half of the court on the Game screen and Team A at the bottom

### Requirement: Start match action

The Setup screen SHALL provide a button to proceed to the Game screen.

#### Scenario: Proceed to game

- **WHEN** the operator presses the start match button
- **THEN** the app SHALL transition to the Game screen displaying the court with the configured team and player names
