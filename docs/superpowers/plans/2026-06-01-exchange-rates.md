# Exchange Rates Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add exchange rate data (EUR-based, 7 currencies) to the prototype — editable in Settings, displayed on a dedicated top-nav screen.

**Architecture:** Rates live in `settings` state in `app.jsx` (same as locale/currency). `SettingsScreen` in `steps.jsx` gets a second DisplayCard + edit drawer. A new `ExchangeRatesScreen` component in `steps.jsx` renders a read-only view. `app.jsx` wires the new hash, nav item, and screen render.

**Tech Stack:** React 18 UMD (no build step), Babel standalone, plain JS — same as the rest of the prototype.

---

## Files to Modify

| File | What changes |
|------|-------------|
| `src/app.jsx` | Add `exchangeRates` to `SETTINGS_DEFAULTS`; extend hash guard + hashchange handler for `exchange-rates`; add Exchange Rates nav item below Settings in Sidebar; extend main render to show `ExchangeRatesScreen` when `activeId === "exchange-rates"` |
| `src/steps.jsx` | Add Exchange Rates `DisplayCard` + edit drawer to `SettingsScreen`; add `ExchangeRatesScreen` component; export it on `window` |

---

### Task 1: Add `exchangeRates` to `SETTINGS_DEFAULTS` in `app.jsx`

**Files:**
- Modify: `src/app.jsx` lines 9–17

- [ ] **Step 1: Update `SETTINGS_DEFAULTS`**

Replace the current defaults block:

```js
const SETTINGS_DEFAULTS = {
  preset:     "Germany",
  locale:     "de-DE",
  currency:   "EUR",
  timezone:   "Europe/Berlin",
  language:   "en",
  unitSystem: "metric",
  dateFormat: "DD.MM.YYYY",
  exchangeRates: [
    { currency: "USD", code: "USD", rate: 1.09 },
    { currency: "GBP", code: "GBP", rate: 0.86 },
    { currency: "JPY", code: "JPY", rate: 163.5 },
    { currency: "SGD", code: "SGD", rate: 1.47 },
    { currency: "NOK", code: "NOK", rate: 11.72 },
    { currency: "CHF", code: "CHF", rate: 0.97 },
    { currency: "DKK", code: "DKK", rate: 7.46 },
  ],
};
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:8765`. Open browser console and run:
```js
window.appSettings.exchangeRates
```
Expected: array of 7 objects with `currency`, `code`, `rate`.

- [ ] **Step 3: Commit**

```bash
git add src/app.jsx
git commit -m "feat(exchange-rates): add exchangeRates to SETTINGS_DEFAULTS"
```

---

### Task 2: Wire `exchange-rates` hash + nav item in `app.jsx`

**Files:**
- Modify: `src/app.jsx` — `App()` function (lines ~255–264), `Sidebar` component (lines ~510–520), main render block (lines ~379–403)

- [ ] **Step 1: Extend the initial `activeId` resolver**

Current code (line ~257):
```js
return (hash && STEP_COMP[hash]) || hash === "settings" ? hash : "general";
```
Replace with:
```js
return (hash && STEP_COMP[hash]) || hash === "settings" || hash === "exchange-rates" ? hash : "general";
```

- [ ] **Step 2: Extend the `hashchange` handler**

Current code (line ~264):
```js
if (hash && (STEP_COMP[hash] || hash === "settings")) setActiveId(hash);
```
Replace with:
```js
if (hash && (STEP_COMP[hash] || hash === "settings" || hash === "exchange-rates")) setActiveId(hash);
```

- [ ] **Step 3: Add Exchange Rates nav item in `Sidebar`**

After the existing Settings `<li>` block (lines ~511–520), add:
```jsx
<li>
  <div
    className={`nav-flat ${activeId === "exchange-rates" ? "is-active" : ""}`}
    onClick={() => onPick("exchange-rates")}
  >
    <span className="nav-dot" />
    <span className="nav-group__icon"><Icon name="coins" size={14} /></span>
    <span className="nav-group__label">Exchange Rates</span>
  </div>
</li>
```

Note: `Sidebar` already receives `activeId` and `onPick` as props — no prop changes needed.

- [ ] **Step 4: Extend the main render block**

Current render logic (lines ~379–386):
```jsx
<main className="main" data-screen-label={activeId === "settings" ? "Settings" : activeLabel}>
  <div className="main__scroll">
    <div className="main__inner">
      {activeId !== "settings" ? <PartnerBanner state={state} setSlice={setSlice} /> : null}
      {activeId === "settings"
        ? <SettingsScreen settings={settings} onSave={setSettings} />
        : <StepComp state={state} set={setSlice} settings={settings} />
      }
```

