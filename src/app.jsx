// CaTa Pricing Tool — Workbench shell
// Header (logo + workbench title + Feedback/Links/User)
// Sidebar (grouped nav with circle indicators + sub-items)
// Main pane (Partner banner + current step content)

const { useState: useState_app, useEffect: useEffect_app, useMemo: useMemo_app } = React;

// ---- Default settings ----
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
window.appSettings = SETTINGS_DEFAULTS;

// ---- Default tweaks ----
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "accent": "forest"
}/*EDITMODE-END*/;

// ---- Initial state (prefilled with a realistic sample deal) ----
function makeInitialState() {
  return {
    fileName: "2026-01_Test_Italy_Customer_Option-3.xlsm",
    offerNr: "PR-000004",
    optionNr: 3,
    lastModified: "26/05/2026 | 17:40h",

    client: {
      partner: "Test Italy Customer 6546546",
      partnerId: "2342342342",
      naics: "H",
      branch: "SüdVers",
      participation: "100% Direct Business",
      currency: "EUR",
      status: "draft",
      midMarket: "No",
      intlPrograms: "Yes",
      numLocalPolicies: 3,
      subsidiaries: "Yes",
      producingOffice: "HDI Hannover",
      riskCountry: "Italy",
      pricingMethod: "Tariff (exposure-based)",
      // Basic Information card
      optionName: "Variant 1",
      regionalOffice: "Milan",
      typeOfBusiness: "New Business",
      typeOfContract: "Annual contract/automatic renewal",
      inceptionDate: "31/05/2026",
      inceptionTime: "24:00",
      expirationDate: "31/05/2027",
      // Policy Holder card
      partnerName: "HDI Global",
      street: "HDI-Platz 1",
      zip: "30659",
      city: "Hannover",
      country: "Germany",
      partnerHeadquarter: "Italy",
      riskType: "Local Risk",
    },

    cover: {
      coverType1: "All Risk",
      coverType2: "Transports incl. Storage in the ordinary course of Transit",
      turnover: 145000000,
      turnoverCargo: 118000000,
      exposureType: "Turnover",
      exposureValue: 118000000,
      inception: "01.01.2026",
      expiry: "31.12.2026",
    },

    goods: {
      classes: [
        { cls: "10. Electronics / IT Equipment", sub: "IT Hardware", temp: false, theft: true, split: 60 },
        { cls: "3. Vehicles (incl. Hybrid as combustion)", sub: "Trucks & Commercial", temp: false, theft: false, split: 25 },
        { cls: "1. Household & Furniture", sub: "Furniture", temp: false, theft: false, split: 15 },
      ],
    },

    transport: { splitAvailable: true, land: 35, sea: 50, air: 15 },

    geo: {
      detailedView: true,
      rows: [
        { phase: "Shipment", from: "Europe - West", to: "Europe - West",   share: 40, surcharge: "" },
        { phase: "Shipment", from: "Europe - West", to: "America - North", share: 25, surcharge: 5 },
        { phase: "Shipment", from: "Asia",          to: "Europe - West",   share: 25, surcharge: 8 },
        { phase: "Shipment", from: "Europe - West", to: "Worldwide other", share: 10, surcharge: 12 },
      ],
    },

    cond: {
      basis: "Irrespective of Incoterm (CIF/CIP + Expected Profit)",
      irrespective: "Yes",
      expectedProfit: 10,
      limit: 2500000,
      limitAggregate: 25000000,
      deductibleGeneral: 1000,
      deductibleLand: "",
      deductibleSea: 1500,
      deductibleAir: 500,
      deductibleTemp: "",
      storageDayLimit: 60,
      deductibleStorage: 2500,
      deductibleNatcat: 10000,
      deductibleAnnAgg: 50000,
    },

    coverages: {
      Exhibitions: false, WorksOfArt: false, HouseholdGoods: false,
      Consequential: true, FinancialLoss: false, War: true, IP: false,
      Luggage: false, Cyber: true, Pandemic: false,
      ProtAndCondDiff: false, StrikeAndRiot: true,
    },

    warCountries: [
      { country: "Ukraine", surchargeKind: "percentage", surcharge: 0.50, limit: 250000, deductible: 5000 },
      { country: "Israel",  surchargeKind: "percentage", surcharge: 0.30, limit: 250000, deductible: 5000 },
    ],
    strikeCountries: [
      { country: "France",   surchargeKind: "percentage", surcharge: 0.05, limit: 250000, deductible: 2500 },
      { country: "Colombia", surchargeKind: "percentage", surcharge: 0.15, limit: 250000, deductible: 2500 },
    ],

    storage: {
      rows: [
        { name: "Lager Hamburg-Süd",      country: "Germany",      limit: 8500000, avgValue: 5200000, lat: 53.5388, lon: 9.9872, coordQ: "exact",  goods: "IT Hardware",   deductibleKind: "Percentage",   deductible: 0.5 },
        { name: "Warehouse Rotterdam",    country: "Netherlands",  limit: 6200000, avgValue: 3800000, lat: 51.9244, lon: 4.4777, coordQ: "exact",  goods: "General Cargo", deductibleKind: "Percentage",   deductible: 0.5 },
        { name: "Depot Praha-Štěrboholy", country: "Czechia",      limit: 2400000, avgValue: 1500000, lat: 50.0509, lon: 14.5410, coordQ: "approx", goods: "Furniture",     deductibleKind: "Fixed Amount", deductible: 2500 },
      ],
    },

    adjustments: [
      { kind: "Loading",  percent: 10, reason: "Sublimit" },
      { kind: "Discount", percent: 5,  reason: "Risk Profile" },
    ],

    localPolicies: {
      rows: [
        { country: "Germany",   lpCurrency: "EUR", share: 60, premium: 180000, localFronter: "HDI Global SE" },
        { country: "USA",       lpCurrency: "USD", share: 25, premium: 95000,  localFronter: "HDI Global Insurance Co." },
        { country: "Singapore", lpCurrency: "USD", share: 15, premium: 60000,  localFronter: "HDI Global SE (Singapore branch)" },
      ],
    },

    final: { brokerage: 12, additionalCosts: 0, leadingFee: 0, commercialAdj: -3 },
    analysisExtras: [],
  };
}

