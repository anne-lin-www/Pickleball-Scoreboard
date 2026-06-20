# ui-language-switch Specification

## Purpose

The language switch feature enables the operator to toggle between supported locales (zh-TW and en). All user-visible text in the application is localized through a shared `LocaleContext` and `Strings` type, with the selected locale persisted across sessions via localStorage.

## Requirements

### Requirement: Two supported locales

The application SHALL support exactly two locales: `zh-TW` (Traditional Chinese, primary) and `en` (English). All UI strings SHALL have a translation in both locales.

#### Scenario: zh-TW strings in use

- **WHEN** locale is `zh-TW`
- **THEN** the Setup screen start button SHALL display `開始比賽`, the Game screen score label SHALL display `發球方 – 接球方 – 發球序號`, and the Game Over screen winner label SHALL display `勝利隊伍`

#### Scenario: en strings in use

- **WHEN** locale is `en`
- **THEN** the Setup screen start button SHALL display `Start Match`, the Game screen score label SHALL display `Serving – Receiving – Server #`, and the Game Over screen winner label SHALL display `Winner`

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Locale persistence via localStorage

The selected locale SHALL be persisted to `localStorage` under the key `pb-locale`. On application load, the stored locale SHALL be applied before first render. If no stored value exists or the value is invalid, `zh-TW` SHALL be used as the default.

#### Scenario: Stored locale restored on reload

- **WHEN** the operator has previously selected `en` and reloads the page
- **THEN** `en` locale SHALL be active without the operator taking any action

#### Scenario: Default locale on first load

- **WHEN** no `pb-locale` value exists in localStorage
- **THEN** `zh-TW` SHALL be active

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: LocaleContext React interface

A `LocaleContext` SHALL be provided with value type `{ locale: 'zh-TW' | 'en'; setLocale: (l: 'zh-TW' | 'en') => void; t: (key: keyof Strings) => string }`. The `t` function SHALL return the string for the active locale given a key from the `Strings` type. The context SHALL be provided at the application root.

#### Scenario: t function returns correct string

- **WHEN** locale is `zh-TW` and `t('startGame')` is called
- **THEN** the return value SHALL be `開始比賽`

- **WHEN** locale is `en` and `t('startGame')` is called
- **THEN** the return value SHALL be `Start Match`

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: Strings type covers all UI text

The `Strings` type in `src/i18n/strings.ts` SHALL define keys for every user-visible text label across all three screens. Required keys: `gameMode`, `doublesMode`, `singlesMode`, `teamName`, `player1`, `player2`, `firstServe`, `courtOrientation`, `topTeam`, `startGame`, `net`, `serving`, `scoreLabel`, `undo`, `reset`, `winnerLabel`, `rematch`.

#### Scenario: All keys present in both locales

- **WHEN** the `STRINGS` object is accessed
- **THEN** every key defined in `Strings` SHALL have a non-empty string value for both `zh-TW` and `en`

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->


<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->

---
### Requirement: LangToggle component placement

A `LangToggle` component SHALL appear only on the Setup screen alongside `ThemeToggle`. It SHALL NOT be rendered during the Game screen or Game Over screen.

#### Scenario: Toggle present on Setup

- **WHEN** the operator is on the Setup screen
- **THEN** both `ThemeToggle` and `LangToggle` SHALL be visible and tappable

#### Scenario: Toggle absent during game

- **WHEN** the operator is on the Game screen
- **THEN** no language toggle control SHALL be visible

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
-->

<!-- @trace
source: theme-switch-i18n
updated: 2026-06-20
code:
  - src/screens/GameScreen.tsx
  - screenshots/02-setup-courtday-zh.png
  - design-preview-A.html
  - design-preview-B.html
  - screenshots/01-setup-midnight-zh.png
  - src/screens/GameOverScreen.tsx
  - screenshots/04-game-courtday-en.png
  - screenshots/06-gameover-midnight-en.png
  - src/components/ThemeToggle.tsx
  - src/screens/SetupScreen.tsx
  - src/theme/ThemeContext.tsx
  - tailwind.config.ts
  - src/App.tsx
  - src/components/LangToggle.tsx
  - src/i18n/LocaleContext.tsx
  - screenshots/07-gameover-courtday-zh.png
  - index.html
  - src/i18n/strings.ts
  - screenshots/05-game-midnight-en.png
  - screenshots/03-setup-courtday-en.png
-->