# Settings Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reactive Settings screen (locale, currency, number format, date format, timezone, language, unit system) accessible via a gear icon in the header and a sidebar nav item with a visual divider, using the existing DisplayCard + Drawer pattern.

**Architecture:** A `settings` state object lives in `App` and is passed as a prop to all steps. Two formatting utilities (`formatNumber`, `formatDate`) are added to `calc.jsx` and used throughout for reactive re-rendering. The Settings screen is rendered when `activeId === "settings"` — a special value outside the workflow step array.

**Tech Stack:** React 18 (UMD, no build step), Babel standalone, `Intl.NumberFormat`, `Intl.DateTimeFormat`, Font Awesome 6 icons, existing DisplayCard + Drawer component pattern.

---

## File Map

| File | Change |
|---|---|
| `src/calc.jsx` | Add `formatNumber(value, settings)` and `formatDate(value, settings)` to the `CALC` export |
| `src/components.jsx` | Add `NavDivider` component |
| `src/app.jsx` | Add `settings` state + `SETTINGS_DEFAULTS`; pass `settings` as prop; add gear icon to `Header`; add divider + Settings item to `Sidebar`; render `<SettingsScreen>` when `activeId === "settings"`; guard footer prev/next from settings screen |
| `src/steps.jsx` | Add `SettingsScreen` component (DisplayCard read-only + Drawer with all fields) |
| `src/styles.css` | Styles for `.nav-divider`, gear icon active/hover state in header |

---

## Task 1: Add formatting utilities to calc.jsx

**Files:**
- Modify: `src/calc.jsx`

- [ ] **Step 1: Add `formatNumber` and `formatDate` to the CALC export**

Open `src/calc.jsx`. The file ends with `return { run };`. Replace that with:

```js
  function formatNumber(value, settings) {
    if (value == null || value === "") return "—";
    const s = settings || {};
    const locale = s.locale || "en-GB";
    const currency = s.currency || "EUR";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value) || 0));
  }

  function formatNumberPlain(value, settings) {
    if (value == null || value === "") return "—";
    const s = settings || {};
    const locale = s.locale || "en-GB";
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value) || 0));
  }

  function formatDate(value, settings) {
    if (!value) return "—";
    const s = settings || {};
    const locale = s.locale || "en-GB";
    // value is a string like "31/05/2026" or "01.01.2026" — parse it
    // Try DD/MM/YYYY and DD.MM.YYYY
    const parts = value.split(/[\/\.\-]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const dt = new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
      if (!isNaN(dt)) {
        return new Intl.DateTimeFormat(locale, {
          day: "2-digit", month: "2-digit", year: "numeric",
          timeZone: s.timezone || "Europe/Berlin",
        }).format(dt);
      }
    }
    return value; // fallback: return as-is
  }

  return { run, formatNumber, formatNumberPlain, formatDate };
```

- [ ] **Step 2: Verify the file is valid by checking syntax**

Open `http://localhost:8765` in a browser (run `python3 -m http.server 8765` from `~/.claude/screensMarine/HDI-Marine Form/` if not running). Open browser DevTools console — there should be no errors. Confirm `CALC.formatNumber(1234567, { locale: "de-DE", currency: "EUR" })` returns `"1.234.567 €"` or similar German format.

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add src/calc.jsx
git commit -m "feat: add formatNumber, formatNumberPlain, formatDate utilities to CALC"
```

---

## Task 2: Add NavDivider component and styles

**Files:**
- Modify: `src/components.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add NavDivider to components.jsx**

At the end of `src/components.jsx`, before the final closing lines, add:

```jsx
function NavDivider({ label }) {
  return (
    <li className="nav-divider" aria-hidden="true">
      {label ? <span className="nav-divider__label">{label}</span> : null}
    </li>
  );
}
```

Make sure `NavDivider` is accessible globally (the file uses no module exports — components are global by convention in this app). If there's a `window.NavDivider` pattern elsewhere, add `window.NavDivider = NavDivider;` — otherwise it's fine as-is since all code is in one bundle scope.

- [ ] **Step 2: Add styles to styles.css**

In `src/styles.css`, find the section with `.nav-item`, `.nav-group` styles and append:

