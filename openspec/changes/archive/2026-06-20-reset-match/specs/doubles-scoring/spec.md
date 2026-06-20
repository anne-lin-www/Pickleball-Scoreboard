## ADDED Requirements

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