Replace with:
```jsx
<main className="main" data-screen-label={
  activeId === "settings" ? "Settings"
  : activeId === "exchange-rates" ? "Exchange Rates"
  : activeLabel
}>
  <div className="main__scroll">
    <div className="main__inner">
      {activeId !== "settings" && activeId !== "exchange-rates"
        ? <PartnerBanner state={state} setSlice={setSlice} />
        : null}
      {activeId === "settings"
        ? <SettingsScreen settings={settings} onSave={setSettings} />
        : activeId === "exchange-rates"
          ? <ExchangeRatesScreen settings={settings} onOpenSettings={() => { setActiveId("settings"); window.location.hash = "settings"; }} />
          : <StepComp state={state} set={setSlice} settings={settings} />
      }
```

- [ ] **Step 5: Also extend the footer guard** (line ~389)

Current:
```jsx
{activeId !== "settings" ? (
```
Replace with:
```jsx
{activeId !== "settings" && activeId !== "exchange-rates" ? (
```

- [ ] **Step 6: Verify in browser**

Navigate to `http://localhost:8765/#exchange-rates`. Expected: blank main area (no crash), no partner banner, no footer nav. Sidebar shows "Exchange Rates" item as active with a coins icon.

- [ ] **Step 7: Commit**

```bash
git add src/app.jsx
git commit -m "feat(exchange-rates): wire hash, nav item, and screen slot"
```

---

### Task 3: Add Exchange Rates card + drawer to `SettingsScreen` in `steps.jsx`

**Files:**
- Modify: `src/steps.jsx` — `SettingsScreen` function (lines ~1702–1829)

- [ ] **Step 1: Add rate editing to drawer state**

The `SettingsScreen` already has `draft` state seeded from `{ ...settings }`. Since `exchangeRates` is now part of `settings`, the draft already carries it. No state changes needed — just add UI.

- [ ] **Step 2: Add a helper to update a single rate in the draft**

Inside `SettingsScreen`, after `const setDraftKey = (k, v) => ...` add:
```js
const setDraftRate = (code, value) => setDraft((d) => ({
  ...d,
  exchangeRates: d.exchangeRates.map((r) =>
    r.code === code ? { ...r, rate: parseFloat(value) || r.rate } : r
  ),
}));
```

- [ ] **Step 3: Add the Exchange Rates `DisplayCard` to the display grid**

In the `return` block of `SettingsScreen`, inside `<DisplayCardGrid>`, add a second card after the existing "Regional & Display Settings" card:

```jsx
<DisplayCard title="Exchange Rates" onEdit={openDrawer}>
  <DisplayField label="Base Currency" value="EUR — 1.00 (base)" />
  {settings.exchangeRates.map((r) => (
    <DisplayField key={r.code} label={r.code} value={r.rate.toFixed(4)} mono />
  ))}
</DisplayCard>
```

Note: both cards share the same `openDrawer` — the drawer will contain both regional and rate fields.

- [ ] **Step 4: Add exchange rate fields to the existing edit drawer**

Inside the `<Drawer>` block, after the Unit System `<Field>`, add:

```jsx
<div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 4 }}>
  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
    Exchange Rates — Base: EUR
  </div>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    <Field label="EUR" hint="Base currency">
      <div className="input input--disabled">
        <span className="input__el" style={{ padding: "6px 10px", display: "block", fontFamily: "monospace" }}>1.0000</span>
      </div>
    </Field>
    {draft.exchangeRates.map((r) => (
      <Field key={r.code} label={r.code}>
        <input
          className="input__el"
          type="number"
          step="0.0001"
          min="0"
          value={r.rate}
          onChange={(e) => setDraftRate(r.code, e.target.value)}
          style={{ width: "100%", padding: "6px 10px", fontFamily: "monospace", border: "1px solid var(--border)", borderRadius: 4, fontSize: 14 }}
        />
      </Field>
    ))}
  </div>
  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
    Rates relative to EUR. Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.
  </div>
</div>
```

- [ ] **Step 5: Verify in browser**

Go to Settings. Expected:
- Two DisplayCards visible: "Regional & Display Settings" and "Exchange Rates"
- Exchange Rates card shows EUR base row + 7 currency rows with rates
- Click "Edit" on either card → drawer opens with both regional fields AND the exchange rate grid at the bottom
- EUR field is disabled/read-only
- Change a rate value → save → card reflects new value

