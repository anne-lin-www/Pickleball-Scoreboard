## ADDED Requirements

### Requirement: Score button records rally in game engine

When the operator presses a team's +1 button, the Game screen SHALL call `winRally` on the game instance and update the displayed score, serving indicators, and player positions to reflect the new game state.

#### Scenario: Top team scores via button

- **WHEN** the operator presses the top team's +1 button
- **THEN** `winRally` SHALL be called with the top team's identifier
- **THEN** the score display SHALL update to reflect the new game state
- **THEN** serving indicators and player positions SHALL update if service changes

#### Scenario: Bottom team scores via button

- **WHEN** the operator presses the bottom team's +1 button
- **THEN** `winRally` SHALL be called with the bottom team's identifier
- **THEN** the score display SHALL update to reflect the new game state

### Requirement: Undo reverses last recorded rally

When the operator presses the Undo button, the Game screen SHALL call `undo` on the game instance and update all displayed state to reflect the reverted game state.

#### Scenario: Undo after a rally

- **WHEN** the operator presses the Undo button after at least one rally has been recorded
- **THEN** `game.undo()` SHALL be called
- **THEN** the score, serving team, server number, and player positions SHALL revert to the state before the last rally

#### Scenario: Undo at game start

- **WHEN** the operator presses the Undo button with no rally history
- **THEN** `game.undo()` SHALL be called without error
- **THEN** the displayed state SHALL remain unchanged

### Requirement: Tap-court scoring wires to game engine

When tap-court mode is enabled and the operator taps a court half, the Game screen SHALL call `winRally` for the tapped team, identical in outcome to pressing that team's +1 button.

#### Scenario: Court tap scores for tapped team

- **WHEN** tap-court mode is enabled and the operator taps the top court half
- **THEN** `winRally` SHALL be called with the top team's identifier
- **THEN** the game state SHALL update identically to pressing the top team's +1 button
