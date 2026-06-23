// Mock pricing engine — mirrors the line-item layout of the Output sheet
// in the workbook (Transport / Permanent Storage / Man-Made / NatCat /
// Additional Coverages, then Volatility → Risk → Expenses → Brokerage →
// Commercial Adj → Ambition Margin → Offered).
//
// Numbers are not the real HDI tariff — they are realistic placeholders
// that respond to inputs in plausible directions so reviewers can sanity-
// check the *layout and flow* end-to-end.

window.CALC = (function () {
  const fmt0 = (n, cur = "EUR") =>
    new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(n || 0)) + " " + cur;
  const fmt2 = (n) =>
    new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
  const pct = (n, d = 3) =>
    (Number(n) || 0).toFixed(d).replace(/\.?0+$/, "") + "%";

  // Class-of-goods loss rate per mille of turnover (made-up but plausible)
  const goodsRate = (cls) => {
    if (!cls) return 0.45;
    const map = {
      "1. Household": 0.35,
      "2. Industrial": 0.60,
      "3. Vehicles": 0.85,
      "4. Foodstuffs (packaged)": 0.40,
      "5. Foodstuffs (bulk": 0.55,
      "6. Beverages": 0.30,
      "7. Chemicals": 0.95,
      "8. Petroleum": 1.10,
      "9. Liquids": 0.65,
      "10. Electronics": 1.20,
      "11. Textiles": 0.50,
      "12. Bulk": 0.40,
      "13. Heavy": 0.80,
      "14. Glass": 1.05,
      "15. Machinery": 0.70,
      "16. High-value": 1.45,
      "17. Art": 1.30,
      "18. Other": 0.50,
    };
    for (const k of Object.keys(map)) if (cls.startsWith(k)) return map[k];
    return 0.50;
  };

  // Region surcharge multiplier
  const regionMult = (r) => {
    if (!r) return 1.0;
    if (r.includes("Worldwide")) return 1.20;
    if (r.includes("Africa")) return 1.18;
    if (r.includes("South")) return 1.12;
    if (r.includes("Asia - NearEast")) return 1.25;
    if (r.startsWith("Europe")) return 0.95;
    if (r.startsWith("America - North")) return 1.00;
    return 1.05;
  };

  function run(state, settings) {
    const cur = (settings && settings.currency) || state.client.currency || "EUR";
    const locale = (settings && settings.locale) || "en-GB";
    const fmt0local = (n) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 0,
      }).format(Math.round(n || 0));
    const turnover = Number(state.cover.turnoverCargo || state.cover.turnover || 0);

    // ---- Transport ----
    const goods = state.goods.classes;
    let blendedRate = 0;
    let totalSplit = 0;
    goods.forEach((g) => {
      const split = Number(g.split || 0);
      blendedRate += goodsRate(g.cls) * split;
      totalSplit += split;
    });
    blendedRate = totalSplit > 0 ? blendedRate / totalSplit : 0.50;

    // Transportation mode adjustment
    const tm = state.transport;
    const modeAdj =
      (Number(tm.land || 0) * 0.95 +
        Number(tm.sea || 0) * 1.00 +
        Number(tm.air || 0) * 1.40) /
      Math.max(1, Number(tm.land || 0) + Number(tm.sea || 0) + Number(tm.air || 0));

    // Geo mix
    let geoMult = 1.0;
    if (state.geo.rows.length) {
      let w = 0, sum = 0;
      state.geo.rows.forEach((r) => {
        const s = Number(r.share || 0);
        sum += s * regionMult(r.to);
        w += s;
      });
      geoMult = w > 0 ? sum / w : 1.0;
    }

    // Deductible credit
    const dedGen = Number(state.cond.deductibleGeneral || 0);
    const dedCredit = Math.max(0, 1 - Math.min(0.25, dedGen / 5000));

    const transportEL =
      (turnover * blendedRate / 1000) * modeAdj * geoMult * dedCredit;

    // Split attritional / large
    const transportAttr = transportEL * 0.65;
    const transportLarge = transportEL * 0.35;

    // ---- Permanent Storage ----
    let storageEL = 0;
    if (state.storage && state.storage.rows.length) {
      state.storage.rows.forEach((r) => {
        const limit = Number(r.limit || 0);
        const avg = Number(r.avgValue || limit * 0.6);
        const ded = Number(r.deductible || 0);
        const dedF = ded > 0 ? Math.max(0.6, 1 - ded / 50000) : 1;
        storageEL += avg * 0.0012 * dedF;
      });
    }
    const storageAttr = storageEL * 0.55;
    const storageLarge = storageEL * 0.45;

    // ---- Man-Made vs NatCat (we treat 88% / 12% of transport+storage as a placeholder) ----
    const manmade = (transportEL + storageEL) * 0.88;
    const natcat = (transportEL + storageEL) * 0.12;

    // ---- Additional Coverages ----
    const add = state.coverages;
    let addEL = 0;
    const addBreakdown = [];
    if (add.War) {
      const c = (state.warCountries || []).length || 1;
      const v = turnover * 0.00010 * c;
      addEL += v;
      addBreakdown.push({ label: "War", attr: v * 0.4, large: v * 0.6 });
    }
    if (add.StrikeAndRiot) {
      const c = (state.strikeCountries || []).length || 1;
      const v = turnover * 0.00008 * c;
      addEL += v;
      addBreakdown.push({ label: "Strike & Riot", attr: v * 0.5, large: v * 0.5 });
    }
    if (add.Cyber)         { const v = turnover * 0.00020; addEL += v; addBreakdown.push({ label: "Cyber", attr: v * 0.3, large: v * 0.7 }); }
    if (add.WorksOfArt)    { const v = turnover * 0.00012; addEL += v; addBreakdown.push({ label: "Works of Art", attr: v * 0.4, large: v * 0.6 }); }
    if (add.Exhibitions)   { const v = turnover * 0.00009; addEL += v; addBreakdown.push({ label: "Exhibitions", attr: v * 0.6, large: v * 0.4 }); }
    if (add.HouseholdGoods){ const v = turnover * 0.00008; addEL += v; addBreakdown.push({ label: "Household Goods", attr: v * 0.7, large: v * 0.3 }); }
    if (add.Consequential) { const v = turnover * 0.00015; addEL += v; addBreakdown.push({ label: "Consequential Damage", attr: v * 0.5, large: v * 0.5 }); }
    if (add.FinancialLoss) { const v = turnover * 0.00018; addEL += v; addBreakdown.push({ label: "Financial Loss", attr: v * 0.4, large: v * 0.6 }); }
    if (add.IP)            { const v = turnover * 0.00007; addEL += v; addBreakdown.push({ label: "IP", attr: v * 0.6, large: v * 0.4 }); }
    if (add.Luggage)       { const v = turnover * 0.00005; addEL += v; addBreakdown.push({ label: "Luggage", attr: v * 0.7, large: v * 0.3 }); }
    if (add.Pandemic)      { const v = turnover * 0.00011; addEL += v; addBreakdown.push({ label: "Pandemic", attr: v * 0.5, large: v * 0.5 }); }
    if (add.ProtAndCondDiff){ const v = turnover * 0.00006; addEL += v; addBreakdown.push({ label: "Prot. & Cond. Diff.", attr: v * 0.5, large: v * 0.5 }); }

    const addAttr = addBreakdown.reduce((s, x) => s + x.attr, 0);
    const addLarge = addBreakdown.reduce((s, x) => s + x.large, 0);

    // ---- Totals ----
    const totalAttr = transportAttr + storageAttr + addAttr;
    const totalLarge = transportLarge + storageLarge + addLarge;
    const expectedLoss = totalAttr + totalLarge;

    // ---- Technical Adjustments (loadings/discounts applied to EL) ----
    const adjList = state.adjustments || [];
    const adjustmentTotal = adjList.reduce((sum, row) => {
      const pct = Number(row.percent || 0) / 100;
      const sign = row.kind === "Loading" ? 1 : -1;
      return sum + expectedLoss * pct * sign;
    }, 0);
    const adjustedEL = expectedLoss + adjustmentTotal;

    // ---- Build-up ----
    const volatilityLoading = adjustedEL * 0.18;
    const riskPremium = adjustedEL + volatilityLoading;
    const expenses = riskPremium * 0.16;
    const netTechnicalPremium = riskPremium + expenses;
    const brokerageRate = Number(state.final.brokerage || 0) / 100;
    const brokerage = netTechnicalPremium * (brokerageRate / Math.max(0.0001, 1 - brokerageRate));
    const grossTechnicalPremium = netTechnicalPremium + brokerage;
    const commercialAdj = grossTechnicalPremium * (Number(state.final.commercialAdj || 0) / 100);
    const grossOfferedPremium = grossTechnicalPremium + commercialAdj;
    const ambitionMargin = grossTechnicalPremium * 0.06;
    const ambitionPremium = grossTechnicalPremium + ambitionMargin;
    const commAdjOnAmbition = ambitionPremium * (Number(state.final.commercialAdj || 0) / 100);
    const offeredAmbitionPremium = ambitionPremium + commAdjOnAmbition;
    const grossAchievedPremium = grossOfferedPremium; // assumption for prototype
    const apTp = grossOfferedPremium / Math.max(1, grossTechnicalPremium);

    const rate = (v) => turnover > 0 ? (v / turnover) * 100 : 0;

    return {
      currency: cur,
      turnover,
      table: {
        rows: [
          { label: "Transport",            attr: transportAttr, large: transportLarge },
          { label: "Permanent Storage",    attr: storageAttr,   large: storageLarge,   muted: storageEL === 0 },
          { label: "Man-Made (subtotal)",  attr: manmade * 0.85, large: manmade * 0.15, italic: true },
          { label: "NatCat (subtotal)",    attr: natcat * 0.40, large: natcat * 0.60, italic: true },
          ...addBreakdown.map(x => ({ label: x.label, attr: x.attr, large: x.large, sub: true })),
          { label: "Total", attr: totalAttr, large: totalLarge, bold: true },
        ],
      },
      buildup: [
        { label: "Expected Loss",                     value: expectedLoss,         rate: rate(expectedLoss) },
        { label: "Technical Adjustments",             value: adjustmentTotal,      sub: true },
        { label: "Adjusted Expected Loss",            value: adjustedEL,           rate: rate(adjustedEL) },
        { label: "Volatility Loading",                value: volatilityLoading,    sub: true },
        { label: "Risk Premium",                      value: riskPremium,          rate: rate(riskPremium) },
        { label: "Expenses",                          value: expenses,             sub: true },
        { label: "Net Technical Premium",             value: netTechnicalPremium },
        { label: "Brokerage",                         value: brokerage,            sub: true },
        { label: "Gross Technical Premium",           value: grossTechnicalPremium, rate: rate(grossTechnicalPremium), bold: true },
        { label: "Commercial Adjustment on TP",       value: commercialAdj,        sub: true },
        { label: "Gross Offered Premium",             value: grossOfferedPremium,  rate: rate(grossOfferedPremium), accent: true },
        { label: "Ambition Margin on TP",             value: ambitionMargin,       sub: true },
        { label: "Ambition Premium",                  value: ambitionPremium,      rate: rate(ambitionPremium) },
        { label: "Commercial Adjustment on AP",       value: commAdjOnAmbition,    sub: true },
        { label: "Offered Ambition Premium",          value: offeredAmbitionPremium, rate: rate(offeredAmbitionPremium) },
        { label: "Gross Achieved Premium",            value: grossAchievedPremium, rate: rate(grossAchievedPremium) },
        { label: "AP / TP",                           value: apTp, isRatio: true },
      ],
      fmt0: fmt0local,
      fmt2,
      pct,
    };
  }

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
})();
