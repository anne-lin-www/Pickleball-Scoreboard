## ADDED Requirements

### Requirement: Input mode toggle control in Doubles

The Setup screen SHALL display a segmented toggle control ("表單" / "球場圖" in zh-TW; "Form" / "Court" in en) in Doubles mode, placed between the game mode selector and the team/player input area. This toggle SHALL control whether form mode or court diagram mode is used for team and player name entry.

#### Scenario: Toggle appears only in Doubles mode

- **WHEN** the operator selects Doubles mode
- **THEN** the input mode toggle SHALL be visible

- **WHEN** the operator selects Singles mode
- **THEN** the input mode toggle SHALL NOT be visible

---

## MODIFIED Requirements

### Requirement: Initial server info display

The Setup screen SHALL display a dynamic info hint identifying the player who will serve first. In form mode, the hint SHALL appear directly below the Player 2 name input field for the first-serving team, adjacent to that input, rather than below the first-serve selector. In court diagram mode, the hint is replaced by the visual highlight on the selected court half and SHALL NOT be shown as a separate text element.

The hint text SHALL be: 「開局發球者：{team name} 球員二（Player 2）」 (zh-TW)

The hint SHALL update immediately when the operator changes the first-serving team selection.

#### Scenario: Info hint shown adjacent to Player 2 input in form mode

- **WHEN** form mode is active and the operator selects Team A as the first serving team
- **THEN** the hint 「開局發球者：{Team A name} 球員二（Player 2）」 SHALL appear directly below the Team A Player 2 input field

- **WHEN** form mode is active and the operator switches to Team B as the first serving team
- **THEN** the hint SHALL move to appear below Team B's Player 2 input and SHALL NOT appear below Team A's Player 2 input

#### Scenario: Info hint hidden in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the initial server text hint SHALL NOT be shown

#### Scenario: Hint only shown in Doubles mode

- **WHEN** Singles mode is active
- **THEN** the initial server hint SHALL NOT be shown

---

### Requirement: First serving team selection

The Setup screen SHALL provide a control for the operator to choose which team serves first.

In form mode, the control SHALL be a button row displaying the two team names.

In court diagram mode, the serving team SHALL be selected by tapping a court half (see `setup-court-diagram-input` spec). The button row SHALL NOT be shown in diagram mode.

#### Scenario: Serving team options in form mode

- **WHEN** form mode is active
- **THEN** two buttons SHALL be available: Team A serves first, Team B serves first

#### Scenario: Serving team selection in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the serving team button row SHALL NOT be visible; serving team is selected by tapping a court half

---

### Requirement: Court orientation setting

The Setup screen SHALL allow the operator to choose which team appears at the top of the game screen.

In form mode, the control SHALL be a button row (Team A on Top / Team B on Top).

In court diagram mode, the top half of the diagram implicitly defines the top team. The orientation button row SHALL NOT be shown in diagram mode.

#### Scenario: Default court orientation

- **WHEN** the operator has not changed the orientation setting
- **THEN** Team A SHALL appear at the top by default

#### Scenario: Swapping court orientation in form mode

- **WHEN** form mode is active and the operator selects Team B at the top
- **THEN** Team B SHALL appear at the top half of the court on the Game screen and Team A at the bottom

#### Scenario: Court orientation in diagram mode

- **WHEN** court diagram mode is active
- **THEN** the orientation button row SHALL NOT be visible; the team entered in the top half of the diagram defines the top team
