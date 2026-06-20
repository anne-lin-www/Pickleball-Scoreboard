## ADDED Requirements

### Requirement: Reset game to initial state

The singles game SHALL provide a `reset()` method that restores all state to the values present immediately after construction. `reset()` SHALL be callable at any point during an in-progress or finished game.

The following SHALL be true after `reset()` is called:

- Score returns to `0-0`
- Serving player returns to the player passed as the first argument to the constructor
- Both players' score returns to `0`
- Both players' `currentSide` returns to `RIGHT`
- Status returns to `IN_PROGRESS`
- Winner returns to `null`
- Undo history is cleared (subsequent `undo()` calls are no-ops)

#### Scenario: Reset from in-progress game

- **WHEN** `winRally(playerA)` has been called one or more times
- **WHEN** `reset()` is called
- **THEN** `getScoreCall()` returns `"0-0"`
- **THEN** `getServingPlayer()` returns the player ID passed as first argument to the constructor
- **THEN** `getPlayerSide(playerA)` returns `RIGHT`
- **THEN** `getPlayerSide(playerB)` returns `RIGHT`
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getWinner()` returns `null`

#### Scenario: Reset from finished game

- **WHEN** the game has reached `FINISHED` state
- **WHEN** `reset()` is called
- **THEN** `getStatus()` returns `IN_PROGRESS`
- **THEN** `getWinner()` returns `null`
- **THEN** `getScoreCall()` returns `"0-0"`

#### Scenario: Reset clears undo history

- **WHEN** one or more `winRally()` calls have been made
- **WHEN** `reset()` is called
- **WHEN** `undo()` is called immediately after
- **THEN** `getScoreCall()` still returns `"0-0"` (undo is a no-op)

#### Scenario: Reset restores original serving player when serve has transferred

- **WHEN** the game was constructed with Player A serving first
- **WHEN** serve has transferred to Player B during play
- **WHEN** `reset()` is called
- **THEN** `getServingPlayer()` returns Player A's ID

#### Scenario: Reset is idempotent

- **WHEN** `reset()` is called multiple times in succession
- **THEN** each call leaves the game in the same initial state
- **THEN** `getScoreCall()` returns `"0-0"` after each call

##### Example: boundary cases

| Action sequence | Expected getScoreCall() | Expected getStatus() |
| --------------- | ----------------------- | -------------------- |
| new game → reset() | "0-0" | IN_PROGRESS |
| score 5 → reset() | "0-0" | IN_PROGRESS |
| finish game → reset() | "0-0" | IN_PROGRESS |
| score 3 → reset() → undo() | "0-0" | IN_PROGRESS |
