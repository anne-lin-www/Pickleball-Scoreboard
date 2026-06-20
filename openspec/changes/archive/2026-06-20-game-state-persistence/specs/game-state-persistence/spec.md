## ADDED Requirements

### Requirement: Game state persists across page reload

The system SHALL save the current game state to `localStorage` under the key `pickleball_game` whenever the game instance changes during an active game session.

#### Scenario: State is saved on each rally

- **WHEN** a rally is scored and the game instance reference is updated
- **THEN** the system SHALL write the serialized game state and SetupConfig to `localStorage['pickleball_game']`
- **THEN** the written JSON SHALL include a `savedAt` field containing the current timestamp as an integer (milliseconds since epoch)

#### Scenario: State is saved on undo

- **WHEN** the user triggers undo
- **THEN** the system SHALL write the updated serialized game state to `localStorage['pickleball_game']`
- **THEN** the `savedAt` field SHALL be updated to the current timestamp

### Requirement: App rehydrates game state on mount

When the App mounts and persisted state is found, it SHALL choose the appropriate restoration strategy based on the sessionStorage session flag and the `savedAt` timestamp.

#### Scenario: Silent auto-restore on F5 (session active)

- **GIVEN** `localStorage['pickleball_game']` contains valid JSON
- **AND** `sessionStorage['pickleball_session']` is `'1'`
- **WHEN** the App mounts
- **THEN** the App SHALL reconstruct the game instance via `fromSerialized()` and navigate directly to the Game Screen
- **THEN** the App SHALL NOT display any dialog or prompt
- **THEN** `sessionStorage['pickleball_session']` SHALL remain set

#### Scenario: ResumeDialog with resume focus when tab closed recently (< 30 min)

- **GIVEN** `localStorage['pickleball_game']` contains valid JSON
- **AND** `sessionStorage['pickleball_session']` is absent
- **AND** `Date.now() - savedAt < 30 * 60 * 1000` (less than 30 minutes elapsed)
- **WHEN** the App mounts
- **THEN** the App SHALL display a ResumeDialog over the Setup Screen
- **THEN** the ResumeDialog SHALL show the previously saved team names from the stored config
- **THEN** the "Resume" button SHALL have default focus so that pressing Enter triggers it immediately

#### Scenario: ResumeDialog with new-game focus when browser closed long ago (≥ 30 min)

- **GIVEN** `localStorage['pickleball_game']` contains valid JSON
- **AND** `sessionStorage['pickleball_session']` is absent
- **AND** `Date.now() - savedAt >= 30 * 60 * 1000` (30 minutes or more elapsed)
- **WHEN** the App mounts
- **THEN** the App SHALL display a ResumeDialog over the Setup Screen
- **THEN** the ResumeDialog SHALL show the previously saved team names from the stored config
- **THEN** the "New Game" button SHALL have default focus so that pressing Enter triggers it

#### Scenario: No dialog when no persisted state on mount

- **WHEN** the App mounts and `localStorage['pickleball_game']` is absent or empty
- **THEN** the App SHALL render the Setup Screen normally with no ResumeDialog

#### Scenario: Persisted state is corrupted

- **WHEN** the App mounts and `localStorage['pickleball_game']` contains invalid JSON or an unrecognized shape
- **THEN** the App SHALL remove the corrupted key and render the Setup Screen normally with no ResumeDialog

### Requirement: ResumeDialog provides resume or new game choice

The ResumeDialog SHALL present two choices with distinct visual hierarchy: a primary "Resume" action and a secondary "New Game" action. Which button has default focus is controlled by the `defaultAction` prop.

#### Scenario: User chooses to resume

- **WHEN** the user presses Enter or clicks the "Resume" button in the ResumeDialog
- **THEN** the App SHALL reconstruct the game instance from the persisted data
- **THEN** the App SHALL navigate to the Game Screen with the restored game state and config
- **THEN** the ResumeDialog SHALL be dismissed

#### Scenario: User chooses new game

- **WHEN** the user clicks the "New Game" button in the ResumeDialog
- **THEN** the App SHALL call `localStorage.removeItem('pickleball_game')`
- **THEN** the ResumeDialog SHALL be dismissed
- **THEN** the App SHALL remain on the Setup Screen so the user can configure a new game

#### Scenario: Visual hierarchy stays fixed regardless of defaultAction

- **WHEN** the ResumeDialog is rendered with any `defaultAction` value
- **THEN** the "Resume" button SHALL always use the primary button style
- **THEN** the "New Game" button SHALL always use the secondary / outline button style

#### Scenario: defaultAction determines which button has autoFocus

- **WHEN** the ResumeDialog is rendered with `defaultAction === 'resume'`
- **THEN** the "Resume" button SHALL have `autoFocus`
- **WHEN** the ResumeDialog is rendered with `defaultAction === 'new-game'`
- **THEN** the "New Game" button SHALL have `autoFocus`

### Requirement: Game state is cleared on explicit exit

When the user explicitly leaves the game via an in-app action, the system SHALL remove the persisted game state from `localStorage` AND clear the session flag from `sessionStorage`.

#### Scenario: State cleared on rematch

- **WHEN** the user selects rematch on the Game Over screen
- **THEN** the system SHALL call `localStorage.removeItem('pickleball_game')` before navigating to Setup
- **THEN** the system SHALL remove `sessionStorage['pickleball_session']`

#### Scenario: State cleared on back-to-setup

- **WHEN** the user navigates back to Setup from the Game Over screen
- **THEN** the system SHALL call `localStorage.removeItem('pickleball_game')`
- **THEN** the system SHALL remove `sessionStorage['pickleball_session']`

### Requirement: Game classes expose serialization interface

`SinglesGame` and `DoublesGame` SHALL each expose a `serialize()` method and a `static fromSerialized()` factory that produce and consume a fully serializable plain-object representation of all internal state, including undo history.

#### Scenario: Round-trip serialization preserves game state

- **WHEN** `game.serialize()` is called and the result is passed to `XxxGame.fromSerialized(data)`
- **THEN** the reconstructed instance SHALL return identical values for all public getters (`getStatus`, `getWinner`, `getScoreCall`, `getServingPlayer`/`getServingTeam`, `getServerNumber`, `getPlayerSide`/`getTeamPositions`)

#### Scenario: Serialized format contains discriminant type field

- **WHEN** `SinglesGame.serialize()` is called
- **THEN** the returned object SHALL contain `type: 'singles'`
- **WHEN** `DoublesGame.serialize()` is called
- **THEN** the returned object SHALL contain `type: 'doubles'`

### Requirement: Persistence hook isolates localStorage and sessionStorage access

A custom hook `useGamePersistence` SHALL encapsulate all `localStorage` and `sessionStorage` read/write/remove operations and handle storage errors silently.

#### Scenario: localStorage unavailable does not crash the app

- **WHEN** `localStorage` is inaccessible (e.g., private browsing quota exceeded)
- **THEN** `saveGameState` and `clearGameState` SHALL silently fail without throwing
- **THEN** the app SHALL continue to function normally without persistence

#### Scenario: sessionStorage unavailable does not crash the app

- **WHEN** `sessionStorage` is inaccessible
- **THEN** `markSessionActive` SHALL silently fail without throwing
- **THEN** `isSessionActive` SHALL return `false` (default to showing the dialog rather than silent restore)

#### Scenario: Session flag is set when entering game screen

- **WHEN** the App navigates to the Game Screen (via setup form or resume)
- **THEN** `sessionStorage['pickleball_session']` SHALL be set to `'1'`
