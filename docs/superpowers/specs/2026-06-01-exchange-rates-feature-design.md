# Exchange Rates Feature — Design Spec

**Date:** 2026-06-01  
**Status:** Approved  
**Prototype:** CaTa Marine Pricing Tool (React UMD)

---

## Context

Previously, exchange rates were loaded via an Excel sheet. This feature replaces that workflow with a first-class experience built into the prototype, demonstrating awareness of exchange rate management during underwriting.

---

## Data Model

Add `exchangeRates` to `SETTINGS_DEFAULTS` in `app.jsx`. Rates are expressed relative to EUR as base currency.

```js
exchangeRates: [
  { currency: "USD", rate: 1.09 },
  { currency: "GBP", rate: 0.86 },
  { currency: "JPY", rate: 163.5 },
  { currency: "SGD", rate: 1.47 },
  { currency: "NOK", rate: 11.72 },
  { currency: "CHF", rate: 0.97 },
  { currency: "DKK", rate: 7.46 },
]
```

- EUR is the base currency (rate = 1.00, always read-only)
- Rates persist to `localStorage` key `cata_settings_v1` alongside existing settings
- Rates flow through `window.appSettings` so all screens and calc logic can access them

---

## Settings Screen — Exchange Rates Card

A second `DisplayCard` added to the `SettingsScreen` `DisplayCardGrid` in `steps.jsx`.

**Display card:**
- Title: "Exchange Rates"
- Compact table: Currency | Rate (vs EUR)
- 8 rows total: EUR base row (read-only, shows "1.00 — base") + 7 editable currencies

**Edit drawer:**
- Title: "Edit Exchange Rates"
- One `NumberInput` per currency, labeled with currency code
- EUR row shown as disabled/locked
- Hint text: "Rates are relative to EUR. Last updated: [today's date]."
- Save merges back into `settings` via the existing `onSave` pattern

---

## Top Nav — Exchange Rates Screen

A new dedicated informational screen, accessible from sidebar nav and via hash `#exchange-rates`.

**Nav item (sidebar):**
- Icon: `fa-coins`
- Label: "Exchange Rates"
- Positioned below the existing "Settings" nav item
- Hash: `#exchange-rates`

**Screen:**
- Same `step-header` pattern as Settings
- Title: "Exchange Rates"
- Description: "Current exchange rates used across this workbench. Base currency: EUR."
- Single `DisplayCard` titled "Today's Rates"
- Table columns: Currency (full name) | Code | Rate vs EUR
- 8 rows: EUR + 7 currencies
- Small "as of [date]" note at bottom of card
- Read-only — no editing on this screen
- Hint: "To update rates, go to Settings."

---

## Constraints

- Fixed list of 7 currencies (no add/remove in prototype)
- No live rate fetching — hardcoded realistic values
- Editing only via Settings screen; Exchange Rates screen is view-only

---

## Files to Change

| File | Change |
|------|--------|
| `src/app.jsx` | Add `exchangeRates` to `SETTINGS_DEFAULTS`; wire `#exchange-rates` hash; add nav item; render `ExchangeRatesScreen` |
| `src/steps.jsx` | Add Exchange Rates `DisplayCard` + drawer to `SettingsScreen`; add `ExchangeRatesScreen` component |
