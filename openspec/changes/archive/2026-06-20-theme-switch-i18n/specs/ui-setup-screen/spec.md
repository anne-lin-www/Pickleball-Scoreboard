## ADDED Requirements

### Requirement: ThemeToggle and LangToggle controls on Setup screen

The Setup screen SHALL render a `ThemeToggle` button and a `LangToggle` button in the top-right area of the screen. Both controls SHALL be visible without scrolling on a 375px-wide mobile viewport.

#### Scenario: Both controls visible on load

- **WHEN** the operator opens the Setup screen
- **THEN** a theme toggle button and a language toggle button SHALL both be visible in the top-right area of the screen

### Requirement: Localized Setup screen labels

All static text labels and button captions on the Setup screen SHALL use the active locale string via the `t` function from `LocaleContext`. This includes the mode toggle, team name inputs, player name inputs, first serve selector, court orientation selector, and the start match button.

#### Scenario: Labels switch on locale change

- **WHEN** locale changes from `zh-TW` to `en` while on the Setup screen
- **THEN** the start button SHALL change from `開始比賽` to `Start Match` and all form labels SHALL switch to their English equivalents

#### Scenario: zh-TW default on first load

- **WHEN** no locale preference is stored in localStorage
- **THEN** all Setup screen labels SHALL display in Traditional Chinese
