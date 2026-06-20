# doubles-scoring Specification

## Purpose

TBD - created by archiving change 'core-scoring-logic-tdd'. Update Purpose after archive.

## Requirements

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


<!-- @trace
source: fix-player-1-2-convention
updated: 2026-06-20
code:
  - design-preview-A.html
  - src/i18n/strings.ts
  - src/screens/SetupScreen.tsx
  - design-preview-B.html
  - src/core/doubles/DoublesGame.ts
tests:
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: First-server exception on initial Side Out

When `isFirstServe` is `true` and the serving team loses a rally, the game SHALL immediately perform a Side Out (no second server). `isFirstServe` SHALL be set to `false` after this Side Out.

#### Scenario: Opening serve fault causes immediate Side Out

- **WHEN** `getScoreCall()` is `"0-0-2"` and `winRally(TEAM_B)` is called
- **THEN** `getScoreCall()` returns `"0-0-1"`
- **THEN** `getServingTeam()` returns `TEAM_B`
- **THEN** `getServerNumber()` returns `1`


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Rally scoring — only serving team scores

The serving team SHALL score a point when `winRally` is called with the serving team's ID. The receiving team SHALL NOT score when they win a rally; instead they advance the server sequence.

#### Scenario: Serving team wins rally

- **WHEN** Team A is serving at `"1-0-1"` and `winRally(TEAM_A)` is called
- **THEN** `getScoreCall()` returns `"2-0-1"`

#### Scenario: Receiving team wins rally does not score

- **WHEN** Team B is serving at `"0-1-1"` and `winRally(TEAM_A)` is called
- **THEN** score remains unchanged and server advances to `"0-1-2"`


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Server sequence — server 1 to server 2

When server number 1 loses a rally, the game SHALL advance to server number 2 (same team). No Side Out occurs.

#### Scenario: Server 1 fault advances to server 2

- **WHEN** Team A is serving at `"1-0-1"` and `winRally(TEAM_B)` is called
- **THEN** `getScoreCall()` returns `"1-0-2"`
- **THEN** `getServingTeam()` returns `TEAM_A`
- **THEN** `getServerNumber()` returns `2`


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Server sequence — server 2 fault triggers Side Out

When server number 2 loses a rally, the game SHALL perform a Side Out: serving team changes to the opponent, and the opponent's right-side player becomes server number 1.

#### Scenario: Server 2 fault causes Side Out

- **WHEN** Team A is serving at `"1-0-2"` and `winRally(TEAM_B)` is called
- **THEN** `getServingTeam()` returns `TEAM_B`
- **THEN** `getServerNumber()` returns `1`
- **THEN** `getScoreCall()` returns `"0-1-1"`


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
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


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
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


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
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


<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Undo restores previous state

`undo()` SHALL restore the complete game state (scores, player positions, serverNumber, servingTeam, isFirstServe) to what it was immediately before the most recent `winRally()` call. Calling `undo()` when history is empty SHALL be a no-op.

#### Scenario: Undo reverses a score

- **WHEN** Team A scored at `"0-0-2"` → state became `"1-0-2"` with swapped positions
- **WHEN** `undo()` is called
- **THEN** `getScoreCall()` returns `"0-0-2"` and player positions are restored

<!-- @trace
source: core-scoring-logic-tdd
updated: 2026-06-20
code:
  - src/core/types.ts
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Reset game to initial state

The doubles game SHALL provide a `reset()` method that restores all state to the values present immediately after construction. `reset()` SHALL be callable at any point during an in-progress or finished game.

The following SHALL be true after `reset()` is called:

- Score returns to `0-0-2`
- Serving team returns to the team passed to the constructor
- Server number returns to `2`
- `isFirstServe` returns to `true`
- Both teams' player positions reset to their initial sides (anchor player on RIGHT, non-anchor on LEFT)
- Status returns to `IN_PROGRESS`
- Winner returns to `null`
- Undo history is cleared (subsequent `undo()` calls are no-ops)

#### Scenario: Reset from in-progress game

- **WHEN** `winRally(TEAM_A)` has been called one or more times
- **WHEN** `reset()` is called
- **THEN** `getScoreCall()` returns `"0-0-2"`
- **THEN** `getServingTeam()` returns the team passed to the constructor
- **THEN** `getServerNumber()` returns `2`
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getWinner()` returns `null`

#### Scenario: Reset from finished game

- **WHEN** the game has reached `FINISHED` state
- **WHEN** `reset()` is called
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getWinner()` returns `null`
- **THEN** `getScoreCall()` returns `"0-0-2"`

#### Scenario: Reset clears undo history

- **WHEN** one or more `winRally()` calls have been made
- **WHEN** `reset()` is called
- **WHEN** `undo()` is called immediately after
- **THEN** `getScoreCall()` still returns `"0-0-2"` (undo is a no-op)

#### Scenario: Reset restores original serving team when serve has transferred

