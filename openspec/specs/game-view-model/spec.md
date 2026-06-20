# game-view-model Specification

## Purpose

TBD - created by archiving change 'ui-game-screen-wiring'. Update Purpose after archive.

## Requirements

### Requirement: Unified view model derivation

The `deriveViewModel` function maps `SetupConfig` player name fields to `PlayerId` keys. After the P1/P2 convention fix, the mapping SHALL be:

- `TEAM_A_P1` → `config.teamAPlayer1` (1位, left side at even scores)
- `TEAM_A_P2` → `config.teamAPlayer2` (2位, right side at even scores, initial server)
- `TEAM_B_P1` → `config.teamBPlayer1` (1位, left side at even scores)
- `TEAM_B_P2` → `config.teamBPlayer2` (2位, right side at even scores, initial server)

The mapping keys in `gameViewModel.ts` remain unchanged (`TEAM_A_P1`, etc.); only the semantic understanding is clarified.

#### Scenario: P2 is shown as initial server on game screen

- **WHEN** a doubles game begins with TEAM_A serving first (score 0-0-2)
- **THEN** `deriveViewModel` returns `servingPlayerId` = `"TEAM_A_P2"`
- **THEN** the player rendered on the right side of TEAM_A's court half is the one whose name was entered as Player 2 in Setup
- **THEN** that player's cell displays the server indicator (●)


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
### Requirement: Winner name resolution

When a game is in FINISHED status, `deriveViewModel` SHALL resolve the winner's display name from `SetupConfig`.

#### Scenario: Doubles winner name

- **WHEN** `game.getStatus() === 'FINISHED'` and `game.getWinner() === 'TEAM_A'`
- **THEN** `winnerName` SHALL equal `config.teamAName`

#### Scenario: Singles winner name

- **WHEN** `game.getStatus() === 'FINISHED'` and `game.getWinner()` is a PlayerId starting with `'TEAM_B_'`
- **THEN** `winnerName` SHALL equal `config.teamBPlayer1`

<!-- @trace
source: ui-game-screen-wiring
updated: 2026-06-20
code:
  - src/core/gameInit.ts
  - design-preview-B.html
  - src/App.tsx
  - src/core/gameViewModel.ts
  - design-preview-A.html
  - src/screens/GameScreen.tsx
  - src/i18n/strings.ts
  - src/mock/gameState.ts
  - src/screens/SetupScreen.tsx
tests:
  - src/core/gameInit.test.ts
  - src/core/gameViewModel.test.ts
-->