```css
/* Nav divider */
.nav-divider {
  list-style: none;
  margin: 8px 12px 4px;
  border-top: 1px solid var(--border);
  position: relative;
}
.nav-divider__label {
  position: absolute;
  top: -8px;
  left: 0;
  background: var(--sidebar-bg, var(--surface));
  padding: 0 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--fg-muted);
  text-transform: uppercase;
}

/* Gear icon in header */
.header-gear {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--fg-muted);
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s;
}
.header-gear:hover,
.header-gear.is-active {
  color: var(--accent);
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add src/components.jsx src/styles.css
git commit -m "feat: add NavDivider component and gear/divider styles"
```

---

## Task 3: Add settings state and wire header + sidebar in app.jsx

**Files:**
- Modify: `src/app.jsx`

- [ ] **Step 1: Add SETTINGS_DEFAULTS and settings state to App**

At the top of `src/app.jsx`, after `TWEAK_DEFAULTS`, add:

```js
const SETTINGS_DEFAULTS = {
  preset:     "Germany",
  locale:     "de-DE",
  currency:   "EUR",
  timezone:   "Europe/Berlin",
  language:   "en",
  unitSystem: "metric",
  dateFormat: "DD.MM.YYYY",
};
```

Inside the `App` function, after the `useState_app` calls, add:

```js
const [settings, setSettings] = useState_app(SETTINGS_DEFAULTS);
```

Also add localStorage persistence for settings (alongside the existing `cata_state_v3` effect):

```js
useEffect_app(() => {
  try {
    const saved = localStorage.getItem("cata_settings_v1");
    if (saved) setSettings((s) => ({ ...s, ...JSON.parse(saved) }));
  } catch (e) {}
}, []);
useEffect_app(() => {
  try { localStorage.setItem("cata_settings_v1", JSON.stringify(settings)); } catch (e) {}
}, [settings]);
```

- [ ] **Step 2: Add gear icon to Header**

The `Header` component currently receives `{ onOpenTweaks, tweaksOpen }`. Update its signature to also accept `onOpenSettings` and `settingsActive`, and add the gear button:

```jsx
function Header({ onOpenTweaks, tweaksOpen, onOpenSettings, settingsActive }) {
  return (
    <header className="header">
      <div className="header__l">
        <a className="brandmark" href="#">
          <img src="src/hdi-logo.png" alt="HDI" height="34" style={{ display: "block" }} />
          <span className="brandmark__divider" />
          <span className="brandmark__title">Underwriting Workbench</span>
          <span className="brandmark__divider" />
          <span className="brandmark__title" style={{ fontWeight: 400, color: "var(--fg-muted)" }}>Marine</span>
        </a>
      </div>
      <div className="header__r">
        <a className="header-link" href="#"><Icon name="feedback" size={14} /> Feedback</a>
        <a className="header-link" href="#"><Icon name="links" size={14} /> Links</a>
        <button
          className={`header-gear ${settingsActive ? "is-active" : ""}`}
          onClick={onOpenSettings}
          title="Settings"
        >
          <i className="fa-solid fa-gear" style={{ fontSize: 14 }} />
          Settings
        </button>
        <a className="header-user" href="#">
          <Icon name="user" size={14} />
          Mustermann, Max
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update Header usage in App render**

In the `App` return JSX, update the `<Header>` call:

```jsx
<Header
  onOpenTweaks={() => setTweaksOpen((o) => !o)}
  tweaksOpen={tweaksOpen}
  onOpenSettings={() => setActiveId("settings")}
  settingsActive={activeId === "settings"}
/>
```

- [ ] **Step 4: Add divider + Settings item to Sidebar**

In the `Sidebar` component, update the props to accept `activeId` (already there) and render the divider + settings item after the `nav.map(...)`. The `<ul className="navlist">` currently ends after the map. Update it:

```jsx
<ul className="navlist">
  {nav.map((n) => {
    /* ... existing map unchanged ... */
  })}
  <NavDivider label="System" />
  <li>
    <div
      className={`nav-flat ${activeId === "settings" ? "is-active" : ""}`}
      onClick={() => onPick("settings")}
    >
      <span className="nav-dot" />
      <span className="nav-group__icon"><i className="fa-solid fa-gear" style={{ fontSize: 14, color: activeId === "settings" ? "var(--accent)" : "#575757" }} /></span>
      <span className="nav-group__label">Settings</span>
    </div>
  </li>