- **WHEN** the game was constructed with TEAM_B as first serving team
- **WHEN** serve has transferred to TEAM_A during play
- **WHEN** `reset()` is called
- **THEN** `getServingTeam()` returns `TEAM_B`

#### Scenario: Reset restores first-serve exception flag

- **WHEN** the first-serve exception has already triggered (`isFirstServe` is `false`)
- **WHEN** `reset()` is called
- **WHEN** the serving team subsequently faults
- **THEN** a Side Out occurs immediately (first-serve exception applies again)

#### Scenario: Reset restores player positions to initial sides

- **WHEN** `winRally(TEAM_A)` has been called (players swapped sides)
- **WHEN** `reset()` is called
- **THEN** Team A's anchor player (`isStartingRight === true`) is on `RIGHT`
- **THEN** Team A's non-anchor player is on `LEFT`

#### Scenario: Reset is idempotent

- **WHEN** `reset()` is called multiple times in succession
- **THEN** each call leaves the game in the same initial state
- **THEN** `getScoreCall()` returns `"0-0-2"` after each call

##### Example: boundary cases

| Action sequence | Expected getScoreCall() | Expected getStatus() |
| --------------- | ----------------------- | -------------------- |
| new game → reset() | "0-0-2" | IN_PROGRESS |
| score 5 → reset() | "0-0-2" | IN_PROGRESS |
| finish game → reset() | "0-0-2" | IN_PROGRESS |
| score 3 → reset() → undo() | "0-0-2" | IN_PROGRESS |

<!-- @trace
source: reset-match
updated: 2026-06-20
code:
  - src/core/doubles/DoublesGame.ts
  - src/core/singles/SinglesGame.ts
tests:
  - src/core/singles/SinglesGame.test.ts
  - src/core/doubles/DoublesGame.test.ts
-->

---
### Requirement: Current serving player identification

The `IDoublesScoreboard` interface SHALL expose `getServingPlayerId(): PlayerId` to identify the current server's PlayerId at any point in the game.

Behavior:
- During the first-server exception (`isFirstServe === true`): SHALL return the anchor player's PlayerId (the player with `isStartingRight === true` on the serving team)
- After first side-out, when `serverNumber === 1`: SHALL return the PlayerId of the player who was on the RIGHT side when `resetToFirstServer` was called for the current service stint
- After `serverNumber` advances to 2: SHALL return the PlayerId of the partner (the player who was not server #1 in the current service stint)
- After `undo()`: SHALL return the PlayerId that was current before the undone action

#### Scenario: Serving player at game start (0-0-2)

- **GIVEN** a fresh DoublesGame with TEAM_A serving
- **WHEN** `getServingPlayerId()` is called
- **THEN** it SHALL return `'TEAM_A_P1'` (anchor, starts on RIGHT at even score 0)

#### Scenario: Serving player after anchor scores (1-0-2)

- **GIVEN** TEAM_A has scored once (score 1, anchor switched to LEFT)
- **WHEN** `getServingPlayerId()` is called
- **THEN** it SHALL still return `'TEAM_A_P1'` (same server, now on LEFT)

#### Scenario: Serving player after first side-out

- **GIVEN** TEAM_B now serves as server #1
- **WHEN** `getServingPlayerId()` is called
- **THEN** it SHALL return `'TEAM_B_P1'` (TEAM_B anchor was on RIGHT at side-out with TEAM_B score 0)

#### Scenario: Serving player after server #1 faults

- **GIVEN** TEAM_B server #1 has faulted and serverNumber is now 2
- **WHEN** `getServingPlayerId()` is called
- **THEN** it SHALL return `'TEAM_B_P2'` (partner of server #1)

#### Scenario: Serving player after undo

- **GIVEN** TEAM_B serverNumber advanced to 2 (P2 is server)
- **WHEN** `undo()` is called
- **THEN** `getServingPlayerId()` SHALL return `'TEAM_B_P1'` (reverted to server #1)

##### Example: serving player by game state

| State | servingTeam | serverNumber | getServingPlayerId() |
|-------|-------------|--------------|----------------------|
| 0-0-2 (start) | TEAM_A | 2 | TEAM_A_P1 |
| 1-0-2 (A scored) | TEAM_A | 2 | TEAM_A_P1 |
| 0-1-1 (B serves) | TEAM_B | 1 | TEAM_B_P1 |
| 0-1-2 (B s1 fault) | TEAM_B | 2 | TEAM_B_P2 |

<!-- @trace
source: fix-ui-preview-bugs
updated: 2026-06-20
code:
  - src/core/gameViewModel.ts
  - src/screens/SetupScreen.tsx
  - design-preview-B.html
  - src/screens/GameScreen.tsx
  - src/core/doubles/DoublesGame.ts
  - design-preview-A.html
tests:
  - src/core/doubles/DoublesGame.test.ts
-->