// ---- Navigation tree (matches the workbench) ----
const NAV = [
  { id: "general",          label: "General Data",         icon: "id-card",  phase: "Quotation",    Comp: () => null },
  { id: "tools",            label: "Tools",                icon: "cloud",    phase: "Quotation",    Comp: () => null },
  { id: "claimAnalysis",    label: "Claim Analysis",       icon: "doc",      phase: "Quotation",    group: true, children: [
    { id: "methodLimits",   label: "Method & Limits" },
    { id: "claimData",      label: "Claim Data" },
    { id: "addCov",         label: "Additional Coverages" },
    { id: "storage",        label: "Storage Locations" },
    { id: "bcResult",       label: "BC Result" },
  ]},
  { id: "techAdj",          label: "Technical adjustment", icon: "edit",     phase: "Quotation" },
  { id: "techPremium",      label: "Technical Premium",    icon: "list",     phase: "Quotation" },
  { id: "loadings",         label: "Loadings/Discounts",   icon: "id-tag",   phase: "Quotation" },
  { id: "analysis",         label: "Analysis/Choice",      icon: "sliders",  phase: "Post-Binding" },
  { id: "summary",          label: "Summary",              icon: "handshake", phase: "Post-Binding" },
  { id: "finalDecision",    label: "Final Decision",       icon: "doc",      phase: "Post-Binding" },
];

const STEP_COMP = {
  general: Step_Client,
  tools: Step_Tools,
  methodLimits: Step_MethodLimits,
  claimData: Step_ClaimData,
  addCov: Step_AddCov,
  storage: Step_Storage,
  bcResult: Step_BCResult,
  techAdj: Step_TechAdj,
  techPremium: Step_TechPremium,
  loadings: Step_Loadings,
  analysis: Step_AnalysisChoice,
  summary: Step_Summary,
  finalDecision: Step_FinalDecision,
};

// All flat (ordered) IDs for prev/next nav
const FLAT_IDS = (function () {
  const ids = [];
  NAV.forEach((n) => {
    if (n.children) n.children.forEach((c) => ids.push(c.id));
    else ids.push(n.id);
  });
  return ids;
})();

// ---- Tweaks plumbing ----
function useTweaks() {
  const [t, setT] = useState_app(TWEAK_DEFAULTS);
  const set = (k, v) => {
    const edits = typeof k === "object" ? k : { [k]: v };
    setT((prev) => ({ ...prev, ...edits }));
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*"); } catch (e) {}
  };
  return [t, set];
}

