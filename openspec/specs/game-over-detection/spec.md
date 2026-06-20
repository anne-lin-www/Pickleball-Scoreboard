# game-over-detection Specification

## Purpose

TBD - created by archiving change 'ui-game-screen-wiring'. Update Purpose after archive.

## Requirements

### Requirement: Automatic game-over navigation on win condition

After each rally scored via the Game screen, the system SHALL check whether the game has reached FINISHED status and, if so, immediately navigate to the GameOver screen with the winner's display name.

#### Scenario: Game over triggered after winning rally

- **WHEN** the operator scores a rally that causes a team to reach the win condition
- **THEN** the Game screen SHALL call `onReset(winnerName)` where `winnerName` is the winner's display name from `SetupConfig`
- **THEN** the app SHALL transition to the GameOver screen

#### Scenario: Normal rally does not trigger game-over navigation

- **WHEN** the operator scores a rally that does not reach the win condition
- **THEN** the Game screen SHALL update the displayed score and serving indicators
- **THEN** the app SHALL remain on the Game screen

##### Example: win condition thresholds (doubles)

| Serving score | Receiving score | Result |
|---|---|---|
| 10 | 9 | IN_PROGRESS — no navigation |
| 11 | 9 | FINISHED — navigate to GameOver |
| 11 | 10 | IN_PROGRESS — no navigation (difference < 2) |
| 12 | 10 | FINISHED — navigate to GameOver |

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