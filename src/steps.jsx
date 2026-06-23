// Wizard step components — restyled for the Underwriting Workbench
// Each step renders inside the main pane below the Partner Banner.

const { useState: useS, useEffect: useE, useMemo: useM, Fragment: F } = React;

const LANGUAGE_OPTIONS = [
  { value: "en",    label: "English" },
  { value: "de",    label: "German" },
  { value: "fr",    label: "French" },
  { value: "es",    label: "Spanish" },
  { value: "it",    label: "Italian" },
  { value: "nl",    label: "Dutch" },
];

const UNIT_SYSTEM_OPTIONS = [
  { value: "metric",   label: "Metric" },
  { value: "imperial", label: "Imperial" },
];

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

const fmtDE = (n) => {
  if (n == null || n === "") return "";
  const locale = (window.appSettings && window.appSettings.locale) || "de-DE";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(Number(n)));
};
function sumSplit(arr, key = "split") {
  return arr.reduce((s, x) => s + (Number(x[key]) || 0), 0);
}

// =============================================================================
// 1 — Client & Policy  (General Data)
// =============================================================================
function Step_Client({ state, set }) {
  const c = state.client;
  const [basicPanel, setBasicPanel] = useS(false);
  const [holderPanel, setHolderPanel] = useS(false);
  const [draft, setDraft] = useS(null);

  const openBasic = () => { setDraft({ ...c }); setBasicPanel(true); };
  const openHolder = () => { setDraft({ ...c }); setHolderPanel(true); };
  const closePanel = () => { setBasicPanel(false); setHolderPanel(false); setDraft(null); };
  const savePanel = () => { set({ client: { ...c, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section title="General Data">
      <DisplayCardGrid cols={2}>
        <DisplayCard title="Basic Information" onEdit={openBasic}>
          <DisplayField label="Option Name" value={c.optionName} />
          <DisplayField label="Producing Office" value={c.producingOffice} />
          <DisplayField label="Regional Office" value={c.regionalOffice} />
          <DisplayField label="Currency" value={c.currency} />
          <DisplayField label="Type of Business" value={c.typeOfBusiness} />
          <DisplayField label="Type of Participation" value={c.typeOfParticipation} />
          <DisplayField label="International Program" value={c.intlPrograms} />
          <DisplayField label="NAICS Code" value={c.naicsCode} mono />
          <DisplayField label="Type of Contract" value={c.typeOfContract} />
          <DisplayField label="Inception Date" value={c.inceptionDate} />
          <DisplayField label="Inception Time" value={c.inceptionTime} />
          <DisplayField label="Expiration Date" value={c.expirationDate} />
        </DisplayCard>

        <DisplayCard title="Policy Holder" onEdit={openHolder}>
          <DisplayField label="Partner No." value={c.partnerId} mono />
          <DisplayField label="Partner Name" value={c.partnerName} />
          <DisplayField label="Street" value={c.street} />
          <DisplayField label="Zip" value={c.zip} />
          <DisplayField label="City" value={c.city} />
          <DisplayField label="Country" value={c.country} />
          <DisplayField label="Partner Headquarter" value={c.partnerHeadquarter} />
          <DisplayField label="Risk Type" value={c.riskType} />
        </DisplayCard>
      </DisplayCardGrid>

      <Drawer
        open={basicPanel}
        onClose={closePanel}
        title="Edit Basic Information"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={2}>
            <FilledField label="Option Name">
              <FilledInput value={draft.optionName} onChange={(v) => ud("optionName", v)} placeholder="Variant 1" />
            </FilledField>
            <FilledField label="Producing Office">
              <FilledInput value={draft.producingOffice} onChange={(v) => ud("producingOffice", v)} placeholder="HDI Hannover" />
            </FilledField>
            <FilledField label="Regional Office">
              <FilledInput value={draft.regionalOffice} onChange={(v) => ud("regionalOffice", v)} placeholder="Milan" />
            </FilledField>
            <FilledField label="Currency">
              <FilledSelect value={draft.currency} onChange={(v) => ud("currency", v)} options={REFS.currencies.map((c) => ({ value: c.code, label: c.code }))} />
            </FilledField>
            <FilledField label="Type of Business">
              <FilledSelect value={draft.typeOfBusiness} onChange={(v) => ud("typeOfBusiness", v)} options={["New Business", "Renewal", "Endorsement"]} />
            </FilledField>
            <FilledField label="Type of Participation">
              <FilledSelect value={draft.typeOfParticipation} onChange={(v) => ud("typeOfParticipation", v)} options={["Lead", "Co-Insurance", "Follow"]} />
            </FilledField>
            <FilledField label="International Program">
              <FilledRadio value={draft.intlPrograms} onChange={(v) => ud("intlPrograms", v)} options={["Yes", "No"]} />
            </FilledField>
            <FilledField label="NAICS Code">
              <FilledInput value={draft.naicsCode} onChange={(v) => ud("naicsCode", v)} placeholder="e.g. 424690" mono />
            </FilledField>
            <FilledField label="Type of Contract">
              <FilledSelect value={draft.typeOfContract} onChange={(v) => ud("typeOfContract", v)} options={["Annual contract/automatic renewal", "Multi-year contract", "Single voyage"]} />
            </FilledField>
            <FilledField label="Inception Date">
              <FilledDate value={draft.inceptionDate} onChange={(v) => ud("inceptionDate", v)} placeholder="31/05/2026" />
            </FilledField>
            <FilledField label="Inception Time">
              <FilledInput value={draft.inceptionTime} onChange={(v) => ud("inceptionTime", v)} placeholder="24:00" mono />
            </FilledField>
            <FilledField label="Expiration Date">
              <FilledDate value={draft.expirationDate} onChange={(v) => ud("expirationDate", v)} placeholder="31/05/2027" />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>

      <Drawer
        open={holderPanel}
        onClose={closePanel}
        title="Edit Policy Holder"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={2}>
            <FilledField label="Partner No.">
              <FilledInput value={draft.partnerId} onChange={(v) => ud("partnerId", v)} placeholder="8000380073" mono />
            </FilledField>
            <FilledField label="Partner Name">
              <FilledInput value={draft.partnerName} onChange={(v) => ud("partnerName", v)} placeholder="HDI Global" />
            </FilledField>
            <FilledField label="Street">
              <FilledInput value={draft.street} onChange={(v) => ud("street", v)} placeholder="Street" />
            </FilledField>
            <FilledField label="Zip">
              <FilledInput value={draft.zip} onChange={(v) => ud("zip", v)} placeholder="30659" mono />
            </FilledField>
            <FilledField label="City">
              <FilledInput value={draft.city} onChange={(v) => ud("city", v)} placeholder="Hannover" />
            </FilledField>
            <FilledField label="Country">
              <FilledSelect value={draft.country} onChange={(v) => ud("country", v)} options={REFS.countries} placeholder="Country" />
            </FilledField>
            <FilledField label="Partner Headquarter">
              <FilledSelect value={draft.partnerHeadquarter} onChange={(v) => ud("partnerHeadquarter", v)} options={REFS.countries} placeholder="Country" />
            </FilledField>
            <FilledField label="Risk Type">
              <FilledSelect value={draft.riskType} onChange={(v) => ud("riskType", v)} options={["Local Risk", "Global Risk", "Master Programme"]} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 2 — Tools (Cover setup + macro buttons)
// =============================================================================
function Step_Tools({ state, set }) {
  const c = state.client;
  const o = state.cover;
  const isMM = c.midMarket === "Yes";
  const cur = (window.appSettings && window.appSettings.currency) || c.currency || "EUR";
  const [panelOpen, setPanelOpen] = useS(false);
  const [draft, setDraft] = useS(null);

  const openPanel = () => { setDraft({ ...o }); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setDraft(null); };
  const savePanel = () => { set({ cover: { ...o, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <Section
        title="Cover Type & Exposure"
        intro="Type of cover, turnover, and exposure measure. The MidMarket flag from General Data trims the cover-type list."
      >
        <DisplayCardGrid cols={1}>
          <DisplayCard title="Cover & Exposure" onEdit={openPanel}>
            <DisplayField label="Type of Cover" value={o.coverType1} />
            <DisplayField label="Type of Cover 2" value={o.coverType2} />
            <DisplayField label="Turnover (full)" value={o.turnover ? `${fmtDE(o.turnover)} ${cur}` : null} />
            <DisplayField label="Turnover relevant for Cargo" value={o.turnoverCargo ? `${fmtDE(o.turnoverCargo)} ${cur}` : null} />
            <DisplayField label="Type of Exposure" value={o.exposureType} />
            <DisplayField label="Exposure value" value={o.exposureValue ? `${fmtDE(o.exposureValue)} ${cur}` : null} />
            <DisplayField label="Inception" value={o.inception} mono />
            <DisplayField label="Expiry" value={o.expiry} mono />
          </DisplayCard>
        </DisplayCardGrid>
      </Section>

      <Drawer
        open={panelOpen}
        onClose={closePanel}
        title="Edit Cover & Exposure"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={2}>
            <FilledField label="Type of Cover" span={2}>
              <FilledSelect value={draft.coverType1} onChange={(v) => ud("coverType1", v)} options={isMM ? REFS.coverType1_MM : REFS.coverType1_nonMM} placeholder="Select cover type" />
            </FilledField>
            <FilledField label="Type of Cover 2" span={2}>
              <FilledSelect value={draft.coverType2} onChange={(v) => ud("coverType2", v)} options={REFS.coverType2} placeholder="Select cover type 2" />
            </FilledField>
            <FilledField label="Turnover (full)">
              <FilledNumber value={draft.turnover} onChange={(v) => ud("turnover", v)} suffix={cur} placeholder="100,000,000" />
            </FilledField>
            <FilledField label="Turnover relevant for Cargo">
              <FilledNumber value={draft.turnoverCargo} onChange={(v) => ud("turnoverCargo", v)} suffix={cur} placeholder="80,000,000" />
            </FilledField>
            <FilledField label="Type of Exposure">
              <FilledSelect value={draft.exposureType} onChange={(v) => ud("exposureType", v)} options={["Turnover", "Probable maximum loss", "Number of employees", "Number of goods sold", "Sum insured", "Total sum insured", "Other"]} placeholder="Select exposure type" />
            </FilledField>
            <FilledField label="Exposure value">
              <FilledNumber value={draft.exposureValue} onChange={(v) => ud("exposureValue", v)} suffix={cur} placeholder="0" />
            </FilledField>
            <FilledField label="Inception">
              <FilledDate value={draft.inception} onChange={(v) => ud("inception", v)} placeholder="01.01.2026" />
            </FilledField>
            <FilledField label="Expiry">
              <FilledDate value={draft.expiry} onChange={(v) => ud("expiry", v)} placeholder="31.12.2026" />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </div>
  );
}

// =============================================================================
// 3 — Method & Limits (Conditions)
// =============================================================================
function Step_MethodLimits({ state, set }) {
  const cd = state.cond;
  const cur = (window.appSettings && window.appSettings.currency) || state.client.currency || "EUR";
  const [limitsPanel, setLimitsPanel] = useS(false);
  const [deductPanel, setDeductPanel] = useS(false);
  const [draft, setDraft] = useS(null);

  const openLimits = () => { setDraft({ ...cd }); setLimitsPanel(true); };
  const openDeduct = () => { setDraft({ ...cd }); setDeductPanel(true); };
  const closePanel = () => { setLimitsPanel(false); setDeductPanel(false); setDraft(null); };
  const savePanel  = () => { set({ cond: { ...cd, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Method & Limits">
      <DisplayCardGrid cols={2}>
        <DisplayCard title="Valuation & Limits" onEdit={openLimits}>
          <DisplayField label="Basis of Valuation" value={cd.basis} span={2} />
          <DisplayField label="Conditions" value={cd.conditions} span={2} />
          <DisplayField label="Irrespective of Incoterm" value={cd.irrespective} />
          <DisplayField label="Expected Profit %" value={cd.expectedProfit != null && cd.expectedProfit !== "" ? `${cd.expectedProfit}%` : null} />
          <DisplayField label="Limit (per conveyance)" value={cd.limit ? `${fmtDE(cd.limit)} ${cur}` : null} />
          <DisplayField label="Limit (annual aggregate)" value={cd.limitAggregate ? `${fmtDE(cd.limitAggregate)} ${cur}` : null} />
          <DisplayField label="TSI" value={cd.tsi ? `${fmtDE(cd.tsi)} ${cur}` : null} />
        </DisplayCard>

        <DisplayCard title="Deductibles" onEdit={openDeduct}>
          <DisplayField label="General" value={cd.deductibleGeneral ? `${fmtDE(cd.deductibleGeneral)} ${cur}` : null} />
          <DisplayField label="Land (if different)" value={cd.deductibleLand ? `${fmtDE(cd.deductibleLand)} ${cur}` : null} />
          <DisplayField label="Sea (if different)" value={cd.deductibleSea ? `${fmtDE(cd.deductibleSea)} ${cur}` : null} />
          <DisplayField label="Air (if different)" value={cd.deductibleAir ? `${fmtDE(cd.deductibleAir)} ${cur}` : null} />
          <DisplayField label="Temp. Controlled" value={cd.deductibleTemp ? `${fmtDE(cd.deductibleTemp)} ${cur}` : null} />
          <DisplayField label="Storage (days)" value={cd.storageDayLimit ? `${cd.storageDayLimit} days` : null} />
          <DisplayField label="Storage deductible" value={cd.deductibleStorage ? `${fmtDE(cd.deductibleStorage)} ${cur}` : null} />
          <DisplayField label="NatCat" value={cd.deductibleNatcat ? `${fmtDE(cd.deductibleNatcat)} ${cur}` : null} />
          <DisplayField label="Annual aggregate" value={cd.deductibleAnnAgg ? `${fmtDE(cd.deductibleAnnAgg)} ${cur}` : null} />
          <DisplayField label="Proportional deductible" value={cd.propDeductible} span={2} />
          {cd.propDeductible === "Yes" ? <>
            <DisplayField label="FIX or MIN" value={cd.fixOrMin} />
            <DisplayField label="Prop %" value={cd.propPct != null && cd.propPct !== "" ? `${cd.propPct}%` : null} />
            <DisplayField label="Max" value={cd.propMax ? `${fmtDE(cd.propMax)} ${cur}` : null} />
          </> : null}
        </DisplayCard>
      </DisplayCardGrid>

      <Drawer
        open={limitsPanel}
        onClose={closePanel}
        title="Edit Valuation & Limits"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Basis of Valuation">
              <FilledSelect value={draft.basis} onChange={(v) => ud("basis", v)} options={REFS.basisOfValuation} />
            </FilledField>
            <FilledField label="Conditions">
              <FilledSelect value={draft.conditions} onChange={(v) => ud("conditions", v)} options={["Broker conditions", "Individual written conditions", "HDI-Wording"]} />
            </FilledField>
            <FilledField label="Irrespective of Incoterm">
              <FilledRadio value={draft.irrespective} onChange={(v) => ud("irrespective", v)} options={["Yes", "No"]} />
            </FilledField>
            <FilledField label="Expected Profit % (CIF/CIP)">
              <FilledNumber value={draft.expectedProfit} onChange={(v) => ud("expectedProfit", v)} suffix="%" min={0} max={100} />
            </FilledField>
            <FilledField label="Limit (per conveyance)">
              <FilledNumber value={draft.limit} onChange={(v) => ud("limit", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Limit (annual aggregate)">
              <FilledNumber value={draft.limitAggregate} onChange={(v) => ud("limitAggregate", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="TSI (Total Sum Insured)">
              <FilledNumber value={draft.tsi} onChange={(v) => ud("tsi", v)} suffix={cur} min={0} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>

      <Drawer
        open={deductPanel}
        onClose={closePanel}
        title="Edit Deductibles"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="General">
              <FilledNumber value={draft.deductibleGeneral} onChange={(v) => ud("deductibleGeneral", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Land (if different)">
              <FilledNumber value={draft.deductibleLand} onChange={(v) => ud("deductibleLand", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Sea (if different)">
              <FilledNumber value={draft.deductibleSea} onChange={(v) => ud("deductibleSea", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Air (if different)">
              <FilledNumber value={draft.deductibleAir} onChange={(v) => ud("deductibleAir", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Temp. Controlled">
              <FilledNumber value={draft.deductibleTemp} onChange={(v) => ud("deductibleTemp", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Storage in ordinary course (days)">
              <FilledNumber value={draft.storageDayLimit} onChange={(v) => ud("storageDayLimit", v)} suffix="days" min={0} />
            </FilledField>
            <FilledField label="Storage deductible">
              <FilledNumber value={draft.deductibleStorage} onChange={(v) => ud("deductibleStorage", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="NatCat">
              <FilledNumber value={draft.deductibleNatcat} onChange={(v) => ud("deductibleNatcat", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Annual aggregate">
              <FilledNumber value={draft.deductibleAnnAgg} onChange={(v) => ud("deductibleAnnAgg", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Proportional deductible">
              <FilledRadio value={draft.propDeductible} onChange={(v) => ud("propDeductible", v)} options={["Yes", "No"]} />
            </FilledField>
            {draft.propDeductible === "Yes" ? <>
              <FilledField label="FIX or MIN">
                <FilledRadio value={draft.fixOrMin} onChange={(v) => ud("fixOrMin", v)} options={["FIX", "MIN"]} />
              </FilledField>
              <FilledField label="Prop %">
                <FilledNumber value={draft.propPct} onChange={(v) => ud("propPct", v)} suffix="%" min={0} max={100} />
              </FilledField>
              <FilledField label="Max">
                <FilledNumber value={draft.propMax} onChange={(v) => ud("propMax", v)} suffix={cur} min={0} />
              </FilledField>
            </> : null}
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 4 — Claim Data (Goods + Transport + Geo)
// =============================================================================
function Step_ClaimData({ state, set }) {
  return (
    <div>
      <Goods state={state} set={set} />
      <Transport state={state} set={set} />
      <Geo state={state} set={set} />
    </div>
  );
}

function Goods({ state, set }) {
  const g = state.goods;
  const total = sumSplit(g.classes);
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...g.classes[i] }); };
  const openNew  = () => { setEditIdx(g.classes.length); setDraft({ cls: "", sub: "", temp: false, theft: false, split: "" }); };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    const rows = editIdx >= g.classes.length
      ? [...g.classes, draft]
      : g.classes.map((r, i) => i === editIdx ? draft : r);
    set({ goods: { ...g, classes: rows } });
    closeDrawer();
  };
  const remove = (i) => set({ goods: { ...g, classes: g.classes.filter((_, idx) => idx !== i) } });
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section
      title="Type of Goods"
      right={<div className="split-pill" data-state={total === 100 ? "ok" : "warn"}><span>Σ split</span><strong>{total}%</strong></div>}
    >
      <table className="grid-tbl">
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Class</th>
            <th>Subclass</th>
            <th style={{ width: "10%" }}>Temp.</th>
            <th style={{ width: "10%" }}>Theft</th>
            <th style={{ width: "10%" }}>Split %</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {g.classes.length === 0 ? (
            <tr><td colSpan={7} className="t-muted t-center">No goods classes yet.</td></tr>
          ) : null}
          {g.classes.map((row, i) => (
            <tr key={i}>
              <td className="t-mono t-muted">{i + 1}</td>
              <td>{row.cls || <span className="t-muted">—</span>}</td>
              <td>{row.sub || <span className="t-muted">—</span>}</td>
              <td>{row.temp ? "Yes" : <span className="t-muted">No</span>}</td>
              <td>{row.theft ? "Yes" : <span className="t-muted">No</span>}</td>
              <td>{row.split !== "" ? `${row.split}%` : <span className="t-muted">—</span>}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                  {g.classes.length > 1 ? <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {total !== 100 && total > 0 ? <div style={{ marginTop: 10 }}><InfoNote tone="warn">Split must total 100%. Currently {total}%.</InfoNote></div> : null}
      {g.classes.length < 3 ? <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add class</button></div> : null}

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= g.classes.length ? "Add Goods Class" : "Edit Goods Class"}
        footer={<DrawerFooter onSave={saveDrawer} onCancel={closeDrawer} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Class">
              <FilledSelect value={draft.cls} onChange={(v) => ud("cls", v)} options={REFS.typeOfGoodsClasses} placeholder="Choose class" />
            </FilledField>
            <FilledField label="Subclass">
              <FilledSelect value={draft.sub} onChange={(v) => ud("sub", v)} options={REFS.typeOfGoodsSubclasses[draft.cls] || []} placeholder={REFS.typeOfGoodsSubclasses[draft.cls] ? "Choose subclass" : "(no subclass)"} />
            </FilledField>
            <FilledField label="Split %">
              <FilledNumber value={draft.split} onChange={(v) => ud("split", v)} suffix="%" min={0} max={100} />
            </FilledField>
            <FilledField label="Temperature sensitive">
              <FilledRadio value={draft.temp ? "Yes" : "No"} onChange={(v) => ud("temp", v === "Yes")} options={["Yes", "No"]} />
            </FilledField>
            <FilledField label="Prone to theft">
              <FilledRadio value={draft.theft ? "Yes" : "No"} onChange={(v) => ud("theft", v === "Yes")} options={["Yes", "No"]} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

function Transport({ state, set }) {
  const t = state.transport;
  const [panelOpen, setPanelOpen] = useS(false);
  const [draft, setDraft] = useS(null);

  const openPanel  = () => { setDraft({ ...t }); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setDraft(null); };
  const savePanel  = () => { set({ transport: { ...t, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const total = (Number(t.land) || 0) + (Number(t.sea) || 0) + (Number(t.air) || 0);

  return (
    <Section title="Type of Transportation">
      <DisplayCardGrid cols={1}>
        <DisplayCard title="Transport Split" onEdit={openPanel}>
          {t.splitAvailable && total > 0 ? (
            <div style={{ gridColumn: "span 2", marginBottom: 8 }}>
              <div className="bar-stack">
                {[{ k: "land", color: "var(--bar-land)" }, { k: "sea", color: "var(--bar-sea)" }, { k: "air", color: "var(--bar-air)" }].map(({ k, color }) => {
                  const v = Number(t[k]) || 0;
                  if (!v) return null;
                  return <div key={k} className="bar-stack__seg" style={{ width: `${v}%`, background: color }}><span>{k} {v}%</span></div>;
                })}
              </div>
            </div>
          ) : null}
          {t.splitAvailable ? (
            <F>
              <DisplayField label="Land (Road / Rail / Inland Water)" value={t.land !== "" && t.land != null ? `${t.land}%` : null} />
              <DisplayField label="Sea" value={t.sea !== "" && t.sea != null ? `${t.sea}%` : null} />
              <DisplayField label="Air" value={t.air !== "" && t.air != null ? `${t.air}%` : null} />
            </F>
          ) : (
            <DisplayField label="Split available" value="No — single-mode flat pricing" span={2} />
          )}
        </DisplayCard>
      </DisplayCardGrid>

      <Drawer
        open={panelOpen}
        onClose={closePanel}
        title="Edit Transport Split"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Split available">
              <FilledRadio value={draft.splitAvailable ? "Yes" : "No"} onChange={(v) => ud("splitAvailable", v === "Yes")} options={["Yes", "No"]} />
            </FilledField>
            {draft.splitAvailable ? (
              <F>
                <FilledField label="Land (Road / Rail / Inland Water)">
                  <FilledNumber value={draft.land} onChange={(v) => ud("land", v)} suffix="%" min={0} max={100} />
                </FilledField>
                <FilledField label="Sea">
                  <FilledNumber value={draft.sea} onChange={(v) => ud("sea", v)} suffix="%" min={0} max={100} />
                </FilledField>
                <FilledField label="Air">
                  <FilledNumber value={draft.air} onChange={(v) => ud("air", v)} suffix="%" min={0} max={100} />
                </FilledField>
              </F>
            ) : null}
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

function Geo({ state, set }) {
  const g = state.geo;
  const total = sumSplit(g.rows, "share");
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...g.rows[i] }); };
  const openNew  = () => { setEditIdx(g.rows.length); setDraft({ from: "", to: "", phase: "Shipment", share: "", surcharge: "" }); };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    const rows = editIdx >= g.rows.length
      ? [...g.rows, draft]
      : g.rows.map((r, i) => i === editIdx ? draft : r);
    set({ geo: { ...g, rows } });
    closeDrawer();
  };
  const remove = (i) => set({ geo: { ...g, rows: g.rows.filter((_, idx) => idx !== i) } });
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section
      title="Geographical Scope"
      right={<div className="split-pill" data-state={total === 100 ? "ok" : "warn"}><span>Σ share</span><strong>{total}%</strong></div>}
    >
      <table className="grid-tbl">
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th style={{ width: "14%" }}>Phase</th>
            <th>From</th>
            <th>To</th>
            <th style={{ width: "10%" }}>Share %</th>
            <th style={{ width: "12%" }}>Surcharge</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {g.rows.length === 0 ? (
            <tr><td colSpan={7} className="t-muted t-center">No lanes yet.</td></tr>
          ) : null}
          {g.rows.map((row, i) => (
            <tr key={i}>
              <td className="t-mono t-muted">{i + 1}</td>
              <td>{row.phase || <span className="t-muted">—</span>}</td>
              <td>{row.from || <span className="t-muted">—</span>}</td>
              <td>{row.to || <span className="t-muted">—</span>}</td>
              <td>{row.share !== "" ? `${row.share}%` : <span className="t-muted">—</span>}</td>
              <td>{row.surcharge !== "" && row.surcharge != null ? `${row.surcharge}%` : <span className="t-muted">—</span>}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                  {g.rows.length > 1 ? <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {total !== 100 && total > 0 ? <div style={{ marginTop: 10 }}><InfoNote tone="warn">Share must total 100%. Currently {total}%.</InfoNote></div> : null}
      <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add lane</button></div>

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= g.rows.length ? "Add Lane" : "Edit Lane"}
        footer={<DrawerFooter onSave={saveDrawer} onCancel={closeDrawer} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Phase">
              <FilledSelect value={draft.phase} onChange={(v) => ud("phase", v)} options={["Purchase", "Shipment"]} />
            </FilledField>
            <FilledField label="From">
              <FilledSelect value={draft.from} onChange={(v) => ud("from", v)} options={REFS.regions} placeholder="Region" />
            </FilledField>
            <FilledField label="To">
              <FilledSelect value={draft.to} onChange={(v) => ud("to", v)} options={REFS.regions} placeholder="Region" />
            </FilledField>
            <FilledField label="Share %">
              <FilledNumber value={draft.share} onChange={(v) => ud("share", v)} suffix="%" min={0} max={100} />
            </FilledField>
            <FilledField label="Surcharge %">
              <FilledNumber value={draft.surcharge} onChange={(v) => ud("surcharge", v)} suffix="%" />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 5 — Additional Coverages
// =============================================================================
function Step_AddCov({ state, set }) {
  const cov = state.coverages;
  const [panelOpen, setPanelOpen] = useS(false);
  const [draft, setDraft] = useS(null);

  const openPanel = () => { setDraft({ ...cov }); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setDraft(null); };
  const savePanel = () => { set({ coverages: { ...cov, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section title="Additional Coverages">
      <DisplayCardGrid cols={1}>
        <DisplayCard title="Selected Coverages" onEdit={openPanel}>
          {REFS.additionalCoverages.map((c) => (
            <DisplayField key={c.key} label={c.label} value={cov[c.key] ? "Yes" : "No"} />
          ))}
        </DisplayCard>
      </DisplayCardGrid>

      {cov.War ? <CountryList title="Countries — Institute War Clauses" rows={state.warCountries} onChange={(rows) => set({ warCountries: rows })} ctx={state} /> : null}
      {cov.StrikeAndRiot ? <CountryList title="Countries — Institute Strikes Clauses" rows={state.strikeCountries} onChange={(rows) => set({ strikeCountries: rows })} ctx={state} /> : null}

      <Drawer
        open={panelOpen}
        onClose={closePanel}
        title="Edit Additional Coverages"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            {REFS.additionalCoverages.map((c) => (
              <FilledField key={c.key} label={c.label}>
                <FilledRadio value={draft[c.key] ? "Yes" : "No"} onChange={(v) => ud(c.key, v === "Yes")} options={["Yes", "No"]} />
              </FilledField>
            ))}
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

function CountryList({ title, rows, onChange, ctx }) {
  const cur = (window.appSettings && window.appSettings.currency) || ctx.client.currency || "EUR";
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...rows[i] }); };
  const openNew  = () => { setEditIdx(rows.length); setDraft({ country: "", surchargeKind: "percentage", surcharge: "", limit: "", deductible: "" }); };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    const next = editIdx >= rows.length ? [...rows, draft] : rows.map((r, i) => i === editIdx ? draft : r);
    onChange(next);
    closeDrawer();
  };
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="subblock">
      <div className="subblock__head">
        <h3>{title}</h3>
        <span className="t-muted t-small">{rows.length} {rows.length === 1 ? "country" : "countries"}</span>
      </div>
      <table className="grid-tbl">
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Country</th>
            <th style={{ width: "14%" }}>Surcharge type</th>
            <th style={{ width: "12%" }}>Surcharge</th>
            <th style={{ width: "16%" }}>Limit</th>
            <th style={{ width: "16%" }}>Deductible</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={7} className="t-muted t-center">No countries yet — add at least one.</td></tr> : null}
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="t-mono t-muted">{i + 1}</td>
              <td>{r.country || <span className="t-muted">—</span>}</td>
              <td>{r.surchargeKind || <span className="t-muted">—</span>}</td>
              <td>{r.surcharge !== "" && r.surcharge != null ? `${r.surcharge}${r.surchargeKind === "percentage" ? "%" : ` ${cur}`}` : <span className="t-muted">—</span>}</td>
              <td>{r.limit ? fmtDE(r.limit) : <span className="t-muted">—</span>}</td>
              <td>{r.deductible ? fmtDE(r.deductible) : <span className="t-muted">—</span>}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                  <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add country</button></div>

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= rows.length ? "Add Country" : "Edit Country"}
        footer={<DrawerFooter onSave={saveDrawer} onCancel={closeDrawer} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Country">
              <FilledSelect value={draft.country} onChange={(v) => ud("country", v)} options={REFS.countries} placeholder="Country" />
            </FilledField>
            <FilledField label="Surcharge type">
              <FilledSelect value={draft.surchargeKind} onChange={(v) => ud("surchargeKind", v)} options={REFS.absoluteRelative} />
            </FilledField>
            <FilledField label="Surcharge">
              <FilledNumber value={draft.surcharge} onChange={(v) => ud("surcharge", v)} suffix={draft.surchargeKind === "percentage" ? "%" : cur} />
            </FilledField>
            <FilledField label="Limit">
              <FilledNumber value={draft.limit} onChange={(v) => ud("limit", v)} suffix={cur} min={0} />
            </FilledField>
            <FilledField label="Deductible">
              <FilledNumber value={draft.deductible} onChange={(v) => ud("deductible", v)} suffix={cur} min={0} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </div>
  );
}

// =============================================================================
// 6 — Storage Locations (with drawer edit pattern)
// =============================================================================
function Step_Storage({ state, set }) {
  const s = state.storage;
  const cur = (window.appSettings && window.appSettings.currency) || state.client.currency || "EUR";
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...s.rows[i] }); };
  const openNew  = () => {
    const newRow = { name: "", country: "", limit: "", avgValue: "", lat: "", lon: "", coordQ: "exact", goods: "", deductibleKind: "Percentage", deductible: "" };
    setEditIdx(s.rows.length);
    setDraft(newRow);
  };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    if (editIdx == null || !draft) return;
    const rows = editIdx >= s.rows.length ? [...s.rows, draft] : s.rows.map((r, i) => i === editIdx ? draft : r);
    set({ storage: { ...s, rows } });
    closeDrawer();
  };
  const remove = (i) => set({ storage: { ...s, rows: s.rows.filter((_, idx) => idx !== i) } });

  return (
    <Section
      title="Permanent Storage"
      intro="Location list. ARGOS Import replaces this list with the broker’s file. Click a row to edit details."
      right={<button className="link-btn"><Icon name="upload" size={14} /> ARGOS Import</button>}
    >
      {s.rows.length === 0 ? (
        <div className="empty">
          <div className="empty__title">No storage locations yet</div>
          <div className="empty__sub">Add a location manually or import an ARGOS list.</div>
          <button className="link-btn" onClick={openNew}>+ Add storage location</button>
        </div>
      ) : (
        <div>
          <table className="grid-tbl">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th>Name</th>
                <th style={{ width: "15%" }}>Country</th>
                <th style={{ width: "14%" }}>Limit</th>
                <th style={{ width: "14%" }}>Avg. Value</th>
                <th style={{ width: "14%" }}>Type of Goods</th>
                <th style={{ width: "12%" }}>Deductible</th>
                <th style={{ width: "8%" }}></th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i}>
                  <td className="t-mono t-muted">{i + 1}</td>
                  <td>{r.name || <span className="t-muted">—</span>}</td>
                  <td>{r.country || <span className="t-muted">—</span>}</td>
                  <td>{r.limit ? fmtDE(r.limit) : "—"}</td>
                  <td>{r.avgValue ? fmtDE(r.avgValue) : "—"}</td>
                  <td>{r.goods || <span className="t-muted">—</span>}</td>
                  <td>{r.deductible ? `${r.deductible}${r.deductibleKind === "Percentage" ? "%" : ""}` : "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                      <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="is-bold">
                <td colSpan={3}>Total</td>
                <td>{fmtDE(s.rows.reduce((a, r) => a + Number(r.limit || 0), 0))}</td>
                <td>{fmtDE(s.rows.reduce((a, r) => a + Number(r.avgValue || 0), 0))}</td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
          <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add storage location</button></div>
        </div>
      )}

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= s.rows.length ? "Add Storage Location" : "Storage Location"}
        footer={
          <div className="row" style={{ gap: 10 }}>
            <button className="btn" onClick={saveDrawer}>Save</button>
            <button className="btn btn--secondary" onClick={closeDrawer}>Cancel</button>
          </div>
        }
      >
        {draft ? (
          <div className="drawer-form">
            <Field label="Name of Storage Place"><TextInput value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Lager Hamburg-Süd" /></Field>
            <Field label="Country"><Select value={draft.country} onChange={(v) => setDraft({ ...draft, country: v })} options={REFS.countries} placeholder="—" /></Field>
            <Field label="Limit of Liability"><NumberInput value={draft.limit} onChange={(v) => setDraft({ ...draft, limit: v })} suffix={cur} min={0} placeholder="10.000.000" /></Field>
            <Field label="Average Value of Storage"><NumberInput value={draft.avgValue} onChange={(v) => setDraft({ ...draft, avgValue: v })} suffix={cur} min={0} placeholder="10.000.000" /></Field>
            <div className="row" style={{ gap: 12 }}>
              <Field label="Latitude"><NumberInput value={draft.lat} onChange={(v) => setDraft({ ...draft, lat: v })} step={0.0001} /></Field>
              <Field label="Longitude"><NumberInput value={draft.lon} onChange={(v) => setDraft({ ...draft, lon: v })} step={0.0001} /></Field>
            </div>
            <Field label="Coordinate Quality"><Select value={draft.coordQ} onChange={(v) => setDraft({ ...draft, coordQ: v })} options={["exact", "approx", "unknown"]} /></Field>
            <Field label="Type of Goods"><Select value={draft.goods} onChange={(v) => setDraft({ ...draft, goods: v })} options={REFS.storageGoodsCategories} placeholder="—" /></Field>
            <div className="row" style={{ gap: 12 }}>
              <Field label="Deductible Type"><Select value={draft.deductibleKind} onChange={(v) => setDraft({ ...draft, deductibleKind: v })} options={REFS.deductibleTypes} /></Field>
              <Field label="Deductible"><NumberInput value={draft.deductible} onChange={(v) => setDraft({ ...draft, deductible: v })} suffix={draft.deductibleKind === "Percentage" ? "%" : cur} min={0} /></Field>
            </div>
          </div>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 7 — BC Result (Expected Loss table)
// =============================================================================
function Step_BCResult({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const [collapsed, setCollapsed] = useS({});

  const toggle = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));

  // Tree data matching the Premium Result & Adjustment pattern
  const treeData = [
    { id: "baseline", depth: 0, expandable: true, label: "Marine Baseline PD/BI All Risk",
      expectedLoss: 35752, volLoading: 4587.98, claimCosts: 1.77, adminCosts: 8.55, tpBefore: 44980.23, techPremium: 45434.57 },
    { id: "prop-damage", depth: 1, expandable: true, parent: "baseline", label: "Property damage",
      expectedLoss: 20000, volLoading: null, claimCosts: null, adminCosts: null, tpBefore: 25162.36, techPremium: 25416.52 },
    { id: "flexa-1", depth: 2, leaf: true, parent: "prop-damage", label: "FLExA",
      expectedLoss: 20000, volLoading: null, claimCosts: null, adminCosts: null, tpBefore: 25162.36, techPremium: 25416.52 },
    { id: "bi", depth: 1, expandable: true, parent: "baseline", label: "Business interruption",
      expectedLoss: 15752, volLoading: null, claimCosts: null, adminCosts: null, tpBefore: 19817.87, techPremium: 20018.05 },
    { id: "flexa-2", depth: 2, leaf: true, parent: "bi", label: "FLExA",
      expectedLoss: 15752, volLoading: null, claimCosts: null, adminCosts: null, tpBefore: 19817.87, techPremium: 20018.05 },
  ];

  const total = { expectedLoss: 35752, volLoading: 4587.98, claimCosts: 1.77, adminCosts: 8.55, tpBefore: 44980.23, techPremium: 45434.57 };

  const isVisible = (row) => {
    if (row.depth === 0) return true;
    // Check all ancestors
    for (const item of treeData) {
      if (item.id === row.parent && item.expandable && collapsed[item.id]) return false;
      if (item.id === row.parent && item.parent) {
        const grandparent = treeData.find(t => t.id === item.parent);
        if (grandparent && collapsed[grandparent.id]) return false;
      }
    }
    return true;
  };

  const fmt = (v) => v == null ? "-" : v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Section title="Premium Result & Adjustment">
      <table className="tree-tbl">
        <thead>
          <tr>
            <th>Coverage</th>
            <th>Expected Loss</th>
            <th>Volatility Loading</th>
            <th>Claim Costs in %</th>
            <th>Admin Costs in %</th>
            <th>TP Before Brokerage</th>
            <th>Technical Premium</th>
          </tr>
        </thead>
        <tbody>
          {treeData.filter(isVisible).map(row => (
            <tr key={row.id} data-depth={row.depth}>
              <td>
                {row.expandable && (
                  <span className={`tree-chevron ${collapsed[row.id] ? "is-collapsed" : ""}`} onClick={() => toggle(row.id)}>
                    <i className="fa-solid fa-chevron-up"></i>
                  </span>
                )}
                {row.leaf && <span className="tree-connector"></span>}
                {row.label}
              </td>
              <td>{fmt(row.expectedLoss)}</td>
              <td>{fmt(row.volLoading)}</td>
              <td>{fmt(row.claimCosts)}</td>
              <td>{fmt(row.adminCosts)}</td>
              <td>{fmt(row.tpBefore)}</td>
              <td>{fmt(row.techPremium)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="is-total">
            <td><span className="tree-total-icon"><i className="fa-solid fa-table-cells"></i></span>Total</td>
            <td>{fmt(total.expectedLoss)}</td>
            <td>{fmt(total.volLoading)}</td>
            <td>{fmt(total.claimCosts)}</td>
            <td>{fmt(total.adminCosts)}</td>
            <td>{fmt(total.tpBefore)}</td>
            <td>{fmt(total.techPremium)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="calc-footer">
        <button className="btn btn--outline" style={{ padding: "6px 16px", fontSize: 13 }}>Calculate</button>
        <div className="calc-status">
          <i className="fa-solid fa-circle-check check-icon"></i>
          Calculated successfully: 28/05/2026 - 09:08h
        </div>
        <span className="calc-download"><i className="fa-solid fa-download"></i></span>
      </div>
    </Section>
  );
}

// =============================================================================
// 8 — Technical Adjustment (loadings & discounts on EL)
// =============================================================================
function Step_TechAdj({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const expectedLoss = r.buildup.find((b) => b.label === "Expected Loss")?.value || 0;
  const a = state.adjustments;
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...a[i] }); };
  const openNew  = () => { setEditIdx(a.length); setDraft({ kind: "Loading", percent: "", reason: "" }); };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    const rows = editIdx >= a.length ? [...a, draft] : a.map((row, i) => i === editIdx ? draft : row);
    set({ adjustments: rows });
    closeDrawer();
  };
  const remove = (i) => set({ adjustments: a.filter((_, idx) => idx !== i) });
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const computeRow = (row) => {
    const pct = Number(row.percent || 0) / 100;
    const sign = row.kind === "Loading" ? 1 : -1;
    return expectedLoss * pct * sign;
  };
  const total = a.reduce((s, row) => s + computeRow(row), 0);

  return (
    <Section title="Technical Adjustment">
      <table className="grid-tbl">
        <thead>
          <tr>
            <th>Expected Loss before adj.</th>
            <th>Loading / Discount Type</th>
            <th style={{ width: "12%" }}>Percent</th>
            <th style={{ width: "16%" }}>Value</th>
            <th>Reason</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {a.length === 0 ? <tr><td colSpan={6} className="t-muted t-center">No adjustments — Expected Loss flows through unchanged.</td></tr> : null}
          {a.map((row, i) => (
            <tr key={i}>
              <td>{r.fmt0(expectedLoss)}</td>
              <td>{row.kind}</td>
              <td>{row.percent !== "" ? `${row.percent}%` : <span className="t-muted">—</span>}</td>
              <td>{r.fmt0(computeRow(row))}</td>
              <td>{row.reason || <span className="t-muted">—</span>}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                  <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
          <tr className="is-bold">
            <td>Total</td>
            <td colSpan={2}></td>
            <td>{r.fmt0(total)}</td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>
      <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add New</button></div>

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= a.length ? "Add Adjustment" : "Edit Adjustment"}
        footer={<DrawerFooter onSave={saveDrawer} onCancel={closeDrawer} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Loading / Discount Type">
              <FilledSelect value={draft.kind} onChange={(v) => ud("kind", v)} options={["Loading", "Discount"]} />
            </FilledField>
            <FilledField label="Percent">
              <FilledNumber value={draft.percent} onChange={(v) => ud("percent", v)} suffix="%" />
            </FilledField>
            <FilledField label="Reason">
              <FilledSelect value={draft.reason} onChange={(v) => ud("reason", v)} options={["Sublimit", "Risk Profile", "Retention", "War & Strike", "Storage Day Limit", "Conditions", "Loss History", "Other"]} placeholder="Reason" />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 9 — Technical Premium (build-up table)
// =============================================================================
function Step_TechPremium({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const cur = r.currency;

  // Build coverage rows from calc output
  const rows = r.table.rows.filter(row => !row.italic);
  const grossTP = r.buildup.find(b => b.label === "Gross Technical Premium")?.value || 0;
  const netTP   = r.buildup.find(b => b.label === "Net Technical Premium")?.value || 0;
  const brok    = r.buildup.find(b => b.label === "Brokerage")?.value || 0;
  const volLoad = r.buildup.find(b => b.label === "Volatility Loading")?.value || 0;
  const el      = r.buildup.find(b => b.label === "Expected Loss")?.value || 0;

  // Per-row allocation ratio
  const alloc = (rowEL) => el > 0 ? rowEL / el : 0;
  const dataRows = rows.filter(row => !row.bold).map(row => {
    const rowEL = row.attr + row.large;
    const a = alloc(rowEL);
    return {
      label: row.label,
      el: rowEL,
      riskPremium: (el + volLoad) * a,
      brokerage: brok * a,
      netTP: netTP * a,
      grossTP: grossTP * a,
    };
  });
  const totEL = dataRows.reduce((s, r) => s + r.el, 0);
  const totRP = dataRows.reduce((s, r) => s + r.riskPremium, 0);
  const totBrok = dataRows.reduce((s, r) => s + r.brokerage, 0);
  const totNetTP = dataRows.reduce((s, r) => s + r.netTP, 0);

  return (
    <Section title="Technical Premium">
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <table className="grid-tbl">
            <thead>
              <tr>
                <th>Type</th>
                <th style={{ width: "14%" }}>Expected Loss</th>
                <th style={{ width: "14%" }}>Risk Premium</th>
                <th style={{ width: "12%" }}>Brokerage</th>
                <th style={{ width: "14%" }}>Net Tech. Premium</th>
                <th style={{ width: "14%" }}>Gross Tech. Premium</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td>{r.fmt0(row.el)}</td>
                  <td>{r.fmt0(row.riskPremium)}</td>
                  <td>{r.fmt0(row.brokerage)}</td>
                  <td>{r.fmt0(row.netTP)}</td>
                  <td>{r.fmt0(row.grossTP)}</td>
                </tr>
              ))}
              <tr className="is-bold">
                <td>Total</td>
                <td>{r.fmt0(totEL)}</td>
                <td>{r.fmt0(totRP)}</td>
                <td>{r.fmt0(totBrok)}</td>
                <td>{r.fmt0(totNetTP)}</td>
                <td>{r.fmt0(grossTP)}</td>
              </tr>
            </tbody>
          </table>
          <div className="tbl-foot">
            <button className="mini-btn mini-btn--add">Large account pricing</button>
          </div>
          <div className="calc-bar">
            <button className="btn btn--accent">Calculate</button>
            <span className="calc-bar__status">
              <svg viewBox="0 0 22 22" width="16" height="16"><circle cx="11" cy="11" r="9" fill="#65A518"/><path d="M6.5 11.5 L9.5 14.5 L15.5 8.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <strong>Calculated successfully:</strong> {state.lastModified}
            </span>
          </div>
        </div>

        <div className="dcard" style={{ width: 240, flexShrink: 0 }}>
          <div className="dcard__head"><h3 className="dcard__title">Calculation</h3></div>
          <div className="dcard__body dcard__body--grid" style={{ gridTemplateColumns: "1fr" }}>
            <DisplayField label="Method" value={state.client.pricingMethod || "Burning cost (experience-based)"} />
            <DisplayField label="Calculated" value={r.fmt0(grossTP)} />
            <DisplayField label="Calculation Version" value="1.0" />
            <DisplayField label="Parameter Version" value="2026-Q1" />
            <DisplayField label="Calculation ID" value={state.offerNr} />
          </div>
        </div>
      </div>
    </Section>
  );
}

// =============================================================================
// 10 — Loadings / Discounts
// =============================================================================
function Step_Loadings({ state, set, settings }) {
  const f = state.final;
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const [panelOpen, setPanelOpen] = useS(false);
  const [draft, setDraft] = useS(null);

  const openPanel  = () => { setDraft({ ...f }); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setDraft(null); };
  const savePanel  = () => { set({ final: { ...f, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const grossTP    = r.buildup.find(b => b.label === "Gross Technical Premium")?.value || 0;
  const commAdj    = r.buildup.find(b => b.label === "Commercial Adjustment on TP")?.value || 0;
  const offered    = r.buildup.find(b => b.label === "Gross Offered Premium")?.value || 0;
  const brokerage  = r.buildup.find(b => b.label === "Brokerage")?.value || 0;
  const ambition   = r.buildup.find(b => b.label === "Ambition Premium")?.value || 0;

  // Per coverage-line allocation (same logic as Tech Premium)
  const rows = r.table.rows.filter(row => !row.bold && !row.italic);
  const el   = r.buildup.find(b => b.label === "Expected Loss")?.value || 0;
  const alloc = (rowEL) => el > 0 ? rowEL / el : 0;

  const dataRows = rows.map(row => {
    const rowEL = row.attr + row.large;
    const a = alloc(rowEL);
    const tp = grossTP * a;
    const loading = commAdj * a;
    const off = offered * a;
    const walkAway = ambition * a;
    return { label: row.label, tp, loading, offered: off, walkAway, offeredHDI: off };
  });

  const totTP      = dataRows.reduce((s, r) => s + r.tp, 0);
  const totLoading = dataRows.reduce((s, r) => s + r.loading, 0);
  const totOff     = dataRows.reduce((s, r) => s + r.offered, 0);
  const totWalk    = dataRows.reduce((s, r) => s + r.walkAway, 0);

  return (
    <Section title="Loadings/Discounts">
      <table className="grid-tbl">
        <thead>
          <tr>
            <th>Coverage</th>
            <th style={{ width: "14%" }}>Technical Premium</th>
            <th style={{ width: "16%" }}>Loading / Discount</th>
            <th style={{ width: "14%" }}>Offered Premium</th>
            <th style={{ width: "14%" }}>Walk Away Premium</th>
            <th style={{ width: "14%" }}>Offered HDI Premium</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr key={i}>
              <td>{row.label}</td>
              <td>{r.fmt0(row.tp)}</td>
              <td>
                <button className="mini-btn mini-btn--add" onClick={openPanel}>Add New</button>
              </td>
              <td>{r.fmt0(row.offered)}</td>
              <td>{r.fmt0(row.walkAway)}</td>
              <td>{r.fmt0(row.offeredHDI)}</td>
            </tr>
          ))}
          <tr className="is-bold">
            <td>Total</td>
            <td>{r.fmt0(totTP)}</td>
            <td>{r.fmt0(totLoading)}</td>
            <td>{r.fmt0(totOff)}</td>
            <td>{r.fmt0(totWalk)}</td>
            <td>{r.fmt0(totOff)}</td>
          </tr>
        </tbody>
      </table>

      <Drawer
        open={panelOpen}
        onClose={closePanel}
        title="Edit Loadings / Discounts"
        footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Brokerage (% of gross)">
              <FilledNumber value={draft.brokerage} onChange={(v) => ud("brokerage", v)} suffix="%" min={0} max={50} />
            </FilledField>
            <FilledField label="Additional Costs">
              <FilledNumber value={draft.additionalCosts} onChange={(v) => ud("additionalCosts", v)} suffix={r.currency} min={0} />
            </FilledField>
            <FilledField label="Leading Fee">
              <FilledNumber value={draft.leadingFee} onChange={(v) => ud("leadingFee", v)} suffix="%" min={0} max={100} />
            </FilledField>
            <FilledField label="Commercial Adjustment (± % of TP)">
              <FilledNumber value={draft.commercialAdj} onChange={(v) => ud("commercialAdj", v)} suffix="%" />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 11 — Analysis / Choice  → "Select Offer(s)"
// =============================================================================
function Step_AnalysisChoice({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const offered  = r.buildup.find(b => b.label === "Gross Offered Premium")?.value || 0;
  const walkAway = r.buildup.find(b => b.label === "Ambition Premium")?.value || 0;
  const grossTP  = r.buildup.find(b => b.label === "Gross Technical Premium")?.value || 0;

  const coverageRows = r.table.rows.filter(row => !row.bold && !row.italic);
  const el = r.buildup.find(b => b.label === "Expected Loss")?.value || 0;
  const alloc = (rowEL) => el > 0 ? rowEL / el : 0;

  const baseRows = coverageRows.map(row => {
    const a = alloc(row.attr + row.large);
    return {
      label: row.label,
      tp: grossTP * a,
      offered: offered * a,
      walkAway: walkAway * a,
    };
  });

  // Per-row extras: status, HDI share, xs, xsPoint — stored in state
  const extras = state.analysisExtras || [];
  const getExtra = (i) => extras[i] || { status: "offered", hdiShare: 100, xs: "", xsPoint: "" };
  const setExtra = (i, patch) => {
    const next = baseRows.map((_, idx) => ({ ...getExtra(idx), ...(idx === i ? patch : {}) }));
    set({ analysisExtras: next });
  };

  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);
  const openEdit = (i) => { setEditIdx(i); setDraft({ ...getExtra(i) }); };
  const closeEdit = () => { setEditIdx(null); setDraft(null); };
  const saveEdit = () => { setExtra(editIdx, draft); closeEdit(); };
  const ud = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const cur = (window.appSettings && window.appSettings.currency) || state.client.currency || "EUR";

  return (
    <Section title="Please Select the Offer(s) You Would Like to Submit">
      <table className="grid-tbl">
        <thead>
          <tr>
            <th>Coverage</th>
            <th style={{ width: "11%" }}>Status</th>
            <th style={{ width: "9%" }}>xs</th>
            <th style={{ width: "10%" }}>xs-Point</th>
            <th style={{ width: "11%" }}>Technical Premium</th>
            <th style={{ width: "11%" }}>Offered Premium</th>
            <th style={{ width: "11%" }}>Walk Away Premium</th>
            <th style={{ width: "7%" }}>HDI Share</th>
            <th style={{ width: "11%" }}>Offered HDI Premium</th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {baseRows.map((row, i) => {
            const ex = getExtra(i);
            const offeredHDI = row.offered * (Number(ex.hdiShare) || 100) / 100;
            return (
              <tr key={i}>
                <td>{row.label}</td>
                <td>
                  <span className="status-chip">
                    <svg viewBox="0 0 16 16" width="13" height="13"><path d="M3 8.5 L6.5 12 L13 5" fill="none" stroke="#65A518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {ex.status}
                  </span>
                </td>
                <td>{ex.xs ? `${fmtDE(ex.xs)} ${cur}` : <span className="t-muted">—</span>}</td>
                <td>{ex.xsPoint ? `${fmtDE(ex.xsPoint)} ${cur}` : <span className="t-muted">—</span>}</td>
                <td>{r.fmt0(row.tp)}</td>
                <td>{r.fmt0(row.offered)}</td>
                <td>{r.fmt0(row.walkAway)}</td>
                <td>{ex.hdiShare}%</td>
                <td>{r.fmt0(offeredHDI)}</td>
                <td>
                  <div className="row-actions">
                    <button className="row-action" onClick={() => openEdit(i)} title="Edit row"><Icon name="pencil" size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Drawer
        open={editIdx != null}
        onClose={closeEdit}
        title={editIdx != null ? `Edit — ${baseRows[editIdx]?.label || "Row"}` : "Edit Row"}
        footer={<DrawerFooter onSave={saveEdit} onCancel={closeEdit} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Status">
              <FilledSelect value={draft.status} onChange={(v) => ud("status", v)} options={["offered", "ready to be offered", "declined", "pending"]} />
            </FilledField>
            <FilledField label="xs (Excess)">
              <FilledNumber value={draft.xs} onChange={(v) => ud("xs", v)} suffix={cur} min={0} placeholder="e.g. 1,000,000" />
            </FilledField>
            <FilledField label="xs-Point (Attachment Point)">
              <FilledNumber value={draft.xsPoint} onChange={(v) => ud("xsPoint", v)} suffix={cur} min={0} placeholder="e.g. 500,000" />
            </FilledField>
            <FilledField label="HDI Share (%)">
              <FilledNumber value={draft.hdiShare} onChange={(v) => ud("hdiShare", v)} suffix="%" min={0} max={100} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

// =============================================================================
// 12 — Summary → "Summary & Conclusion"
// =============================================================================
function Step_Summary({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const c = state.client;
  const [submitted, setSubmitted] = useS(false);
  const [panelOpen, setPanelOpen] = useS(false);
  const [activeTab, setActiveTab] = useS("summary");
  const [draft, setDraft] = useS(null);

  const openPanel  = () => {
    setActiveTab("summary");
    setDraft({
      riskAnalysis: c.riskAnalysis || "",
      claimSituation: c.claimSituation || "",
      policyWording: c.policyWording || "",
      renewalReminder: c.renewalReminder || "",
      conclusion: c.conclusion || "",
      authority: c.authority || "Personal Authority",
    });
    setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setDraft(null); };
  const savePanel  = () => { set({ client: { ...c, ...draft } }); closePanel(); };
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <Section title="Summary & Conclusion">
        <DisplayCard title="Summary & Conclusion" onEdit={openPanel}>
          <DisplayField label="Risk Analysis" value={c.riskAnalysis || <span className="t-muted">—</span>} />
          <DisplayField label="Claim Situation" value={c.claimSituation || <span className="t-muted">—</span>} />
          <DisplayField label="Policy Wording" value={c.policyWording || <span className="t-muted">—</span>} />
          <DisplayField label="Reminder for the Renewal" value={c.renewalReminder || <span className="t-muted">—</span>} />
          <DisplayField label="Conclusion" value={c.conclusion || <span className="t-muted">—</span>} />
          <DisplayField label="Authority" value={c.authority || "Personal Authority"} />
        </DisplayCard>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <button className="btn btn--secondary" onClick={() => setSubmitted(true)}>Submit option</button>
          {submitted ? (
            <div className="status-banner">
              <svg viewBox="0 0 22 22" width="16" height="16"><circle cx="11" cy="11" r="9" fill="#65A518"/><path d="M6.5 11.5 L9.5 14.5 L15.5 8.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <strong>Option Submitted</strong>
              <span className="t-muted">{state.lastModified} · Submitted by: {c.partner || "anonymousUser"}</span>
            </div>
          ) : null}
        </div>
      </Section>

      {c.intlPrograms === "Yes" ? <LocalPolicies state={state} set={set} /> : null}

      <Drawer open={panelOpen} onClose={closePanel} title="Summary & Conclusion" footer={<DrawerFooter onSave={savePanel} onCancel={closePanel} />}>
        {draft ? (
          <div>
            <p className="drawer-intro">Please provide a summary and conclusion for the offer</p>
            <div className="drawer-tabs">
              <button className={`drawer-tab ${activeTab === "summary" ? "is-active" : ""}`} onClick={() => setActiveTab("summary")}>Summary</button>
              <button className={`drawer-tab ${activeTab === "conclusion" ? "is-active" : ""}`} onClick={() => setActiveTab("conclusion")}>Conclusion</button>
            </div>
            {activeTab === "summary" ? (
              <div className="summary-textarea-grid">
                <div className="summary-textarea-field">
                  <div className="dfield__label" style={{ marginBottom: 8 }}>Risk Analysis</div>
                  <textarea className="summary-textarea" value={draft.riskAnalysis} onChange={(e) => ud("riskAnalysis", e.target.value)} rows={5} placeholder="Describe the risk analysis…" />
                </div>
                <div className="summary-textarea-field">
                  <div className="dfield__label" style={{ marginBottom: 8 }}>Claim Situation</div>
                  <textarea className="summary-textarea" value={draft.claimSituation} onChange={(e) => ud("claimSituation", e.target.value)} rows={5} placeholder="Describe the claim situation…" />
                </div>
                <div className="summary-textarea-field">
                  <div className="dfield__label" style={{ marginBottom: 8 }}>Policy Wording</div>
                  <textarea className="summary-textarea" value={draft.policyWording} onChange={(e) => ud("policyWording", e.target.value)} rows={5} placeholder="Policy wording notes…" />
                </div>
                <div className="summary-textarea-field">
                  <div className="dfield__label" style={{ marginBottom: 8 }}>Reminder for the Renewal</div>
                  <textarea className="summary-textarea" value={draft.renewalReminder} onChange={(e) => ud("renewalReminder", e.target.value)} rows={5} placeholder="Renewal reminder…" />
                </div>
              </div>
            ) : (
              <div style={{ padding: "24px 0 0" }}>
                <div className="summary-textarea-field" style={{ marginBottom: 28 }}>
                  <div className="dfield__label" style={{ marginBottom: 8 }}>Conclusion</div>
                  <textarea className="summary-textarea" value={draft.conclusion} onChange={(e) => ud("conclusion", e.target.value)} rows={8} placeholder="Why are we underwriting this risk? Does it align with strategy?&#10;Market environment and competition?&#10;Special factors affecting pricing?&#10;Need for future adjustments foreseeable?&#10;Is the premium flat or turnover-based?" />
                </div>
                <div>
                  <div className="dfield__label" style={{ marginBottom: 12 }}>Authority</div>
                  <FilledRadio value={draft.authority} onChange={(v) => ud("authority", v)} options={["Personal Authority", "Approval", "Referral"]} />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

// =============================================================================
// 13 — Final Decision
// =============================================================================
function Step_FinalDecision({ state, set, settings }) {
  const r = useM(() => CALC.run(state, settings), [state, settings]);
  const offered  = r.buildup.find(b => b.label === "Gross Offered Premium")?.value || 0;
  const grossTP  = r.buildup.find(b => b.label === "Gross Technical Premium")?.value || 0;

  const coverageRows = r.table.rows.filter(row => !row.bold && !row.italic);
  const el = r.buildup.find(b => b.label === "Expected Loss")?.value || 0;
  const alloc = (rowEL) => el > 0 ? rowEL / el : 0;

  const dataRows = coverageRows.map(row => {
    const a = alloc(row.attr + row.large);
    return {
      label: row.label,
      offered: offered * a,
      participation: "100% direct business",
      hdiShare: 100,
      achievedPremium: offered * a,
      achievedHDI: offered * a,
    };
  });

  const [finalised, setFinalised] = useS(false);

  return (
    <Section title="Please select decision for submitted offer">
      <table className="grid-tbl">
        <thead>
          <tr>
            <th>Coverage</th>
            <th style={{ width: "14%" }}>Decision</th>
            <th style={{ width: "12%" }}>Offered Premium</th>
            <th style={{ width: "14%" }}>Type of Participation</th>
            <th style={{ width: "8%" }}>HDI Share %</th>
            <th style={{ width: "11%" }}>Achieved Premium</th>
            <th style={{ width: "11%" }}>Achieved HDI Premium</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr key={i}>
              <td>{row.label}</td>
              <td>
                <span className="status-chip">
                  <svg viewBox="0 0 16 16" width="13" height="13"><path d="M3 8.5 L6.5 12 L13 5" fill="none" stroke="#65A518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Accepted · Price
                </span>
              </td>
              <td>{r.fmt0(row.offered)}</td>
              <td>{row.participation}</td>
              <td>{row.hdiShare}</td>
              <td>{r.fmt0(row.achievedPremium)}</td>
              <td>{r.fmt0(row.achievedHDI)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        {!finalised ? (
          <button className="btn btn--secondary" onClick={() => setFinalised(true)}>Finalise Offer</button>
        ) : null}
        {finalised ? (
          <F>
            <div className="status-banner">
              <svg viewBox="0 0 22 22" width="16" height="16"><circle cx="11" cy="11" r="9" fill="#65A518"/><path d="M6.5 11.5 L9.5 14.5 L15.5 8.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <strong>Offer Finalised</strong>
              <span className="t-muted">{state.lastModified} · Finalised by: anonymousUser</span>
            </div>
            <div className="status-banner status-banner--pending">
              <svg viewBox="0 0 22 22" width="16" height="16"><circle cx="11" cy="11" r="9" fill="none" stroke="var(--border-strong)" strokeWidth="2"/><path d="M11 7 L11 11 L14 13" stroke="var(--fg-muted)" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
              <strong>Policy Creation</strong>
              <span className="t-muted">Awaiting response…</span>
            </div>
          </F>
        ) : null}
      </div>
    </Section>
  );
}

function LocalPolicies({ state, set }) {
  const lp = state.localPolicies;
  const cur = (window.appSettings && window.appSettings.currency) || state.client.currency || "EUR";
  const [editIdx, setEditIdx] = useS(null);
  const [draft, setDraft] = useS(null);

  const openEdit = (i) => { setEditIdx(i); setDraft({ ...lp.rows[i] }); };
  const openNew  = () => { setEditIdx(lp.rows.length); setDraft({ country: "", lpCurrency: cur, share: "", premium: "", localFronter: "" }); };
  const closeDrawer = () => { setEditIdx(null); setDraft(null); };
  const saveDrawer  = () => {
    const rows = editIdx >= lp.rows.length ? [...lp.rows, draft] : lp.rows.map((r, i) => i === editIdx ? draft : r);
    set({ localPolicies: { ...lp, rows } });
    closeDrawer();
  };
  const remove = (i) => set({ localPolicies: { ...lp, rows: lp.rows.filter((_, idx) => idx !== i) } });
  const ud = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Section
      title="Local Policies"
      right={<Tag tone="brand">{lp.rows.length} of {state.client.numLocalPolicies || "?"} policies</Tag>}
    >
      <table className="grid-tbl">
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Country</th>
            <th style={{ width: "12%" }}>Currency</th>
            <th style={{ width: "10%" }}>Share %</th>
            <th>Local Fronter</th>
            <th style={{ width: "14%" }}>Local Premium</th>
            <th style={{ width: "8%" }}></th>
          </tr>
        </thead>
        <tbody>
          {lp.rows.length === 0 ? <tr><td colSpan={7} className="t-muted t-center">No local policies yet.</td></tr> : null}
          {lp.rows.map((r, i) => (
            <tr key={i}>
              <td className="t-mono t-muted">{i + 1}</td>
              <td>{r.country || <span className="t-muted">—</span>}</td>
              <td>{r.lpCurrency || <span className="t-muted">—</span>}</td>
              <td>{r.share !== "" ? `${r.share}%` : <span className="t-muted">—</span>}</td>
              <td>{r.localFronter || <span className="t-muted">—</span>}</td>
              <td>{r.premium ? fmtDE(r.premium) : <span className="t-muted">—</span>}</td>
              <td>
                <div className="row-actions">
                  <button className="row-action" onClick={() => openEdit(i)} title="Edit"><Icon name="pencil" size={18} /></button>
                  <button className="row-action is-danger" onClick={() => remove(i)} title="Delete"><Icon name="trash" size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tbl-foot"><button className="mini-btn mini-btn--add" onClick={openNew}>Add local policy</button></div>

      <Drawer
        open={editIdx != null}
        onClose={closeDrawer}
        title={editIdx != null && editIdx >= lp.rows.length ? "Add Local Policy" : "Edit Local Policy"}
        footer={<DrawerFooter onSave={saveDrawer} onCancel={closeDrawer} />}
      >
        {draft ? (
          <DrawerForm cols={1}>
            <FilledField label="Country">
              <FilledSelect value={draft.country} onChange={(v) => ud("country", v)} options={REFS.countries} placeholder="Country" />
            </FilledField>
            <FilledField label="Currency">
              <FilledSelect value={draft.lpCurrency} onChange={(v) => ud("lpCurrency", v)} options={REFS.currencies.map(c => c.code)} />
            </FilledField>
            <FilledField label="Share %">
              <FilledNumber value={draft.share} onChange={(v) => ud("share", v)} suffix="%" min={0} max={100} />
            </FilledField>
            <FilledField label="Local Fronter">
              <FilledInput value={draft.localFronter} onChange={(v) => ud("localFronter", v)} placeholder="HDI subsidiary…" />
            </FilledField>
            <FilledField label="Local Premium">
              <FilledNumber value={draft.premium} onChange={(v) => ud("premium", v)} suffix={draft.lpCurrency || cur} min={0} />
            </FilledField>
          </DrawerForm>
        ) : null}
      </Drawer>
    </Section>
  );
}

Object.assign(window, {
  Step_Client, Step_Tools, Step_MethodLimits, Step_ClaimData,
  Step_AddCov, Step_Storage, Step_BCResult, Step_TechAdj,
  Step_TechPremium, Step_Loadings, Step_AnalysisChoice, Step_Summary,
  Step_FinalDecision,
});

function SettingsScreen({ settings, onSave, openRatesDrawer, onRatesDrawerOpened }) {
  const [regionalOpen, setRegionalOpen] = useS(false);
  const [ratesOpen, setRatesOpen] = useS(false);
  const [draft, setDraft] = useS(null);

  useE(() => {
    if (openRatesDrawer) {
      setDraft({ ...settings });
      setRatesOpen(true);
      onRatesDrawerOpened?.();
    }
  }, [openRatesDrawer]);

  const openRegional = () => { setDraft({ ...settings }); setRegionalOpen(true); };
  const closeRegional = () => { setDraft(null); setRegionalOpen(false); };
  const saveRegional = () => {
    onSave({ ...settings, ...draft });
    setRegionalOpen(false);
    setDraft(null);
  };

  const openRates = () => { setDraft({ ...settings }); setRatesOpen(true); };
  const closeRates = () => { setDraft(null); setRatesOpen(false); };
  const saveRates = () => {
    const coerced = (draft.exchangeRates ?? []).map((r) => ({
      ...r,
      rate: parseFloat(r.rate) || 0,
    }));
    onSave({ ...settings, exchangeRates: coerced });
    setRatesOpen(false);
    setDraft(null);
  };

  const setDraftKey = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const setDraftRate = (code, value) => setDraft((d) => ({
    ...d,
    exchangeRates: (d.exchangeRates ?? []).map((r) =>
      r.code === code ? { ...r, rate: value } : r
    ),
  }));

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
        <DisplayCard title="Regional & Display Settings" onEdit={openRegional}>
          <DisplayField label="Locale Preset"  value={settings.preset} />
          <DisplayField label="Language"       value={LANGUAGE_OPTIONS.find(o => o.value === settings.language)?.label || settings.language} />
          <DisplayField label="Currency"       value={CURRENCY_OPTIONS.find(o => o.value === settings.currency)?.label || settings.currency} />
          <DisplayField label="Number Format"  value={numberPreview} mono />
          <DisplayField label="Date Format"    value={settings.dateFormat} />
          <DisplayField label="Timezone"       value={settings.timezone} />
          <DisplayField label="Unit System"    value={settings.unitSystem === "metric" ? "Metric" : "Imperial"} />
        </DisplayCard>
        <DisplayCard title="Exchange Rates" onEdit={openRates}>
          <DisplayField label="Base Currency" value="EUR — 1.00 (base)" />
          {(settings.exchangeRates ?? []).map((r) => (
            <DisplayField key={r.code} label={r.code} value={Number(r.rate).toFixed(4)} mono />
          ))}
        </DisplayCard>
      </DisplayCardGrid>

      {regionalOpen && draft ? (
        <Drawer open title="Edit Regional & Display Settings" onClose={closeRegional}
          footer={<DrawerFooter onSave={saveRegional} onCancel={closeRegional} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Locale Preset">
              <Select
                value={draft.preset}
                onChange={(v) => applyPreset(v)}
                options={Object.keys(LOCALE_PRESETS).map(k => ({ value: k, label: k }))}
              />
            </Field>
            <Field label="Language">
              <Select
                value={draft.language}
                onChange={(v) => setDraftKey("language", v)}
                options={LANGUAGE_OPTIONS}
              />
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
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {UNIT_SYSTEM_OPTIONS.map(({ value, label }) => (
                  <label key={value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                    <input
                      type="radio"
                      name="unitSystem"
                      value={value}
                      checked={draft.unitSystem === value}
                      onChange={() => setDraftKey("unitSystem", value)}
                      style={{ accentColor: "var(--accent)", width: 16, height: 16, cursor: "pointer" }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        </Drawer>
      ) : null}

      {ratesOpen && draft ? (
        <Drawer open title="Edit Exchange Rates" onClose={closeRates}
          footer={<DrawerFooter onSave={saveRates} onCancel={closeRates} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Rates are relative to EUR (base = 1.0000).
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="EUR" hint="Base currency">
                <div className="input input--disabled">
                  <span className="input__el" style={{ padding: "6px 10px", display: "block", fontFamily: "monospace" }}>1.0000</span>
                </div>
              </Field>
              {(draft.exchangeRates ?? []).map((r) => (
                <Field key={r.code} label={r.code}>
                  <input
                    className="input__el"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={String(r.rate)}
                    onChange={(e) => setDraftRate(r.code, e.target.value)}
                    style={{ width: "100%", padding: "6px 10px", fontFamily: "monospace", border: "1px solid var(--border)", borderRadius: 4, fontSize: 14 }}
                  />
                </Field>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.
            </div>
          </div>
        </Drawer>
      ) : null}
    </div>
  );
}

window.SettingsScreen = SettingsScreen;

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

function ExchangeRatesScreen({ settings, onOpenSettings }) {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const allRates = [
    { code: "EUR", name: CURRENCY_NAMES["EUR"], rate: 1.0000, isBase: true },
    ...(settings.exchangeRates ?? []).map((r) => ({
      code: r.code,
      name: CURRENCY_NAMES[r.code] || r.code,
      rate: typeof r.rate === "number" ? r.rate : parseFloat(r.rate) || 0,
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
        <DisplayCard title="Today's Rates" grid={false}>
          <div style={{ display: "flex", flexDirection: "column" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Currency</th>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Code</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rate vs EUR</th>
              </tr>
            </thead>
            <tbody>
              {allRates.map((r, i) => (
                <tr key={r.code} style={{ borderBottom: i < allRates.length - 1 ? "1px solid var(--border-subtle, #f0f0f0)" : "none" }}>
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
          <div style={{
            marginTop: 16,
            marginLeft: -16, marginRight: -16, marginBottom: -16,
            padding: "10px 16px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-subtle, #f8f8f8)",
            borderRadius: "0 0 8px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <i className="fa-regular fa-clock" style={{ fontSize: 12 }} />
              01 June 2026
            </span>
            <button
              className="btn btn--ghost"
              style={{ fontSize: 12, padding: "4px 10px" }}
              onClick={() => onOpenSettings?.()}
            >
              Update rates →
            </button>
          </div>
          </div>
        </DisplayCard>
      </DisplayCardGrid>
    </div>
  );
}

window.ExchangeRatesScreen = ExchangeRatesScreen;