- [ ] **Step 6: Commit**

```bash
git add src/steps.jsx
git commit -m "feat(exchange-rates): add exchange rates card and drawer fields to SettingsScreen"
```

---

### Task 4: Add `ExchangeRatesScreen` component to `steps.jsx`

**Files:**
- Modify: `src/steps.jsx` — add new component before the final `window.SettingsScreen = SettingsScreen;` line

- [ ] **Step 1: Define the currency full-name lookup**

Add this constant just before the `ExchangeRatesScreen` function:

```js
const CURRENCY_NAMES = {
  EUR: "Euro",
  USD: "US Dollar",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  SGD: "Singapore Dollar",
  NOK: "Norwegian Krone",
  CHF: "Swiss Franc",
  DKK: "Danish Krone",
};
```

- [ ] **Step 2: Write the `ExchangeRatesScreen` component**

```jsx
function ExchangeRatesScreen({ settings, onOpenSettings }) {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const allRates = [
    { code: "EUR", name: "Euro", rate: 1.0000, isBase: true },
    ...settings.exchangeRates.map((r) => ({
      code: r.code,
      name: CURRENCY_NAMES[r.code] || r.code,
      rate: r.rate,
      isBase: false,
    })),
  ];

  return (
    <div className="settings-screen">
      <div className="step-header">
        <h2 className="step-title">Exchange Rates</h2>
        <p className="step-desc">Current exchange rates used across this workbench. Base currency: EUR.</p>
      </div>

      <DisplayCardGrid>
        <DisplayCard title="Today's Rates">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Currency</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Code</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rate vs EUR</th>
              </tr>
            </thead>
            <tbody>
              {allRates.map((r) => (
                <tr key={r.code} style={{ borderBottom: "1px solid var(--border-subtle, #f0f0f0)" }}>
                  <td style={{ padding: "8px 8px", color: "var(--text)" }}>
                    {r.name}
                    {r.isBase ? <span style={{ marginLeft: 8, fontSize: 11, background: "var(--accent-tint)", color: "var(--accent)", padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>base</span> : null}
                  </td>
                  <td style={{ padding: "8px 8px", fontFamily: "monospace", color: "var(--text-muted)" }}>{r.code}</td>
                  <td style={{ padding: "8px 8px", textAlign: "right", fontFamily: "monospace", fontWeight: r.isBase ? 600 : 400 }}>{r.rate.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>as of {today}</span>
            <button
              className="btn btn--ghost"
              style={{ fontSize: 12, padding: "4px 10px" }}
              onClick={onOpenSettings}
            >
              Update rates in Settings →
            </button>
          </div>
        </DisplayCard>
      </DisplayCardGrid>
    </div>
  );
}
```

- [ ] **Step 3: Export on `window`**

After the existing `window.SettingsScreen = SettingsScreen;` line, add:
```js
window.ExchangeRatesScreen = ExchangeRatesScreen;
```

- [ ] **Step 4: Verify in browser**

Navigate to `http://localhost:8765/#exchange-rates`. Expected:
- Page header: "Exchange Rates" title + description
- A card titled "Today's Rates" with an 8-row table (EUR base + 7 currencies)
- EUR row has a green "base" badge
- Rates show 4 decimal places
- "as of [today's date]" bottom-left
- "Update rates in Settings →" button bottom-right — clicking it navigates to Settings

- [ ] **Step 5: Verify round-trip**

1. Go to Settings → Edit exchange rates → change USD rate to `1.15` → Save
2. Navigate to Exchange Rates screen
3. Expected: USD row shows `1.1500`

- [ ] **Step 6: Verify localStorage persistence**

1. Change a rate in Settings and save
2. Hard-reload the page (`Cmd+Shift+R`)
3. Navigate to Exchange Rates
4. Expected: changed rate is still there

- [ ] **Step 7: Commit**

```bash
git add src/steps.jsx
git commit -m "feat(exchange-rates): add ExchangeRatesScreen component"
```

---

## Done

After Task 4 the feature is complete:
- `exchangeRates` in settings state, persisted to localStorage
- Settings screen: Exchange Rates card (read) + edit drawer (write)
- Top nav: dedicated Exchange Rates screen (read-only, links back to Settings)
- Hash `#exchange-rates` deep-linkable, back/forward works