</ul>
```

- [ ] **Step 5: Render SettingsScreen and guard footer**

In the `App` return, replace the `<StepComp>` render and footer with a conditional:

```jsx
<main className="main" data-screen-label={activeId === "settings" ? "Settings" : activeLabel}>
  <div className="main__scroll">
    <div className="main__inner">
      {activeId !== "settings" ? <PartnerBanner state={state} setSlice={setSlice} /> : null}
      {activeId === "settings"
        ? <SettingsScreen settings={settings} onSave={setSettings} />
        : <StepComp state={state} set={setSlice} settings={settings} />
      }
    </div>
  </div>
  {activeId !== "settings" ? (
    <footer className="footer">
      <div className="footer__l">
        {flatIdx + 1} of {FLAT_IDS.length} · <strong>{activeLabel}</strong> · <span className="footer__phase">{flatIdx < 9 ? "Quotation Phase" : flatIdx < 11 ? "Post-Binding Phase" : "Closing Phase"}</span>
      </div>
      <div className="footer__r">
        <button className="btn btn--ghost" onClick={goPrev} disabled={isFirst}>← Previous</button>
        {isLast ? (
          <button className="btn">Publish</button>
        ) : (
          <button className="btn" onClick={goNext}>Next →</button>
        )}
      </div>
    </footer>
  ) : null}
</main>
```

- [ ] **Step 6: Commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add src/app.jsx
git commit -m "feat: wire settings state, header gear icon, sidebar settings nav item"
```

---

## Task 4: Add SettingsScreen component to steps.jsx

**Files:**
- Modify: `src/steps.jsx`

The `SettingsScreen` uses the existing `DisplayCard`, `DisplayCardGrid`, `Drawer`, `Field`, `Select`, `TextInput` components already present in `components.jsx`.

- [ ] **Step 1: Add locale preset map**

At the top of `src/steps.jsx` (after the existing imports/top-level code), add:

```js
const LOCALE_PRESETS = {
  Germany: { locale: "de-DE", currency: "EUR", timezone: "Europe/Berlin", dateFormat: "DD.MM.YYYY" },
  USA:     { locale: "en-US", currency: "USD", timezone: "America/New_York", dateFormat: "MM/DD/YYYY" },
  UK:      { locale: "en-GB", currency: "GBP", timezone: "Europe/London", dateFormat: "DD/MM/YYYY" },
  Custom:  null,
};

const CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR — Euro" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "SGD", label: "SGD — Singapore Dollar" },
];

const TIMEZONE_OPTIONS = [
  "Europe/Berlin",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Singapore",
  "Asia/Tokyo",
  "UTC",
];

const DATE_FORMAT_OPTIONS = [
  { value: "DD.MM.YYYY", label: "DD.MM.YYYY (e.g. 31.05.2026)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (e.g. 31/05/2026)" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (e.g. 05/31/2026)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (e.g. 2026-05-31)" },
];
```

- [ ] **Step 2: Add SettingsScreen component**

At the end of `src/steps.jsx`, before the last line, add:

