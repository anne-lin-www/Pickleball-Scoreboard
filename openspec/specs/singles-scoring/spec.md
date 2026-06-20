# singles-scoring Specification

## Purpose

TBD - created by archiving change 'core-scoring-logic-tdd'. Update Purpose after archive.

## Requirements

### Requirement: Initial game state

The singles game SHALL initialize with score `0-0`, with the starting player on the RIGHT side (score 0 is even). There is no first-server exception in singles.

#### Scenario: New game starts at 0-0 with server on RIGHT

- **WHEN** a new singles game is created with Player A serving first
- **WHEN** `getScoreCall()` is called
- **THEN** it returns `"0-0"`
- **THEN** `getServingPlayer()` returns Player A's ID
- **THEN** `getPlayerSide(playerA)` returns `RIGHT`
- **THEN** `getStatus()` returns `IN_PROGRESS`


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
### Requirement: Serve side determined by server's score parity

The serving player's side SHALL always equal `score % 2 === 0 ? RIGHT : LEFT`. This is a pure function of the serving player's current score; `isStartingRight` or any anchor concept SHALL NOT be used.

#### Scenario: Server side matches score parity

- **WHEN** Player A's score is `0` (even) and serving
- **THEN** `getPlayerSide(A)` returns `RIGHT`

- **WHEN** Player A's score is `1` (odd) and serving
- **THEN** `getPlayerSide(A)` returns `LEFT`

##### Example: score-to-side parity table

| Server score | Expected side |
| ------------ | ------------- |
| 0 (even)     | RIGHT         |
| 1 (odd)      | LEFT          |
| 2 (even)     | RIGHT         |
| 9 (odd)      | LEFT          |
| 10 (even)    | RIGHT         |
| 11 (odd)     | LEFT          |


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
### Requirement: No first-server exception

In singles, the first serve fault SHALL immediately transfer serve to the opponent. There is no special 0-0-2 opening rule.

#### Scenario: First rally lost transfers serve immediately

- **WHEN** `getScoreCall()` is `"0-0"` and `winRally(playerB)` is called
- **THEN** `getServingPlayer()` returns Player B's ID
- **THEN** Player B's score is `0` (even) → `getPlayerSide(B)` returns `RIGHT`
- **THEN** `getScoreCall()` returns `"0-0"`


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
### Requirement: Rally scoring — only serving player scores

The serving player SHALL score a point when `winRally` is called with the serving player's ID. Their `currentSide` SHALL update to reflect the new score parity.

#### Scenario: Serving player wins rally

- **WHEN** Player A is serving at `"0-0"` (A score=0, RIGHT) and `winRally(A)` is called
- **THEN** Player A's score becomes `1`
- **THEN** `getScoreCall()` returns `"1-0"`
- **THEN** `getPlayerSide(A)` returns `LEFT` (score 1 = odd)

#### Scenario: Consecutive scores keep switching sides

- **WHEN** Player A is at `"1-0"` (LEFT) and `winRally(A)` is called
- **THEN** `getScoreCall()` returns `"2-0"`
- **THEN** `getPlayerSide(A)` returns `RIGHT` (score 2 = even)


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
### Requirement: Serve transfer on rally loss

When the serving player loses a rally, serve SHALL transfer to the opponent immediately. The new server's side SHALL be set to `newServerScore % 2 === 0 ? RIGHT : LEFT`. The score call SHALL report the new server's score first.

#### Scenario: Serve transfer sets new server's side by their own score

- **WHEN** Player A is serving at `"2-1"` (A score=2, RIGHT) and `winRally(B)` is called
- **THEN** `getServingPlayer()` returns Player B's ID
- **THEN** Player B's score is `1` (odd) → `getPlayerSide(B)` returns `LEFT`
- **THEN** `getScoreCall()` returns `"1-2"`

#### Scenario: Score call flips on serve transfer

- **WHEN** Player A's score is `3`, Player B's score is `7`, A is serving → `getScoreCall()` returns `"3-7"`
- **WHEN** `winRally(B)` is called (A faults)
- **THEN** `getScoreCall()` returns `"7-3"` (B's score first)

##### Example: serve transfer side determination

| Scenario | A score | B score | Serving before | Serving after | New server side |
| -------- | ------- | ------- | -------------- | ------------- | --------------- |
| A faults | 2       | 1       | A              | B             | LEFT (1=odd)    |
| B faults | 3       | 2       | B              | A             | LEFT (3=odd)    |
| A faults | 4       | 0       | A              | B             | RIGHT (0=even)  |


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
### Requirement: Position assertion using score parity

`runPositionAssertion()` SHALL compare the serving player's `currentSide` against `expectedSide = score % 2 === 0 ? RIGHT : LEFT`. It SHALL throw an `Error` if they differ.

#### Scenario: Correct position passes assertion

- **WHEN** serving player's score is `4` (even) and `currentSide` is `RIGHT`
- **WHEN** `runPositionAssertion()` is called
- **THEN** no error is thrown

#### Scenario: Wrong position fails assertion

- **WHEN** serving player's score is `3` (odd) and `currentSide` is `RIGHT`
- **WHEN** `runPositionAssertion()` is called
- **THEN** an `Error` is thrown indicating side mismatch


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

A player SHALL win when their score reaches 11 or more AND leads the opponent by at least 2 points. `getStatus()` SHALL return `FINISHED` and `getWinner()` SHALL return the winning player's ID.

#### Scenario: Normal win at 11

- **WHEN** Player A is serving at `"10-8"` and `winRally(A)` is called
- **THEN** `getStatus()` returns `FINISHED`
- **THEN** `getWinner()` returns Player A's ID

#### Scenario: Deuce at 10-10 does not win

- **WHEN** Player A is serving at `"10-10"` and `winRally(A)` is called
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getScoreCall()` returns `"11-10"`

#### Scenario: Extended play win

- **WHEN** Player A is serving at `"11-10"` and `winRally(A)` is called
- **THEN** `getStatus()` returns `FINISHED`
- **THEN** `getWinner()` returns Player A's ID

#### Scenario: Opponent wins after serve transfer in deuce

- **WHEN** Player A is serving at `"11-11"` and `winRally(B)` is called (A faults → B serves)
- **WHEN** `winRally(B)` is called again
- **THEN** `getStatus()` returns `FINISHED`
- **THEN** `getWinner()` returns Player B's ID

##### Example: win condition boundary

| Score before | Rally winner | Status after |
| ------------ | ------------ | ------------ |
| "10-8" (A)   | A            | FINISHED     |
| "10-10" (A)  | A            | IN_PROGRESS  |
| "11-10" (A)  | A            | FINISHED     |
| "15-14" (A)  | A            | FINISHED     |


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

`undo()` SHALL restore the complete game state (both players' scores, both players' currentSide, servingPlayerId) to what it was immediately before the most recent `winRally()` call. Calling `undo()` when history is empty SHALL be a no-op.

#### Scenario: Undo reverses a score and side

- **WHEN** Player A scored at `"1-0"` (LEFT) → state became `"2-0"` with A on RIGHT
- **WHEN** `undo()` is called
- **THEN** `getScoreCall()` returns `"1-0"` and `getPlayerSide(A)` returns `LEFT`

#### Scenario: Undo reverses a serve transfer

- **WHEN** Player A faulted → serve transferred to B, `getScoreCall()` became `"1-3"` (B's score first)
- **WHEN** `undo()` is called
- **THEN** `getServingPlayer()` returns Player A's ID
- **THEN** `getScoreCall()` returns `"3-1"` (A's score first)

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