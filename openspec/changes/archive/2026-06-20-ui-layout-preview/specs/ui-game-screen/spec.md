## ADDED Requirements

### Requirement: Bird's-eye court layout

The Game screen SHALL display the court as a top-down (bird's-eye) view with the top team's half at the top of the viewport and the bottom team's half at the bottom, separated by a net indicator.

#### Scenario: Court fills main viewport

- **WHEN** the operator views the Game screen on a mobile device (portrait)
- **THEN** the court area SHALL occupy the majority of the visible viewport height

#### Scenario: Absolute coordinate positioning

- **WHEN** Team A is assigned to the top half of the court
- **THEN** Team A's RIGHT-side player SHALL appear on the left side of the screen and Team A's LEFT-side player SHALL appear on the right side of the screen (bird's-eye absolute: A faces south toward the net)

- **WHEN** Team B is assigned to the bottom half of the court
- **THEN** Team B's LEFT-side player SHALL appear on the left side of the screen and Team B's RIGHT-side player SHALL appear on the right side of the screen (bird's-eye absolute: B faces north toward the net)

##### Example: Doubles positions at score 0 (even — anchor on RIGHT)

- **GIVEN** Team A at top; Team A anchor player (isStartingRight=true) has score 0 (even)
- **THEN** anchor player SHALL appear on the screen-right position in Team A's half (A's LEFT side = screen-right in bird's-eye)

### Requirement: Three-segment score display

The Game screen SHALL display the current score in pickleball's standard three-segment format for Doubles: `serving score – receiving score – server number`.

#### Scenario: Score call visible at a glance

- **WHEN** the operator views the Game screen
- **THEN** the three-segment score SHALL be displayed in large, readable text outside the court area

##### Example: Score call format

| Serving score | Receiving score | Server number | Display |
|--------------|----------------|---------------|---------|
| 6 | 4 | 1 | 6 – 4 – 1 |
| 0 | 0 | 2 | 0 – 0 – 2 |
| 10 | 10 | 1 | 10 – 10 – 1 |

### Requirement: Serving player indicator

The Game screen SHALL mark the current server with a visible indicator (●) next to their name on the court.

#### Scenario: Server marked on court

- **WHEN** a player is the current server
- **THEN** a ● symbol SHALL appear adjacent to that player's name on the court display

#### Scenario: Non-servers unmarked

- **WHEN** a player is not the current server
- **THEN** no ● indicator SHALL appear next to their name

### Requirement: Fixed scoring buttons

The Game screen SHALL display two fixed action buttons — one per team — for the operator to record which team won a rally.

#### Scenario: Buttons always visible

- **WHEN** the operator views the Game screen
- **THEN** Team A scoring button and Team B scoring button SHALL be visible outside the court area and reachable by thumb on a mobile device

### Requirement: Undo action

The Game screen SHALL provide an Undo button that allows the operator to reverse the last recorded rally.

#### Scenario: Undo button present

- **WHEN** the operator views the Game screen
- **THEN** an Undo button SHALL be visible and tappable

### Requirement: Reset action

The Game screen SHALL provide a Reset button to end the current game and navigate to the Game Over screen.

#### Scenario: Reset button present

- **WHEN** the operator views the Game screen
- **THEN** a Reset button SHALL be visible and tappable

### Requirement: Tap-court scoring (opt-in)

The Game screen SHALL support an optional interaction mode where tapping the top or bottom half of the court records a point for the respective team. This mode SHALL be disabled by default and enabled only via a settings toggle.

#### Scenario: Default state — tap court disabled

- **WHEN** the operator has not enabled tap-court scoring in settings
- **THEN** tapping the court area SHALL produce no scoring action

#### Scenario: Enabled state — tap court records point

- **WHEN** tap-court scoring is enabled in settings
- **WHEN** the operator taps the top half of the court
- **THEN** the team assigned to the top half SHALL receive a point

### Requirement: Responsive layout

The Game screen SHALL adapt its layout for mobile portrait, tablet, and desktop viewports without content overflow or illegible text.

#### Scenario: Mobile portrait (375px width)

- **WHEN** viewed on a 375px-wide viewport
- **THEN** court, score, and buttons SHALL all be visible without horizontal scrolling

#### Scenario: Tablet and desktop (768px+ width)

- **WHEN** viewed on a 768px or wider viewport
- **THEN** the layout SHALL use available horizontal space to increase court and score readability