```jsx
function SettingsScreen({ settings, onSave }) {
  const { useState: useLocalState } = React;
  const [drawerOpen, setDrawerOpen] = useLocalState(false);
  const [draft, setDraft] = useLocalState(null);

  const openDrawer = () => {
    setDraft({ ...settings });
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDraft(null);
    setDrawerOpen(false);
  };
  const saveDrawer = () => {
    onSave({ ...draft });
    setDrawerOpen(false);
    setDraft(null);
  };

  const setDraftKey = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const applyPreset = (presetName) => {
    const preset = LOCALE_PRESETS[presetName];
    if (preset) {
      setDraft((d) => ({ ...d, preset: presetName, ...preset }));
    } else {
      setDraft((d) => ({ ...d, preset: "Custom" }));
    }
  };

  // Live number preview from draft (or current settings)
  const previewSettings = draft || settings;
  const numberPreview = (() => {
    try {
      return new Intl.NumberFormat(previewSettings.locale, {
        style: "currency",
        currency: previewSettings.currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(1234567.89);
    } catch (e) { return "—"; }
  })();

  return (
    <div className="settings-screen">
      <div className="step-header">
        <h2 className="step-title">Settings</h2>
        <p className="step-desc">Regional and display preferences applied across the workbench.</p>
      </div>

      <DisplayCardGrid>
        <DisplayCard
          title="Regional & Display Settings"
          onEdit={openDrawer}
          fields={[
            { label: "Locale Preset",  value: settings.preset },
            { label: "Language",       value: settings.language === "en" ? "English" : "German" },
            { label: "Currency",       value: CURRENCY_OPTIONS.find(o => o.value === settings.currency)?.label || settings.currency },
            { label: "Number Format",  value: (() => { try { return new Intl.NumberFormat(settings.locale, { style: "currency", currency: settings.currency, maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(1234567.89); } catch(e) { return "—"; } })() },
            { label: "Date Format",    value: settings.dateFormat },
            { label: "Timezone",       value: settings.timezone },
            { label: "Unit System",    value: settings.unitSystem === "metric" ? "Metric" : "Imperial" },
          ]}
        />
      </DisplayCardGrid>

      {drawerOpen && draft ? (
        <Drawer title="Edit Regional & Display Settings" onClose={closeDrawer} onSave={saveDrawer}>
          <Field label="Locale Preset">
            <Select
              value={draft.preset}
              onChange={(v) => applyPreset(v)}
              options={Object.keys(LOCALE_PRESETS).map(k => ({ value: k, label: k }))}
            />
          </Field>
          <Field label="Language">
            <div className="seg">
              {[{ v: "en", l: "English" }, { v: "de", l: "German" }].map(({ v, l }) => (
                <button key={v} className={`seg__btn ${draft.language === v ? "is-on" : ""}`} onClick={() => setDraftKey("language", v)}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="Currency">
            <Select
              value={draft.currency}
              onChange={(v) => { setDraftKey("currency", v); setDraftKey("preset", "Custom"); }}
              options={CURRENCY_OPTIONS}
            />
          </Field>
          <Field label="Number Format Preview" hint="Updates as you change locale / currency">
            <div className="input input--disabled" style={{ fontFamily: "monospace" }}>
              <span className="input__el" style={{ padding: "6px 10px", display: "block" }}>{numberPreview}</span>
            </div>
          </Field>
          <Field label="Date Format">
            <Select
              value={draft.dateFormat}
              onChange={(v) => { setDraftKey("dateFormat", v); setDraftKey("preset", "Custom"); }}
              options={DATE_FORMAT_OPTIONS}
            />
          </Field>
          <Field label="Timezone">
            <Select
              value={draft.timezone}
              onChange={(v) => { setDraftKey("timezone", v); setDraftKey("preset", "Custom"); }}
              options={TIMEZONE_OPTIONS}
            />
          </Field>
          <Field label="Unit System">
            <div className="seg">
              {[{ v: "metric", l: "Metric" }, { v: "imperial", l: "Imperial" }].map(({ v, l }) => (
                <button key={v} className={`seg__btn ${draft.unitSystem === v ? "is-on" : ""}`} onClick={() => setDraftKey("unitSystem", v)}>{l}</button>
              ))}
            </div>
          </Field>
        </Drawer>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:8765`. You should see:
- A gear icon + "Settings" label in the top-right header
- A divider labeled "System" at the bottom of the left sidebar, followed by a "Settings" nav item
- Clicking either navigates to the Settings screen
- The Settings screen shows a single card with all current values
- Clicking the edit (pencil) icon opens a drawer with all fields
- Selecting "USA" preset updates locale, currency, timezone, dateFormat fields in the drawer and the live number preview changes to USD format
- Saving closes the drawer and the card reflects the new values

