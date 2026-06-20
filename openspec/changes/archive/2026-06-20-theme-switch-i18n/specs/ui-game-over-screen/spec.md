## ADDED Requirements

### Requirement: Localized Game Over screen text

All static text on the Game Over screen SHALL use the active locale string via the `t` function from `LocaleContext`. The winner label and the rematch button SHALL be localized.

#### Scenario: Labels in zh-TW

- **WHEN** locale is `zh-TW` and the Game Over screen is displayed
- **THEN** the winner label SHALL display `勝利隊伍` and the rematch button SHALL display `再來一局`

#### Scenario: Labels in en

- **WHEN** locale is `en` and the Game Over screen is displayed
- **THEN** the winner label SHALL display `Winner` and the rematch button SHALL display `Rematch`
