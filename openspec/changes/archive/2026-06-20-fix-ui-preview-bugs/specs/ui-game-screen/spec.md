## MODIFIED Requirements

### Requirement: Serving player indicator

The Game screen SHALL mark the current server with a visible indicator (●) next to their name on the court. The current server SHALL be determined by `GameViewModel.servingPlayerId` — the player whose `id` equals `servingPlayerId` is the server. This correctly handles the doubles first-server exception (0-0-2 start), server #1 → #2 transitions, and mid-serve side switches.

#### Scenario: Server marked on court — first-server exception (0-0-2)

- **WHEN** a Doubles game starts at score 0-0-2
- **THEN** the anchor player (TEAM_A_P1 or TEAM_B_P1 per the first serving team) SHALL have a ● indicator, as they are the first server under the first-server exception

#### Scenario: Server marked on court — server #2 after fault

- **WHEN** server #1 faults and the server number advances to 2
- **THEN** the partner player (who was server #2 in waiting) SHALL have a ● indicator

#### Scenario: Non-servers unmarked

- **WHEN** a player is not the current server
- **THEN** no ● indicator SHALL appear next to their name