- [ ] **Step 4: Commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add src/steps.jsx
git commit -m "feat: add SettingsScreen component with DisplayCard + Drawer pattern"
```

---

## Task 5: Wire settings into number formatting across key screens

**Files:**
- Modify: `src/steps.jsx` (targeted edits to high-visibility premium/amount fields)
- Modify: `src/calc.jsx` (update `fmt0` inside `run()` to use settings locale)

The goal is that changing currency/locale in Settings immediately updates formatted amounts on the most visible screens: Technical Premium, Loadings, Analysis, Summary.

- [ ] **Step 1: Thread `settings` prop into CALC.run()**

In `src/calc.jsx`, update `run(state)` to accept `settings` as a second argument and use it for `fmt0`:

```js
function run(state, settings) {
  const s = settings || {};
  const cur = s.currency || state.client.currency || "EUR";
  const locale = s.locale || "en-GB";

  // Replace the existing fmt0 closure at the top of run() with:
  const fmt0local = (n) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(Math.round(n || 0));

  // ... rest of run() unchanged, but replace `fmt0(v, cur)` calls in the return with `fmt0local(v)`:
  // In the return object, change:
  //   fmt0: (v) => fmt0(v, cur),
  // to:
  //   fmt0: fmt0local,
```

The full updated `run` signature line: `function run(state, settings) {`

At top of `run`, replace:
```js
const cur = state.client.currency || "EUR";
```
with:
```js
const cur = (settings && settings.currency) || state.client.currency || "EUR";
const locale = (settings && settings.locale) || "en-GB";
const fmt0local = (n) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));
```

And in the `return {}` block, change `fmt0: (v) => fmt0(v, cur),` to `fmt0: fmt0local,`.

- [ ] **Step 2: Pass settings to CALC.run() calls in steps**

In `src/steps.jsx`, find all calls to `CALC.run(state)` and update them to `CALC.run(state, settings)`. Each step that calls `CALC.run` must receive `settings` as a prop. The steps that use `CALC.run` are likely: `Step_TechPremium`, `Step_AnalysisChoice`, `Step_Summary`, `Step_FinalDecision`. Search for `CALC.run(` to find all occurrences.

For each matching step function signature, add `settings` to props:
```js
// Before:
function Step_TechPremium({ state, set }) {
// After:
function Step_TechPremium({ state, set, settings }) {
```

And update the `CALC.run` call:
```js
// Before:
const calc = CALC.run(state);
// After:
const calc = CALC.run(state, settings);
```

- [ ] **Step 3: Verify reactivity**

Open `http://localhost:8765`. Navigate to Technical Premium. Note the premium amounts. Then go to Settings, open the drawer, change preset to "USA". Save. Navigate back to Technical Premium — amounts should now show in USD with US number formatting (e.g. `$1,234,567` instead of `1.234.567 €`).

- [ ] **Step 4: Commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add src/calc.jsx src/steps.jsx
git commit -m "feat: thread settings into CALC.run() for reactive currency/locale formatting"
```

---

## Task 6: Final polish and smoke test

**Files:**
- Modify: `src/styles.css` (minor tweaks if needed)

- [ ] **Step 1: Smoke test the full settings flow**

Open `http://localhost:8765` and verify:

1. Header gear icon visible, clicking navigates to Settings screen ✓
2. Sidebar shows divider labeled "System" + Settings item below it ✓
3. Settings nav item highlights when active ✓
4. Settings screen: card shows all 7 fields ✓
5. Edit drawer opens, all fields present ✓
6. Selecting "Germany" preset auto-fills locale/currency/timezone/dateFormat ✓
7. Number preview updates live as locale/currency changes ✓
8. Save: card reflects new values ✓
9. Navigate to Technical Premium: amounts show in selected currency/locale ✓
10. Footer (Prev/Next) does NOT appear on Settings screen ✓
11. localStorage persists settings on page reload ✓

- [ ] **Step 2: Fix any visual issues**

If the `.nav-divider` or gear icon styling looks off (wrong spacing, wrong color), adjust `src/styles.css` accordingly.

- [ ] **Step 3: Final commit**

```bash
cd "/Users/alexanderlemberger/.claude/screensMarine/HDI-Marine Form"
git add -A
git commit -m "feat: settings menu complete — reactive locale/currency/format across prototype"
```
