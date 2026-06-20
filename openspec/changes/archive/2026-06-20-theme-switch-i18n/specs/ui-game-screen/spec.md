## ADDED Requirements

### Requirement: Team-colored score display

The three-segment score SHALL display each team's score in that team's theme color using DaisyUI semantic tokens. Team A score SHALL use `text-primary` and Team B score SHALL use `text-secondary`. The server number SHALL use `text-accent`. In `midnight-pro` theme, `primary` resolves to `#818cf8` (indigo-400), `secondary` to `#fbbf24` (amber-400), and `accent` to `#34d399` (emerald-400). In `court-day` theme, `primary` resolves to `#4338ca` (indigo-700), `secondary` to `#b45309` (amber-700), and `accent` to `#047857` (emerald-700).

#### Scenario: Score colors in midnight-pro

- **WHEN** `midnight-pro` theme is active and Team A is serving with score 6–4–1
- **THEN** the `6` SHALL render in `#818cf8` (indigo), the `4` in `#fbbf24` (amber), and the `1` in `#34d399` (emerald)

#### Scenario: Score colors in court-day

- **WHEN** `court-day` theme is active and Team A is serving with score 6–4–1
- **THEN** the `6` SHALL render in `#4338ca` (indigo), the `4` in `#b45309` (amber), and the `1` in `#047857` (emerald)

### Requirement: Localized UI text labels

All static text labels on the Game screen SHALL use the active locale string via the `t` function from `LocaleContext`. The net label, score sub-label, undo button, and reset button SHALL all be localized.

#### Scenario: Labels switch on locale change

- **WHEN** locale changes from `zh-TW` to `en` while on the Game screen
- **THEN** the net label SHALL change from `球網` to `Net`, the undo button from `↩ 復原` to `↩ Undo`, and the reset button from `重設` to `Reset`

### Requirement: Themed court half backgrounds

The serving team's court half SHALL use a visually distinct background derived from the team's DaisyUI `primary` or `secondary` token at low opacity (`/10`). In `midnight-pro`, Team A serving half uses `bg-primary/10` (indigo tint on dark); Team B serving half uses `bg-secondary/10` (amber tint on dark). In `court-day`, the same classes apply but resolve to lighter indigo and amber tints on white. The non-serving half SHALL use `bg-base-100`.

#### Scenario: Serving half highlighted in midnight-pro

- **WHEN** Team A is serving in `midnight-pro` theme
- **THEN** Team A's court half SHALL have an indigo-tinted background (`bg-primary/10`) and Team B's half SHALL use `bg-base-100`

#### Scenario: Serving half highlighted in court-day

- **WHEN** Team B is serving in `court-day` theme
- **THEN** Team B's court half SHALL have an amber-tinted background (`bg-secondary/10`) and Team A's half SHALL use `bg-base-100`

### Requirement: Font family on Game screen

All text on the Game screen SHALL use the unified font stack `Inter, Noto Sans TC, sans-serif`. Score numbers SHALL use `font-weight: 900` with `font-feature-settings: 'tnum'` (tabular numerals).

#### Scenario: Score numerals are tabular

- **WHEN** the operator views the Game screen
- **THEN** score digits SHALL be fixed-width (tabular) so the layout does not shift as numbers change
