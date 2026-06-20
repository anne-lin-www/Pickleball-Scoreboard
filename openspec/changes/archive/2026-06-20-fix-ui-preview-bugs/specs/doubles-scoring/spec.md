## ADDED Requirements

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
