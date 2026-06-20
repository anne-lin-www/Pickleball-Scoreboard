## ADDED Requirements

### Requirement: Two DaisyUI custom themes

The application SHALL define exactly two custom DaisyUI themes in `tailwind.config.ts`: `court-day` (light) and `midnight-pro` (dark), using the Indigo Pro palette. Each theme SHALL set `base-100`, `base-200`, `base-300`, `base-content`, `primary`, `secondary`, and `accent` tokens.

#### Scenario: court-day tokens

- **WHEN** `court-day` theme is active
- **THEN** `primary` SHALL be `#4338ca` (Team A indigo-700), `secondary` SHALL be `#b45309` (Team B amber-700), `accent` SHALL be `#047857` (serving emerald-700), `base-100` SHALL be `#ffffff`, and `base-content` SHALL be `#0f172a`

#### Scenario: midnight-pro tokens

- **WHEN** `midnight-pro` theme is active
- **THEN** `primary` SHALL be `#818cf8` (Team A indigo-400), `secondary` SHALL be `#fbbf24` (Team B amber-400), `accent` SHALL be `#34d399` (serving emerald-400), `base-100` SHALL be `#0f172a`, and `base-content` SHALL be `#f1f5f9`

### Requirement: Theme persistence via localStorage

The selected theme SHALL be persisted to `localStorage` under the key `pb-theme`. On application load, the stored theme SHALL be applied before first render. If no stored value exists or the value is invalid, `midnight-pro` SHALL be used as the default.

#### Scenario: Stored theme restored on reload

- **WHEN** the operator has previously selected `court-day` and reloads the page
- **THEN** `court-day` SHALL be active without the operator taking any action

#### Scenario: Default theme on first load

- **WHEN** no `pb-theme` value exists in localStorage
- **THEN** `midnight-pro` SHALL be active

### Requirement: ThemeContext React interface

A `ThemeContext` SHALL be provided with value type `{ theme: 'court-day' | 'midnight-pro'; toggleTheme: () => void }`. The context SHALL be provided at the application root so all screens can read the current theme.

#### Scenario: Theme toggle switches value

- **WHEN** current theme is `midnight-pro` and `toggleTheme` is called
- **THEN** theme SHALL become `court-day`, `document.documentElement` `data-theme` attribute SHALL be set to `court-day`, and `localStorage['pb-theme']` SHALL be `'court-day'`

- **WHEN** current theme is `court-day` and `toggleTheme` is called
- **THEN** theme SHALL become `midnight-pro`, `document.documentElement` `data-theme` attribute SHALL be set to `midnight-pro`, and `localStorage['pb-theme']` SHALL be `'midnight-pro'`

### Requirement: ThemeToggle component placement

A `ThemeToggle` component SHALL appear only on the Setup screen. It SHALL NOT be rendered during the Game screen or Game Over screen.

#### Scenario: Toggle absent during game

- **WHEN** the operator is on the Game screen
- **THEN** no theme toggle control SHALL be visible

#### Scenario: Toggle present on Setup

- **WHEN** the operator is on the Setup screen
- **THEN** a theme toggle control SHALL be visible and tappable
