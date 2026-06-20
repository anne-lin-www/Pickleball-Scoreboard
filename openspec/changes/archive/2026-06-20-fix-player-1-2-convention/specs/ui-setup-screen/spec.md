## MODIFIED Requirements

### Requirement: Player name input labels in Doubles mode

In Doubles mode, each team's player name input fields SHALL display a label that identifies the player's serving order role. The label SHALL be visible above or adjacent to the input field.

- Player 1 input label: 「球員一（1位）」 / "Player 1"
- Player 2 input label: 「球員二（2位）」 / "Player 2"

#### Scenario: Labels shown in Doubles mode

- **WHEN** the operator selects Doubles mode
- **THEN** each team SHALL show two labeled player inputs: Player 1 (1位) and Player 2 (2位)

#### Scenario: Labels hidden in Singles mode

- **WHEN** the operator selects Singles mode
- **THEN** only one player input per team is shown (no Player 2 label visible)

## ADDED Requirements

### Requirement: Initial server info display

The Setup screen SHALL display a dynamic info hint below the first-serving-team selector, identifying the player who will serve first in the game.

The hint text SHALL be: 「開局發球者：{team name} 球員二（Player 2）」

The hint SHALL update immediately when the operator changes the first-serving team selection.

#### Scenario: Info hint reflects first-serving team selection

- **WHEN** the operator selects TEAM A as the first serving team
- **THEN** the hint displays: 「開局發球者：{Team A name} 球員二（Player 2）」

- **WHEN** the operator switches to TEAM B as the first serving team
- **THEN** the hint displays: 「開局發球者：{Team B name} 球員二（Player 2）」

#### Scenario: Hint only shown in Doubles mode

- **WHEN** Singles mode is active
- **THEN** the initial server hint SHALL NOT be shown (Singles has no 2位 concept)
