## MODIFIED Requirements

### Requirement: Initial game state

The doubles game SHALL initialize with score `0-0-2`. P1 (`{teamId}_P1`) SHALL be placed on the **left** court side (`isStartingRight: false`); P2 (`{teamId}_P2`) SHALL be placed on the **right** court side (`isStartingRight: true`) and is the initial server (first-server exception). The `isFirstServe` flag SHALL be `true` at initialization. This matches pickleball convention: at 0-0-2, the right-side player is 2位 (server #2).

#### Scenario: New game starts at 0-0-2 with P2 on right

- **WHEN** a new doubles game is created with Team A serving first
- **THEN** `getScoreCall()` returns `"0-0-2"`
- **THEN** `getServingTeam()` returns `TEAM_A`
- **THEN** `getServerNumber()` returns `2`
- **THEN** `getServingPlayerId()` returns `"TEAM_A_P2"` (P2 = right side = 2位)
- **THEN** `getTeamPositions("TEAM_A")` returns `{ TEAM_A_P1: "LEFT", TEAM_A_P2: "RIGHT" }`

##### Example: Initial positions for TEAM_A serving first

| Player     | isStartingRight | Initial Side |
| ---------- | --------------- | ------------ |
| TEAM_A_P1  | false           | LEFT         |
| TEAM_A_P2  | true            | RIGHT        |
| TEAM_B_P1  | false           | LEFT         |
| TEAM_B_P2  | true            | RIGHT        |
