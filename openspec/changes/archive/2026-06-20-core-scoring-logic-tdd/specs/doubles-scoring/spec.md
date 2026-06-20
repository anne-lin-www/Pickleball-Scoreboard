## ADDED Requirements

### Requirement: Initial game state

The doubles game SHALL initialize with score `0-0-2`, placing the starting team's right-side player as the server (first-server exception). The `isFirstServe` flag SHALL be `true` at initialization.

#### Scenario: New game starts at 0-0-2

- **WHEN** a new doubles game is created with Team A serving first
- **THEN** `getScoreCall()` returns `"0-0-2"`
- **THEN** `getServingTeam()` returns `TEAM_A`
- **THEN** `getServerNumber()` returns `2`
- **THEN** `getStatus()` returns `IN_PROGRESS`

### Requirement: First-server exception on initial Side Out

When `isFirstServe` is `true` and the serving team loses a rally, the game SHALL immediately perform a Side Out (no second server). `isFirstServe` SHALL be set to `false` after this Side Out.

#### Scenario: Opening serve fault causes immediate Side Out

- **WHEN** `getScoreCall()` is `"0-0-2"` and `winRally(TEAM_B)` is called
- **THEN** `getScoreCall()` returns `"0-0-1"`
- **THEN** `getServingTeam()` returns `TEAM_B`
- **THEN** `getServerNumber()` returns `1`

### Requirement: Rally scoring — only serving team scores

The serving team SHALL score a point when `winRally` is called with the serving team's ID. The receiving team SHALL NOT score when they win a rally; instead they advance the server sequence.

#### Scenario: Serving team wins rally

- **WHEN** Team A is serving at `"1-0-1"` and `winRally(TEAM_A)` is called
- **THEN** `getScoreCall()` returns `"2-0-1"`

#### Scenario: Receiving team wins rally does not score

- **WHEN** Team B is serving at `"0-1-1"` and `winRally(TEAM_A)` is called
- **THEN** score remains unchanged and server advances to `"0-1-2"`

### Requirement: Server sequence — server 1 to server 2

When server number 1 loses a rally, the game SHALL advance to server number 2 (same team). No Side Out occurs.

#### Scenario: Server 1 fault advances to server 2

- **WHEN** Team A is serving at `"1-0-1"` and `winRally(TEAM_B)` is called
- **THEN** `getScoreCall()` returns `"1-0-2"`
- **THEN** `getServingTeam()` returns `TEAM_A`
- **THEN** `getServerNumber()` returns `2`

### Requirement: Server sequence — server 2 fault triggers Side Out

When server number 2 loses a rally, the game SHALL perform a Side Out: serving team changes to the opponent, and the opponent's right-side player becomes server number 1.

#### Scenario: Server 2 fault causes Side Out

- **WHEN** Team A is serving at `"1-0-2"` and `winRally(TEAM_B)` is called
- **THEN** `getServingTeam()` returns `TEAM_B`
- **THEN** `getServerNumber()` returns `1`
- **THEN** `getScoreCall()` returns `"0-1-1"`

### Requirement: Position switching on score

When the serving team scores, the two players on the scoring team SHALL swap `currentSide`. The receiving team's player positions SHALL NOT change.

#### Scenario: Serving team scores — players swap sides

- **WHEN** Team A is serving at `"0-0-2"` and `winRally(TEAM_A)` is called
- **THEN** `getScoreCall()` returns `"1-0-2"`
- **THEN** the player who was on RIGHT is now on LEFT (and vice versa) for Team A
- **THEN** Team B player positions are unchanged

#### Scenario: Receiving team wins — no position change

- **WHEN** Team B is serving at `"0-1-1"` and `winRally(TEAM_A)` is called
- **THEN** no team's player positions change

### Requirement: Position assertion using anchor player parity

Each team's anchor player (`isStartingRight === true`) SHALL be on the RIGHT side when the team's score is even, and on the LEFT side when the team's score is odd. `runPositionAssertion()` SHALL throw an `Error` if this invariant is violated for the serving team.

#### Scenario: Correct position passes assertion

- **WHEN** Team A score is `2` (even) and Team A's anchor player is on RIGHT
- **WHEN** `runPositionAssertion()` is called
- **THEN** no error is thrown

#### Scenario: Wrong position fails assertion

- **WHEN** Team A score is `3` (odd) and Team A's anchor player is on RIGHT
- **WHEN** `runPositionAssertion()` is called
- **THEN** an `Error` is thrown

##### Example: parity table

| Team score | Expected anchor side |
| ---------- | -------------------- |
| 0 (even)   | RIGHT                |
| 1 (odd)    | LEFT                 |
| 2 (even)   | RIGHT                |
| 3 (odd)    | LEFT                 |
| 10 (even)  | RIGHT                |
| 11 (odd)   | LEFT                 |

### Requirement: Win condition — 11 points with 2-point lead

A team SHALL win when its score reaches 11 or more AND leads the opponent by at least 2 points. `getStatus()` SHALL return `FINISHED` and `getWinner()` SHALL return the winning team's ID.

#### Scenario: Normal win at 11

- **WHEN** Team A is serving at `"10-8-1"` and `winRally(TEAM_A)` is called
- **THEN** `getStatus()` returns `FINISHED`
- **THEN** `getWinner()` returns `TEAM_A`

#### Scenario: Deuce at 10-10 does not win

- **WHEN** Team A is serving at `"10-10-1"` and `winRally(TEAM_A)` is called
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getScoreCall()` returns `"11-10-1"`

#### Scenario: Extended play win

- **WHEN** Team A is serving at `"11-10-1"` and `winRally(TEAM_A)` is called
- **THEN** `getStatus()` returns `FINISHED`
- **THEN** `getWinner()` returns `TEAM_A`

##### Example: win condition boundary

| Score before | Rally winner | Status after |
| ------------ | ------------ | ------------ |
| 10-9-1 (A)   | TEAM_A       | FINISHED     |
| 10-10-1 (A)  | TEAM_A       | IN_PROGRESS  |
| 11-10-1 (A)  | TEAM_A       | FINISHED     |
| 11-10-1 (A)  | TEAM_B (fault → s2) | IN_PROGRESS |

### Requirement: Undo restores previous state

`undo()` SHALL restore the complete game state (scores, player positions, serverNumber, servingTeam, isFirstServe) to what it was immediately before the most recent `winRally()` call. Calling `undo()` when history is empty SHALL be a no-op.

#### Scenario: Undo reverses a score

- **WHEN** Team A scored at `"0-0-2"` → state became `"1-0-2"` with swapped positions
- **WHEN** `undo()` is called
- **THEN** `getScoreCall()` returns `"0-0-2"` and player positions are restored
