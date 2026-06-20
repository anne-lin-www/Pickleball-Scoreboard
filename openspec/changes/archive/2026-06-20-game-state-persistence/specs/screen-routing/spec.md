## MODIFIED Requirements

### Requirement: App stores game instance after setup

After the operator submits the setup form, the App SHALL create and store a game instance alongside the SetupConfig so both are available to downstream screens.

#### Scenario: Game instance is created on form submission

- **WHEN** the operator submits the Setup form
- **THEN** App SHALL call `createGame(config)` and store the resulting instance in state
- **THEN** App SHALL transition to the game screen

#### Scenario: GameScreen receives game instance and config

- **WHEN** App renders the game screen
- **THEN** GameScreen SHALL receive both the game instance and the SetupConfig as props

#### Scenario: No game instance before setup is complete and no persisted state

- **WHEN** App first loads and no setup has been submitted and `localStorage['pickleball_game']` is absent
- **THEN** App SHALL render the Setup screen and game instance SHALL be null

## ADDED Requirements

### Requirement: App routes to Game Screen when persisted state exists

When the user confirms via ResumeDialog, the App SHALL reconstruct the game from persisted state and route to the Game Screen, bypassing the Setup Screen.

#### Scenario: Silent routing to Game Screen on F5 (session active)

- **GIVEN** `localStorage['pickleball_game']` contains valid JSON and `sessionStorage['pickleball_session']` is `'1'`
- **WHEN** the App mounts
- **THEN** the App SHALL render the Game Screen directly with the restored game instance and config
- **THEN** the App SHALL NOT render the Setup Screen or any dialog

#### Scenario: Routing to Game Screen after user confirms resume

- **WHEN** the App has shown the ResumeDialog and the user confirms "Resume"
- **THEN** the App SHALL render the Game Screen with the restored game instance and config
- **THEN** the App SHALL NOT render the Setup Screen
- **THEN** the ResumeDialog SHALL no longer be visible

#### Scenario: Routing stays on Setup Screen when user picks new game

- **WHEN** the App has shown the ResumeDialog and the user selects "New Game"
- **THEN** the App SHALL remain on the Setup Screen
- **THEN** the ResumeDialog SHALL no longer be visible
