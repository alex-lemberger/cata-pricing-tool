// UI primitives — restyled for the Underwriting Workbench look
// Drawer / icon set / partner banner pieces live here too.

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Field / inputs ----------

function Field({ label, hint, required, children, error, span = 1, optional }) {
  return (
    <label className="field" style={{ gridColumn: `span ${span}` }}>
      <div className="field__head">
        <span className="field__label">
          {label}
          {required ? <span className="field__req">*</span> : null}
          {optional ? <span className="field__opt">(optional)</span> : null}
        </span>
        {hint ? <span className="field__hint">{hint}</span> : null}
      </div>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, mono, type = "text", disabled, suffix, prefix }) {
  return (
    <div className={`input ${disabled ? "input--disabled" : ""}`}>
      {prefix ? <span className="input__prefix">{prefix}</span> : null}
      <input
        className={`input__el ${mono ? "input__el--mono" : ""}`}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {suffix ? <span className="input__suffix">{suffix}</span> : null}
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, suffix, prefix, min, max, step = 1 }) {
  const locale = () => (window.appSettings && window.appSettings.locale) || "de-DE";
  const decimalSep = () => new Intl.NumberFormat(locale()).formatToParts(1.1).find(p => p.type === "decimal")?.value || ",";
  const groupSep   = () => new Intl.NumberFormat(locale()).formatToParts(1000).find(p => p.type === "group")?.value || ".";

  const fmt = (n) => {
    if (n == null || n === "") return "";
    const num = Number(n);
    if (isNaN(num)) return String(n);
    return new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(num);
  };

  const parse = (str) => {
    if (!str) return "";
    const gs = groupSep();
    const ds = decimalSep();
    const cleaned = str.split(gs).join("").replace(ds, ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? "" : n;
  };

  const [display, setDisplay] = useState(fmt(value));
  useEffect(() => { setDisplay(fmt(value)); }, [value, locale()]);

  const handleBlur = () => {
    const parsed = parse(display);
    if (parsed === "") { setDisplay(""); onChange?.(""); return; }
    let n = Number(parsed);
    if (isNaN(n)) { setDisplay(fmt(value)); return; }
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    onChange?.(n);
    setDisplay(fmt(n));
  };

  return (
    <div className={`input`}>
      {prefix ? <span className="input__prefix">{prefix}</span> : null}
      <input
        className="input__el input__el--mono"
        type="text"
        inputMode="decimal"
        value={display}
        onChange={(e) => setDisplay(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {suffix ? <span className="input__suffix">{suffix}</span> : null}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, disabled }) {
  return (
    <div className={`select ${disabled ? "select--disabled" : ""}`}>
      <select
        className="select__el"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled={!!value}>{placeholder || "Select…"}</option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value ?? o.code ?? o.label ?? o.name;
          const l = typeof o === "string" ? o : o.label ?? o.name ?? v;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <svg className="select__chev" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

function YesNo({ value, onChange, disabled }) {
  return (
    <div className={`yesno ${disabled ? "yesno--disabled" : ""}`}>
      <button type="button" className={`yesno__btn ${value === "Yes" ? "is-on" : ""}`} onClick={() => onChange?.("Yes")} disabled={disabled}>Yes</button>
      <button type="button" className={`yesno__btn ${value === "No"  ? "is-on" : ""}`} onClick={() => onChange?.("No")}  disabled={disabled}>No</button>
    </div>
  );
}

function Check({ checked, onChange, label, sub }) {
  return (
    <label className={`check ${checked ? "is-on" : ""}`}>
      <span className="check__box" aria-hidden="true">
        {checked ? (
          <svg viewBox="0 0 12 12" width="11" height="11"><path d="M2.5 6.2 L5 8.6 L9.5 3.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : null}
      </span>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} hidden />
      <span className="check__body">
        <span className="check__label">{label}</span>
        {sub ? <span className="check__sub">{sub}</span> : null}
      </span>
    </label>
  );
}

// ---------- Layout helpers ----------

function Section({ title, kicker, right, children, intro }) {
  return (
    <section className="section">
      <header className="section__head">
        <div className="section__head-l">
          {kicker ? <div className="section__kicker">{kicker}</div> : null}
          <div className="section__title-row">
            <h2 className="section__title">{title}</h2>
          </div>
          {intro ? <p className="section__intro">{intro}</p> : null}
        </div>
        {right ? <div className="section__head-r">{right}</div> : null}
      </header>
      <div className="section__body">{children}</div>
    </section>
  );
}

function Group({ children, cols = 12 }) {
  return <div className="group" style={{ "--cols": cols }}>{children}</div>;
}

function HelperBanner({ children }) {
  return (
    <div className="helper-banner">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 4.5 L8 8.8 M8 11 L8 11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <span>{children}</span>
    </div>
  );
}

function InfoNote({ children, tone = "info" }) {
  return <div className={`note note--${tone}`}>
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 4.5 L8 8.8 M8 11 L8 11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
    <span>{children}</span>
  </div>;
}

function MiniBtn({ children, onClick, danger, disabled, kind = "ghost" }) {
  return (
    <button type="button" className={`mini-btn mini-btn--${kind} ${danger ? "is-danger" : ""}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Tag({ children, tone = "neutral" }) {
  return <span className={`tag tag--${tone}`}>{children}</span>;
}

// ---------- Icon set (Font Awesome 6) ----------
function Icon({ name, size = 16 }) {
  const map = {
    "id-card":    "fa-regular fa-id-card",
    "cloud":      "fa-solid fa-toolbox",
    "doc":        "fa-regular fa-file-lines",
    "edit":       "fa-solid fa-pen-ruler",
    "list":       "fa-solid fa-file-shield",
    "id-tag":     "fa-solid fa-tag",
    "sliders":    "fa-solid fa-sliders",
    "handshake":  "fa-solid fa-file-contract",
    "chev-down":  "fa-solid fa-chevron-down",
    "chev-right": "fa-solid fa-chevron-right",
    "file":       "fa-regular fa-file",
    "clock":      "fa-regular fa-clock",
    "status":     "fa-regular fa-clipboard",
    "tag":        "fa-solid fa-tag",
    "pencil":     "fa-solid fa-pencil",
    "trash":      "fa-regular fa-trash-can",
    "feedback":   "fa-regular fa-comment-dots",
    "links":      "fa-solid fa-link",
    "user":       "fa-regular fa-user",
    "close":      "fa-solid fa-xmark",
    "settings":   "fa-solid fa-gear",
    "coins":      "fa-solid fa-coins",
    "upload":     "fa-solid fa-upload",
    "mail":       "fa-regular fa-envelope",
  };
  const cls = map[name];
  if (!cls) return null;
  return <i className={cls} aria-hidden="true" style={{ fontSize: size, width: size, display: "inline-block", textAlign: "center" }} />;
}

// ---------- Drawer (right slide-over for editing rows) ----------

function Drawer({ open, onClose, title, footer, children, width = 760 }) {
  if (!open) return null;
  return (
    <div className="drawer-root">
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" style={{ width }}>
        <header className="drawer__head">
          <h3 className="drawer__title">{title}</h3>
          <button type="button" className="drawer__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer ? <footer className="drawer__foot">{footer}</footer> : null}
      </aside>
    </div>
  );
}

// ---------- Display primitives (read-only main-pane cards) ----------

function DisplayCard({ title, onEdit, children, span, grid = true }) {
  return (
    <div className="dcard" style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <header className="dcard__head">
        <h3 className="dcard__title">{title}</h3>
        {onEdit ? (
          <button className="dcard__edit" onClick={onEdit} aria-label={`Edit ${title}`} title={`Edit ${title}`}>
            <Icon name="pencil" size={14} />
          </button>
        ) : null}
      </header>
      <div className={`dcard__body ${grid ? "dcard__body--grid" : ""}`}>{children}</div>
    </div>
  );
}

function DisplayField({ label, value, mono, span = 1, empty = "—" }) {
  const isEmpty = value == null || value === "" || value === false;
  return (
    <div className="dfield" style={{ gridColumn: `span ${span}` }}>
      <div className="dfield__label">{label}</div>
      <div className={`dfield__value ${mono ? "is-mono" : ""} ${isEmpty ? "is-empty" : ""}`}>
        {isEmpty ? empty : value}
      </div>
    </div>
  );
}

function DisplayCardGrid({ children, cols = 2 }) {
  return <div className="dcard-grid" style={{ "--dcols": cols }}>{children}</div>;
}

// ---------- Filled (drawer) input variants ----------

function FilledInput({ value, onChange, placeholder, mono, type = "text", suffix }) {
  return (
    <div className="finput">
      <input
        className={`finput__el ${mono ? "is-mono" : ""}`}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || "Placeholder"}
      />
      {suffix ? <span className="finput__suffix">{suffix}</span> : null}
    </div>
  );
}

function FilledNumber({ value, onChange, placeholder, suffix, min, max }) {
  const locale = () => (window.appSettings && window.appSettings.locale) || "de-DE";
  const decimalSep = () => new Intl.NumberFormat(locale()).formatToParts(1.1).find(p => p.type === "decimal")?.value || ",";
  const groupSep   = () => new Intl.NumberFormat(locale()).formatToParts(1000).find(p => p.type === "group")?.value || ".";

  // Format a raw number for display
  const fmt = (n) => {
    if (n == null || n === "") return "";
    const num = Number(n);
    if (isNaN(num)) return String(n);
    return new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(num);
  };

  // Parse a locale-formatted string back to a plain number string
  const parse = (str) => {
    if (!str) return "";
    const gs = groupSep();
    const ds = decimalSep();
    // Remove group separators, replace decimal sep with "."
    const cleaned = str.split(gs).join("").replace(ds, ".");
    const n = parseFloat(cleaned);
    return isNaN(n) ? "" : n;
  };

  const [display, setDisplay] = useState(fmt(value));

  // Keep display in sync when value changes externally
  useEffect(() => { setDisplay(fmt(value)); }, [value, locale()]);

  const handleChange = (e) => {
    setDisplay(e.target.value); // let user type freely
  };

  const handleBlur = () => {
    const parsed = parse(display);
    if (parsed === "") {
      setDisplay("");
      onChange?.("");
      return;
    }
    let n = Number(parsed);
    if (isNaN(n)) { setDisplay(fmt(value)); return; }
    if (min != null && n < min) n = min;
    if (max != null && n > max) n = max;
    onChange?.(n);
    setDisplay(fmt(n));
  };

  return (
    <div className="finput">
      <input
        className="finput__el is-mono"
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || ""}
      />
      {suffix ? <span className="finput__suffix">{suffix}</span> : null}
    </div>
  );
}

function FilledSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="fselect">
      <select className="fselect__el" value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}>
        <option value="">{placeholder || "Placeholder"}</option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value ?? o.code ?? o.label ?? o.name;
          const l = typeof o === "string" ? o : o.label ?? o.name ?? v;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <svg className="fselect__chev" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

function FilledYesNo({ value, onChange }) {
  return (
    <div className="fyesno">
      <button type="button" className={`fyesno__btn ${value === "Yes" ? "is-on" : ""}`} onClick={() => onChange?.("Yes")}>Yes</button>
      <button type="button" className={`fyesno__btn ${value === "No"  ? "is-on" : ""}`} onClick={() => onChange?.("No")}>No</button>
    </div>
  );
}

function FilledRadio({ value, onChange, options }) {
  return (
    <div className="fradio">
      {options.map((opt) => (
        <label key={opt} className={`fradio__item ${value === opt ? "is-on" : ""}`} onClick={() => onChange?.(opt)}>
          <span className="fradio__circle" />
          <span className="fradio__label">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function FilledField({ label, children, span = 1 }) {
  return (
    <div className="ffield" style={{ gridColumn: `span ${span}` }}>
      <label className="ffield__label">{label}</label>
      {children}
    </div>
  );
}

function DrawerForm({ children, cols = 2 }) {
  return <div className="drawer-form-grid" style={{ "--dfcols": cols }}>{children}</div>;
}

function DrawerFooter({ onSave, onCancel, saveLabel = "Save", cancelLabel = "Cancel" }) {
  return (
    <div className="drawer-foot">
      <button className="btn btn--accent" onClick={onSave}>{saveLabel}</button>
      <button className="btn btn--outline" onClick={onCancel}>{cancelLabel}</button>
    </div>
  );
}

function FilledDate({ value, onChange, placeholder = "dd/mm/yyyy" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Parse value to Date object
  const parseDate = (str) => {
    if (!str) return null;
    const parts = str.split(/[.\/\-]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return new Date(+y, +m - 1, +d);
    }
    return null;
  };

  const selected = parseDate(value);
  const [viewDate, setViewDate] = React.useState(() => selected || new Date());

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfWeek = (y, m) => new Date(y, m, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = daysInMonth(year, month);
  const startDay = (firstDayOfWeek(year, month) + 6) % 7; // Monday first

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  const selectDay = (d) => {
    const dd = String(d).padStart(2, "0");
    const mm = String(month + 1).padStart(2, "0");
    onChange?.(`${dd}/${mm}/${year}`);
    setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (d) => selected && selected.getDate() === d && selected.getMonth() === month && selected.getFullYear() === year;
  const isToday = (d) => { const t = new Date(); return t.getDate() === d && t.getMonth() === month && t.getFullYear() === year; };

  return (
    <div className="finput finput--date" ref={ref}>
      <input
        className="finput__el is-mono"
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
      />
      <span className="finput__cal-icon" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-calendar-days"></i>
      </span>
      {open && (
        <div className="datepicker">
          <div className="datepicker__header">
            <button className="datepicker__nav" onClick={prevMonth}><i className="fa-solid fa-chevron-left"></i></button>
            <span className="datepicker__title">{monthNames[month]} {year}</span>
            <button className="datepicker__nav" onClick={nextMonth}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
          <div className="datepicker__days-header">
            {dayNames.map(d => <span key={d} className="datepicker__dayname">{d}</span>)}
          </div>
          <div className="datepicker__grid">
            {Array.from({ length: startDay }).map((_, i) => <span key={`e${i}`} className="datepicker__empty"></span>)}
            {Array.from({ length: days }).map((_, i) => {
              const d = i + 1;
              return (
                <button
                  key={d}
                  className={`datepicker__day ${isSelected(d) ? "is-selected" : ""} ${isToday(d) ? "is-today" : ""}`}
                  onClick={() => selectDay(d)}
                >{d}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NavDivider({ label }) {
  return (
    <li className="nav-divider" aria-hidden="true">
      {label ? <span className="nav-divider__label">{label}</span> : null}
    </li>
  );
}

Object.assign(window, {
  Field, TextInput, NumberInput, Select, YesNo, Check,
  Section, Group, HelperBanner, InfoNote, MiniBtn, Tag,
  Icon, Drawer,
  DisplayCard, DisplayField, DisplayCardGrid,
  FilledInput, FilledNumber, FilledSelect, FilledYesNo, FilledRadio, FilledField, FilledDate,
  DrawerForm, DrawerFooter, NavDivider,
});
