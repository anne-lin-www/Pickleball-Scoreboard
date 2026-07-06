## ADDED Requirements

### Requirement: Mid-game setup screen layout

The app SHALL provide a `MidGameSetupScreen` accessible from the `SetupScreen` via a secondary CTA button labeled "中途接續現況計分" (zh-TW) / "Resume Mid-Game" (en). The screen SHALL be a standalone mobile-first layout with a back navigation affordance to return to `SetupScreen` without starting a game.

#### Scenario: Navigating to mid-game setup

- **WHEN** the operator taps "中途接續現況計分" on SetupScreen
- **THEN** the app SHALL render MidGameSetupScreen
- **THEN** SetupScreen SHALL no longer be visible

#### Scenario: Navigating back without starting

- **WHEN** the operator taps the back affordance on MidGameSetupScreen
- **THEN** the app SHALL return to SetupScreen
- **THEN** no game SHALL be created or started

---

### Requirement: Mid-game mode selection

`MidGameSetupScreen` SHALL provide a mode toggle (Doubles / Singles) at the top of the screen. Selecting the mode SHALL update the score input fields and court diagram layout without navigating away.

#### Scenario: Doubles mode layout

- **WHEN** Doubles is selected
- **THEN** the score input SHALL show three fields: serving score, receiving score, server number (1 or 2)
- **THEN** the court diagram SHALL show a top half and a bottom half, each with a team name input and two player name inputs (left cell and right cell)

#### Scenario: Singles mode layout

- **WHEN** Singles is selected
- **THEN** the score input SHALL show two fields: serving score and receiving score
- **THEN** the court diagram SHALL show a top half and a bottom half, each with a single player name input (no left/right cells)

---

### Requirement: Court diagram for mid-game setup

The court diagram in `MidGameSetupScreen` SHALL use the same bird's-eye layout as defined in `setup-court-diagram-input`: top half and bottom half separated by a net divider. Tapping a half SHALL select that team as the current serving team (highlighted with serving color). The top half team is implicitly `topTeamId`.

#### Scenario: Tapping a half selects serving team

- **WHEN** the operator taps the top court half
- **THEN** the top half SHALL be highlighted as the serving team

- **WHEN** the operator taps the bottom court half
- **THEN** the bottom half SHALL be highlighted as the serving team

#### Scenario: Doubles left/right cells map to Player 1 and Player 2

- **WHEN** Doubles mode is active
- **THEN** the left cell of each half SHALL correspond to Player 1 (the player who starts on the left)
- **THEN** the right cell of each half SHALL correspond to Player 2 (the anchor player who starts on the right)

---

### Requirement: Score input fields

`MidGameSetupScreen` SHALL provide numeric score input fields. All score fields SHALL accept non-negative integers only (type=number, min=0).

The server number field in Doubles mode SHALL be a segmented toggle `[ 1 ] [ 2 ]`, not a free-text input.

#### Scenario: Doubles score input

- **WHEN** Doubles mode is active
- **THEN** three inputs SHALL be shown: serving team score, receiving team score, server number (1 or 2)

#### Scenario: Singles score input

- **WHEN** Singles mode is active
- **THEN** two inputs SHALL be shown: serving team score, receiving team score

##### Example: score call mapping

| Score call (field) | Maps to               |
|--------------------|----------------------|
| First number       | servingTeamScore     |
| Second number      | receivingTeamScore   |
| Third number (D)   | serverNumber (1 or 2)|

---

### Requirement: Position consistency warning for Doubles

In Doubles mode, `MidGameSetupScreen` SHALL display a non-blocking inline warning when the player positions in the court diagram are inconsistent with the serving team score parity.

The expected serving side is: RIGHT if serving team score is even; LEFT if serving team score is odd. The warning SHALL appear when the operator has entered a serving team score and the diagram's inferred server side does not match.

The warning SHALL NOT disable the "開始接續計分" button.

#### Scenario: Warning shown for parity mismatch

- **WHEN** serving team score is even (e.g., 4) and the diagram indicates the server is on the LEFT side
- **THEN** a warning message SHALL appear: "⚠️ 得分為偶數，發球者應在右側"

- **WHEN** serving team score is odd (e.g., 5) and the diagram indicates the server is on the RIGHT side
- **THEN** a warning message SHALL appear: "⚠️ 得分為奇數，發球者應在左側"

#### Scenario: Warning hidden when consistent

- **WHEN** serving team score parity matches the inferred server position
- **THEN** no warning SHALL be shown

#### Scenario: Warning does not block submission

- **WHEN** a position consistency warning is displayed
- **THEN** the "開始接續計分" button SHALL remain enabled and tappable

---

### Requirement: Start mid-game action

`MidGameSetupScreen` SHALL provide a primary button "開始接續計分" (zh-TW) / "Resume Scoring" (en). Tapping it SHALL call `buildMidGameState(input)`, create the game object via `fromSerialized()`, and transition to `GameScreen`.

#### Scenario: Successful mid-game start

- **WHEN** the operator taps "開始接續計分"
- **THEN** the app SHALL transition to GameScreen
- **THEN** GameScreen SHALL display the court with the entered team names, player names, and the correct serving team highlighted
- **THEN** the score displayed SHALL reflect the entered serving and receiving scores

##### Example: score displayed in GameScreen

- **GIVEN** operator entered: serving team score 5, receiving team score 3, server number 2
- **WHEN** GameScreen renders
- **THEN** the score display SHALL show 5 – 3 – 2
