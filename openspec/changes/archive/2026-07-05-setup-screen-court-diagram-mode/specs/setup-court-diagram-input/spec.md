## ADDED Requirements

### Requirement: Court diagram input mode for Doubles

In Doubles mode, the Setup screen SHALL provide a court diagram input mode as an alternative to the form input mode. The operator SHALL be able to switch between the two modes using a segmented toggle control. The toggle SHALL appear only in Doubles mode; Singles mode SHALL always use form input.

#### Scenario: Toggle visible in Doubles mode

- **WHEN** Doubles mode is selected
- **THEN** a segmented toggle control with two options ("表單" / "球場圖" in zh-TW, "Form" / "Court" in en) SHALL be visible above the team/player input area

#### Scenario: Toggle hidden in Singles mode

- **WHEN** Singles mode is selected
- **THEN** the input mode toggle SHALL NOT be visible

#### Scenario: Switching input mode preserves entered data

- **WHEN** the operator has entered team or player names in form mode and then switches to court diagram mode
- **THEN** all previously entered names SHALL still appear in the diagram inputs without being reset

---

### Requirement: Court diagram layout

The court diagram SHALL render a static bird's-eye view of a pickleball court, divided into a top half and a bottom half by a net divider. Each half SHALL contain:
- One team name input field
- Two player name input fields arranged side by side, representing the left and right court positions

The left position in each half SHALL correspond to Player 1 (`isStartingRight: false`, starts on left).
The right position SHALL correspond to Player 2 (`isStartingRight: true`, starts on right, first server).

#### Scenario: Diagram renders two halves with net

- **WHEN** court diagram mode is active
- **THEN** the layout SHALL show: top team half → net divider labeled "球網" / "Net" → bottom team half

#### Scenario: Left and right player inputs map to correct players

- **WHEN** the operator enters a name in the left cell of the top half
- **THEN** that name SHALL map to `teamAPlayer1` (or `teamBPlayer1` if Team B is the top team)

- **WHEN** the operator enters a name in the right cell of the top half
- **THEN** that name SHALL map to `teamAPlayer2` (or `teamBPlayer2` if Team B is the top team) — the first server of that team

---

### Requirement: Court diagram sets topTeamId implicitly

In court diagram mode, the team entered in the top half SHALL implicitly define the `topTeamId` value in the resulting `SetupConfig`. No separate court orientation button SHALL be shown when diagram mode is active.

#### Scenario: Top half always maps to topTeam

- **WHEN** the operator uses court diagram mode and starts the match
- **THEN** the team in the top half of the diagram SHALL appear at the top of the Game screen court

##### Example: top/bottom team mapping

| Diagram top half | Diagram bottom half | SetupConfig.topTeamId |
|------------------|---------------------|-----------------------|
| Team A data      | Team B data         | TEAM_A                |
| Team B data      | Team A data         | TEAM_B                |

---

### Requirement: First serving team selection in court diagram mode

In court diagram mode, the operator SHALL select the first serving team by tapping or clicking on a court half. The selected half SHALL be visually highlighted. The "First Serve" button row used in form mode SHALL NOT be shown when diagram mode is active.

#### Scenario: Tapping a half selects it as the serving team

- **WHEN** the operator taps the top court half
- **THEN** the top half SHALL be highlighted (using the serving team background color) and `firstServingTeam` SHALL be set to the team in the top half

- **WHEN** the operator taps the bottom court half
- **THEN** the bottom half SHALL be highlighted and `firstServingTeam` SHALL be set to the team in the bottom half

#### Scenario: Default serving team in diagram mode

- **WHEN** the operator enters court diagram mode without having previously selected a serving team
- **THEN** the current `firstServingTeam` value (from state) SHALL determine which half is highlighted by default

---

### Requirement: Court diagram produces identical SetupConfig

Both form mode and court diagram mode SHALL produce a `SetupConfig` object with the same field structure. The `SetupConfig` interface SHALL NOT change. Downstream components (`gameInit.ts`, `GameScreen`) SHALL require no modification.

#### Scenario: SetupConfig fields are identical regardless of input mode

- **WHEN** the operator fills in the same match data using form mode and starts the match
- **THEN** the resulting `SetupConfig` SHALL be structurally identical to one produced by court diagram mode with the same data

##### Example: equivalent SetupConfig output

- **GIVEN** operator fills: Team A on top, Alice (left) + Bob (right), Team B on bottom, Carol (left) + Dave (right), Team A serves first
- **WHEN** started from court diagram mode
- **THEN** SetupConfig SHALL equal:
  `{ topTeamId: 'TEAM_A', teamAPlayer1: 'Alice', teamAPlayer2: 'Bob', teamBPlayer1: 'Carol', teamBPlayer2: 'Dave', firstServingTeam: 'TEAM_A' }`
