# Settings Menu — Design Spec

**Date:** 2026-05-29
**Project:** CaTa Marine Interactive Prototype
**Location:** `~/.claude/screensMarine/HDI-Marine Form/`

---

## Overview

Add a Settings screen to the CaTa Marine prototype that lets users configure regional and display preferences (locale, currency, number format, date format, timezone, language, unit system). Settings are reactive — changing them updates all formatted values throughout the app immediately. The UI follows the existing DisplayCard + Drawer pattern.

---

## 1. State & Data Model

A `settings` object is added to `app.jsx` as a top-level `React.useState` hook and passed down as props to all steps and components.

```js
const [settings, setSettings] = React.useState({
  locale: "de-DE",          // drives number + date formatting (BCP 47)
  currency: "EUR",          // ISO 4217
  timezone: "Europe/Berlin",
  language: "en",           // "en" | "de"
  unitSystem: "metric"      // "metric" | "imperial"
});
```

**Locale presets** (convenience shortcuts that set all fields at once):

| Preset | locale | currency | timezone | dateFormat |
|---|---|---|---|---|
| Germany | de-DE | EUR | Europe/Berlin | DD.MM.YYYY |
| USA | en-US | USD | America/New_York | MM/DD/YYYY |
| UK | en-GB | GBP | Europe/London | DD/MM/YYYY |
| Custom | — | (manual) | (manual) | (manual) |

**Formatting utilities** (in `calc.jsx`):

- `formatNumber(value, settings)` — uses `Intl.NumberFormat` with `settings.locale` and `settings.currency`
- `formatDate(value, settings)` — uses `Intl.DateTimeFormat` with `settings.locale` and `settings.timezone`

All number and date rendering throughout the app is routed through these utilities. Inline hardcoded formatting is replaced on a best-effort basis.

---

## 2. Navigation & Header

### Sidebar

The 13 workflow steps render as today. Below them:

```
[step items...]
<div className="nav-divider" />   ← subtle hr with optional "System" label
[Settings nav item — fa-gear icon, same style as other nav items]
```

When `currentStep === "settings"`, the Settings nav item receives the active highlight class.

### Header

A gear icon button (`fa-gear`, 14px, `#575757`) is added to the top-right of the header bar. Clicking it sets `currentStep = "settings"`. When settings is active, the icon is highlighted (accent green `#65A518`).

---

## 3. Settings Screen

Rendered when `currentStep === "settings"`. Replaces the main step content area.

### Read-only view (DisplayCardGrid)

A single card — **"Regional & Display Settings"** — showing all current values:

| Label | Example |
|---|---|
| Locale Preset | Germany |
| Language | English |
| Currency | EUR — Euro |
| Number Format | 1.234,56 |
| Date Format | DD.MM.YYYY |
| Timezone | Europe/Berlin |
| Unit System | Metric |

A pencil (edit) action opens the Drawer.

### Drawer (edit)

Contains a draft copy of `settings`. Fields:

1. **Locale Preset** — dropdown (Germany / USA / UK / Custom). Selecting a preset auto-fills all fields below.
2. **Language** — toggle (English / German)
3. **Currency** — dropdown (EUR, USD, GBP, + others)
4. **Number Format** — read-only live preview (e.g. `1.234,56`) that updates as locale/currency change; driven by `Intl.NumberFormat`
5. **Date Format** — dropdown (DD.MM.YYYY / MM/DD/YYYY / YYYY-MM-DD)
6. **Timezone** — dropdown (common zones; Europe/Berlin, America/New_York, Europe/London, Asia/Singapore, UTC)
7. **Unit System** — toggle (Metric / Imperial)

**Save:** merges draft into `settings` state → all formatted values across the app update immediately.
**Cancel:** discards draft, closes drawer.

---

## 4. Reactivity

All steps that display numbers (premiums, TSI, deductibles, limits) and dates use `formatNumber` / `formatDate`. On settings save, React re-renders propagate the new `settings` prop, updating all displayed values without any manual refresh.

---

## 5. Files Changed

| File | Change |
|---|---|
| `src/app.jsx` | Add `settings` state; pass as prop; add gear icon to header; add nav divider + Settings nav item; render `<SettingsScreen>` when `currentStep === "settings"` |
| `src/steps.jsx` | Add `SettingsScreen` component (DisplayCard + Drawer) |
| `src/calc.jsx` | Add `formatNumber(value, settings)` and `formatDate(value, settings)` utilities |
| `src/components.jsx` | Add `NavDivider` component |
| `src/styles.css` | Styles for `.nav-divider`, gear icon active state |

---

## 6. Out of Scope

- Persisting settings to `localStorage` (not needed for prototype demo)
- Full German UI translation (language toggle is present but wiring all labels is deferred)
- Exhaustive replacement of every hardcoded number (best-effort; high-visibility fields prioritised)