function TweaksPanel({ tweaks, setTweak, onClose }) {
  return (
    <div className="tweaks">
      <div className="tweaks__head">
        <div>
          <div className="tweaks__title">Tweaks</div>
          <div className="tweaks__sub">Live design controls</div>
        </div>
        <button className="tweaks__close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="tweaks__body">
        <div className="tweaks__group">
          <div className="tweaks__label">Accent</div>
          <div className="swatches">
            {[
              { id: "forest", color: "#65A518" },
            ].map(s => (
              <button key={s.id} className={`swatch ${tweaks.accent === s.id ? "is-on" : ""}`} onClick={() => setTweak("accent", s.id)} title={s.id}>
                <span style={{ background: s.color }}></span>
                <em>{s.id}</em>
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks__group">
          <div className="tweaks__label">Density</div>
          <div className="seg">
            {["comfortable","compact"].map((v) => (
              <button key={v} className={`seg__btn ${tweaks.density === v ? "is-on" : ""}`} onClick={() => setTweak("density", v)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Main App ----
function App() {
  const [state, setState] = useState_app(makeInitialState);
  const [tweaks, setTweak] = useTweaks();
  const [tweaksOpen, setTweaksOpen] = useState_app(false);
  const [activeId, setActiveId] = useState_app(() => {
    const hash = window.location.hash.replace("#", "");
    return (hash && STEP_COMP[hash]) || hash === "settings" || hash === "exchange-rates" ? hash : "general";
  });

  // Sync hash to activeId on load (browser back/forward)
  useEffect_app(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && (STEP_COMP[hash] || hash === "settings" || hash === "exchange-rates")) setActiveId(hash);
      else setActiveId("general");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const [settings, setSettings] = useState_app(SETTINGS_DEFAULTS);
  window.appSettings = settings; // sync every render — no frame lag
  const [openGroups, setOpenGroups] = useState_app({ claimAnalysis: true });
  const [openRatesDrawer, setOpenRatesDrawer] = useState_app(false);
  const [savedSteps, setSavedSteps] = useState_app(() => {
    try {
      const saved = localStorage.getItem("cata_saved_steps_v1");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });
  useEffect_app(() => {
    try { localStorage.setItem("cata_saved_steps_v1", JSON.stringify([...savedSteps])); } catch (e) {}
  }, [savedSteps]);
  const onStepSave = (id) => setSavedSteps((s) => new Set([...s, id]));

  const togglePhase = (phaseItems) => {
    const allIds = [];
    phaseItems.forEach((n) => {
      if (n.children) n.children.forEach((c) => allIds.push(c.id));
      else allIds.push(n.id);
    });
    const allDone = allIds.every((id) => savedSteps.has(id));
    setSavedSteps((s) => {
      const next = new Set(s);
      if (allDone) allIds.forEach((id) => next.delete(id));
      else allIds.forEach((id) => next.add(id));
      return next;
    });
  };

  // Persist
  useEffect_app(() => {
    try {
      const saved = localStorage.getItem("cata_state_v3");
      if (saved) setState((s) => ({ ...s, ...JSON.parse(saved) }));
    } catch (e) {}
  }, []);
  useEffect_app(() => { try { localStorage.setItem("cata_state_v3", JSON.stringify(state)); } catch (e) {} }, [state]);
  useEffect_app(() => { try { localStorage.setItem("cata_nav_v3", activeId); } catch (e) {} }, [activeId]);
  useEffect_app(() => {
    try {
      const saved = localStorage.getItem("cata_settings_v1");
      if (saved) setSettings((s) => ({ ...s, ...JSON.parse(saved) }));
    } catch (e) {}
  }, []);
  useEffect_app(() => {
    try { localStorage.setItem("cata_settings_v1", JSON.stringify(settings)); } catch (e) {}
  }, [settings]);

  // Tweaks bridge
  useEffect_app(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    return () => window.removeEventListener("message", handler);
  }, []);

  // Apply tweaks
  useEffect_app(() => {
    const root = document.documentElement;
    root.dataset.density = tweaks.density;
    root.dataset.accent = tweaks.accent;
  }, [tweaks.density, tweaks.accent]);

  const setSlice = (slice) => { setState((s) => ({ ...s, ...slice })); onStepSave(activeId); };

  // Completeness signals (drive nav circle indicators)
  const completeness = useMemo_app(() => computeCompleteness(state), [state]);

  // Active step component
  const StepComp = STEP_COMP[activeId] || Step_Client;

  // Active nav label
  const activeLabel = (() => {
    for (const n of NAV) {
      if (n.id === activeId) return n.label;
      if (n.children) {
        for (const c of n.children) if (c.id === activeId) return c.label;
      }
    }
    return "";
  })();

  const goNext = () => {
    const idx = FLAT_IDS.indexOf(activeId);
    if (idx >= 0 && idx < FLAT_IDS.length - 1) {
      const next = FLAT_IDS[idx + 1];
      setActiveId(next);
      window.location.hash = next;
      ensureGroupOpen(next);
    }
  };
  const goPrev = () => {
    const idx = FLAT_IDS.indexOf(activeId);
    if (idx > 0) {
      const prev = FLAT_IDS[idx - 1];
      setActiveId(prev);
      window.location.hash = prev;
      ensureGroupOpen(prev);
    }
  };
  const ensureGroupOpen = (id) => {
    NAV.forEach((n) => {
      if (n.children && n.children.some((c) => c.id === id)) {
        setOpenGroups((g) => ({ ...g, [n.id]: true }));
      }
    });
  };

  const flatIdx = FLAT_IDS.indexOf(activeId);
  const isLast = flatIdx === FLAT_IDS.length - 1;
  const isFirst = flatIdx === 0;

  return (
    <div className="app">
      <Header
          onOpenTweaks={() => setTweaksOpen((o) => !o)}
          tweaksOpen={tweaksOpen}
          onOpenSettings={() => { setActiveId("settings"); window.location.hash = "settings"; }}
          settingsActive={activeId === "settings"}
          settings={settings}
        />
      <div className="layout">
        <Sidebar
          nav={NAV}
          activeId={activeId}
          onPick={(id) => { setActiveId(id); window.location.hash = id; ensureGroupOpen(id); }}
          openGroups={openGroups}
          toggleGroup={(id) => setOpenGroups((g) => ({ ...g, [id]: !g[id] }))}
          completeness={completeness}
          savedSteps={savedSteps}
          togglePhase={togglePhase}
          state={state}
        />
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
                ? <SettingsScreen settings={settings} onSave={setSettings} openRatesDrawer={openRatesDrawer} onRatesDrawerOpened={() => setOpenRatesDrawer(false)} />
                : activeId === "exchange-rates"
                  ? <ExchangeRatesScreen settings={settings} onOpenSettings={() => { setOpenRatesDrawer(true); setActiveId("settings"); window.location.hash = "settings"; }} />
                  : <StepComp state={state} set={setSlice} settings={settings} />
              }
            </div>
          </div>
          {activeId !== "settings" && activeId !== "exchange-rates" ? (
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
      </div>

      {tweaksOpen ? (
        <TweaksPanel
          tweaks={tweaks}
          setTweak={setTweak}
          onClose={() => {
            setTweaksOpen(false);
            try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
          }}
        />
      ) : null}
    </div>
  );
}

// ---- Header ----
function Header({ onOpenTweaks, tweaksOpen, onOpenSettings, settingsActive, settings }) {
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
          <span className="header-gear__badge">{settings.preset === "Custom" ? settings.currency : `${settings.preset} · ${settings.currency}`}</span>
        </button>
        <a className="header-user" href="#">
          <Icon name="user" size={14} />
          Mustermann, Max
        </a>
      </div>
    </header>
  );
}

// ---- Sidebar (grouped nav with circle indicators) ----
function Sidebar({ nav, activeId, onPick, openGroups, toggleGroup, completeness, savedSteps, togglePhase, state }) {

  // Helper: render a single nav item (flat or group)
  const renderNavItem = (n) => {
    if (n.group) {
      const isOpen = openGroups[n.id];
      return (
        <li key={n.id} className={`nav-group ${isOpen ? "is-open" : ""}`}>
          <div className="nav-group__head" onClick={() => toggleGroup(n.id)}>
            <span className="nav-dot" />
            <span className="nav-group__icon"><Icon name={n.icon} size={14} /></span>
            <span className="nav-group__label">{n.label}</span>
            <span className="nav-group__chev"><Icon name="chev-down" size={12} /></span>
          </div>
          {isOpen ? (
            <ul className="nav-children">
              {n.children.map((c) => (
                <li
                  key={c.id}
                  className={`nav-item ${activeId === c.id ? "is-active" : ""}`}
                  onClick={() => onPick(c.id)}
                >
                  <span className="nav-dot" />
                  <span className="nav-item__label">{c.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      );
    }
    return (
      <li key={n.id}>
        <div
          className={`nav-flat ${activeId === n.id ? "is-active" : ""}`}
          onClick={() => onPick(n.id)}
        >
          <span className="nav-dot" />
          <span className="nav-group__icon"><Icon name={n.icon} size={14} /></span>
          <span className="nav-group__label">{n.label}</span>
        </div>
      </li>
    );
  };

  // Group NAV items by phase, preserving order
  const phases = [];
  const phaseMap = {};
  nav.forEach((n) => {
    const p = n.phase || "__none__";
    if (!phaseMap[p]) { phaseMap[p] = []; phases.push(p); }
    phaseMap[p].push(n);
  });

  // Compute phase completion: all step IDs in phase must be in savedSteps
  const isPhaseComplete = (phaseItems) => {
    const allIds = [];
    phaseItems.forEach((n) => {
      if (n.children) n.children.forEach((c) => allIds.push(c.id));
      else allIds.push(n.id);
    });
    return allIds.length > 0 && allIds.every((id) => savedSteps.has(id));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <span className="sidebar__label">NAVIGATION</span>
      </div>
      <div className="phase-list">
        {phases.filter(p => p !== "__none__").map((phase) => {
          const items = phaseMap[phase];
          const done = isPhaseComplete(items);
          return (
            <div key={phase} className={`phase-block ${done ? "phase-block--done" : ""}`}>
              <div className="phase-block__header">
                <span className="phase-block__label" onClick={() => togglePhase(items)}>{phase.toUpperCase()}</span>
                <span className="phase-block__line" />
                {done ? <i className="fa-solid fa-circle-check phase-block__check" /> : <span className="phase-block__check-placeholder" />}
              </div>
              <ul className="navlist">
                {items.map(renderNavItem)}
              </ul>
            </div>
          );
        })}
      </div>
      <NavDivider label="System" />
      <ul className="navlist">
        <li>
          <div
            className={`nav-flat ${activeId === "settings" ? "is-active" : ""}`}
            onClick={() => onPick("settings")}
          >
            <span className="nav-dot" />
            <span className="nav-group__icon"><Icon name="settings" size={14} /></span>
            <span className="nav-group__label">Settings</span>
          </div>
        </li>
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
      </ul>
    </aside>
  );
}

// ---- Partner Banner ----
function PartnerBanner({ state, setSlice }) {
  const c = state.client;
  const statusText = c.status || "Draft";
  return (
    <div className="partner-banner">
      <div>
        <div className="partner-banner__top">
          <h1 className="partner-banner__title">{c.partner || "Untitled Case"}</h1>
          <div className="partner-banner__chips">
            <span className="pbchip"><Icon name="file" size={12} /> Option: {state.optionNr}</span>
            <span className="pbchip"><Icon name="tag" size={12} /> Partner ID: {c.partnerId || "—"}</span>
            <span className="pbchip">Policy: {state.offerNr}</span>
          </div>
        </div>
        <div className="partner-banner__meta">
          <span className="meta-item">
            <Icon name="file" size={13} />
            <span className="meta-item__label">Offer No.:</span>
            <span className="meta-item__value meta-item__value--mono">{state.offerNr}</span>
          </span>
          <span className="meta-item">
            <Icon name="status" size={13} />
            <span className="meta-item__label">Status:</span>
            <span className="meta-item__value">{statusText}</span>
          </span>
          <span className="meta-item">
            <Icon name="clock" size={13} />
            <span className="meta-item__label">Last modified:</span>
            <span className="meta-item__value meta-item__value--mono">{state.lastModified}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ---- Completeness (drives nav dot indicators) ----
function computeCompleteness(state) {
  const filled = (v) => v !== "" && v != null && v !== undefined;
  const pctFilled = (obj, keys) => {
    const f = keys.filter((k) => filled(obj[k]));
    return Math.round((f.length / keys.length) * 100);
  };
  return {
    general:     pctFilled(state.client, ["partner","branch","participation","currency","midMarket","intlPrograms","riskCountry"]),
    tools:       pctFilled(state.cover,  ["coverType1","coverType2","turnover","turnoverCargo"]),
    methodLimits:pctFilled(state.cond,   ["basis","limit","deductibleGeneral"]),
    claimData:   (state.goods.classes.length && state.goods.classes.every((g) => filled(g.cls) && filled(g.split))
                  && state.geo.rows.length > 0
                  && (state.transport.land || state.transport.sea || state.transport.air)) ? 100 : 60,
    addCov:      Object.values(state.coverages).some(Boolean) ? 100 : 50,
    storage:     state.storage.rows.length > 0 ? 100 : 0,
    bcResult:    100,
    techAdj:     state.adjustments.length > 0 ? 100 : 50,
    techPremium: 100,
    loadings:    filled(state.final.brokerage) ? 100 : 50,
    analysis:    100,
    summary:     state.client.intlPrograms === "Yes"
                  ? (state.localPolicies.rows.length > 0 ? 100 : 60) : 100,
    finalDecision: 0,
  };
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
