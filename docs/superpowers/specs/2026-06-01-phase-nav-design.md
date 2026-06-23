# Phase Navigation Design Spec

**Date:** 2026-06-01  
**Status:** Approved  
**Prototype:** CaTa Marine Pricing Tool (React UMD)

---

## Overview

Replace the flat sidebar nav with phase-grouped containers. Each phase has two visual states: initial (neutral border) and completed (green border + checkmark badge). A phase is complete when the user has saved at least once in every step within it.

---

## Data Model

Add `phase` property to each NAV item in `src/app.jsx`:

| Step | Phase |
|---|---|
| General Data | Quotation |
| Tools | Quotation |
| Claim Analysis (group + all children) | Quotation |
| Technical Adjustment | Quotation |
| Technical Premium | Quotation |
| Loadings/Discounts | Quotation |
| Analysis/Choice | Post-Binding |
| Summary | Post-Binding |
| Final Decision | Post-Binding |

---

## Completeness Tracking

- `savedSteps` — a `Set` of step IDs stored in `App` state, persisted to `localStorage` key `cata_saved_steps_v1`
- A step ID is added to `savedSteps` whenever the user saves in that step (any drawer save, or the main save action for top-level steps)
- A phase is **complete** when every step ID in that phase is present in `savedSteps`
- Child steps (e.g. Claim Analysis sub-steps) each need to be individually saved; the group itself is complete when all children are saved
- `savedSteps` is passed down to `Sidebar` as a prop

### Save signal mechanism

`App` passes an `onStepSave` callback to each step component via the existing `set` prop pattern. Steps call `onStepSave(activeId)` when their drawer saves. For simplicity in the prototype, `onStepSave` is called from `App`-level whenever `setSlice` is called — i.e. any state mutation from a step counts as a save.

---

## Sidebar Phase Container

The `Sidebar` component groups NAV items by `phase` and wraps each group in a `.phase-block` container.

### Visual spec

**Initial state:**
```
┌─ QUOTATION ──────────────────────┐
│  ○ 🪪 General Data               │
│  ○ 🧰 Tools                      │
│  ○ 📄 Claim Analysis      ˅      │
│  ...                             │
└──────────────────────────────────┘
```
- Border: `1px solid var(--border)` — `#e0e0e0`
- Border radius: `8px`
- Phase label: top-left, small caps, muted — `font-size: 10px`, `color: var(--text-muted)`, `letter-spacing: 0.08em`, positioned above the border (like a fieldset legend) or as a header row inside

**Completed state:**
```
┌─ QUOTATION ──────────────── ✅ ─┐
│  ○ 🪪 General Data               │
│  ...                             │
└──────────────────────────────────┘
```
- Border: `1px solid var(--accent)` — `#65A518`
- Phase label: `color: var(--accent)`
- Checkmark: `fa-solid fa-circle-check`, `color: var(--accent)`, `font-size: 14px`, positioned top-right corner of the container (absolute, inside padding)

### Layout

- Phase blocks stack vertically with `gap: 8px`
- Existing nav item styles (dots, icons, active highlight) unchanged inside the block
- System nav items (Settings, Exchange Rates) remain outside phase blocks, below the existing `NavDivider label="System"`

---

## Files to Change

| File | Change |
|---|---|
| `src/app.jsx` | Add `phase` to all NAV items; add `savedSteps` state + localStorage persistence; pass `savedSteps` and `onStepSave` to Sidebar; call `onStepSave(activeId)` on `setSlice` |
| `src/app.jsx` (Sidebar) | Group NAV by phase; render `.phase-block` wrapper per phase; apply completed styles when all phase steps are in `savedSteps` |
| `src/styles.css` | Add `.phase-block`, `.phase-block--done`, `.phase-block__label`, `.phase-block__check` styles |

---

## Constraints

- No changes to step components — save tracking is handled at App level via `setSlice`
- System screens (Settings, Exchange Rates) are not part of any phase
- `savedSteps` is prototype-only — no backend persistence needed
