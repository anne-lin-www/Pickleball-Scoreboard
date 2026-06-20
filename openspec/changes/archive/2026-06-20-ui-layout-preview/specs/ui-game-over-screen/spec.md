## ADDED Requirements

### Requirement: Winner announcement

The Game Over screen SHALL prominently display the name of the winning team.

#### Scenario: Winner displayed on game end

- **WHEN** the Game Over screen is shown
- **THEN** the winning team's name SHALL be displayed in large, readable text as the primary content of the screen

### Requirement: Rematch action

The Game Over screen SHALL provide a Rematch button that returns the operator to the Setup screen.

#### Scenario: Rematch navigates to Setup

- **WHEN** the operator presses the Rematch button
- **THEN** the app SHALL transition to the Setup screen
