## MODIFIED Requirements

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
