// Reference data lifted from the CaTa Pricing Tool workbook
// (curated subsets — full lists in the source XLSM)

window.REFS = {
  branches: [
    { id: "01", name: "SüdVers" },
    { id: "02", name: "Büchner & Barella" },
    { id: "03", name: "Willis" },
    { id: "04", name: "Dr. Hörtkorn" },
    { id: "05", name: "Leue & Nill" },
    { id: "06", name: "HDI-Wording" },
    { id: "99", name: "Other" },
  ],

  typeOfParticipation_nonMM: [
    "100% Direct Business",
    "Lead",
    "Coinsurance",
  ],
  typeOfParticipation_MM: [
    "100% Direct Business",
    "Coinsurance",
  ],

  status: ["", "offered", "accepted", "declined"],

  currencies: [
    { code: "EUR", name: "EUR - Euro" },
    { code: "USD", name: "USD - US Dollar" },
    { code: "GBP", name: "GBP - British Pound" },
    { code: "CHF", name: "CHF - Swiss Franc" },
    { code: "JPY", name: "JPY - Japanese Yen" },
    { code: "CNY", name: "CNY - Chinese Yuan Renminbi" },
    { code: "AUD", name: "AUD - Australian Dollar" },
    { code: "CAD", name: "CAD - Canadian Dollar" },
    { code: "SEK", name: "SEK - Swedish Krona" },
    { code: "NOK", name: "NOK - Norwegian Krone" },
    { code: "DKK", name: "DKK - Danish Krone" },
    { code: "PLN", name: "PLN - Polish Zloty" },
    { code: "BRL", name: "BRL - Brazilian Real" },
    { code: "INR", name: "INR - Indian Rupee" },
    { code: "ZAR", name: "ZAR - South African Rand" },
  ],

  coverType1_nonMM: [
    "All Risk",
    "ICC",
    "DTV",
    "Named Perils",
    "Broker conditions",
    "individual written conditions",
  ],
  coverType1_MM: [
    "All Risk",
    "DTV",
    "Named Perils",
  ],
  coverType2: [
    "Transports incl. Storage in the ordinary course of Transit",
    "Permanent Storage",
    "Both",
  ],

  // NAICS / sector list — collapsed to top-level groups (the workbook has ~99 sub-codes)
  naics: [
    { code: "A", label: "Agriculture, Forestry, Fishing" },
    { code: "B", label: "Mining & Quarrying" },
    { code: "C", label: "Manufacturing" },
    { code: "D", label: "Electricity, Gas, Steam" },
    { code: "E", label: "Water, Sewerage, Waste" },
    { code: "F", label: "Construction" },
    { code: "G", label: "Wholesale & Retail Trade" },
    { code: "H", label: "Transportation & Storage" },
    { code: "I", label: "Accommodation & Food" },
    { code: "J", label: "Information & Communication" },
    { code: "K", label: "Financial Services & Insurance" },
    { code: "L", label: "Real Estate" },
    { code: "M", label: "Professional, Scientific & Technical" },
    { code: "N", label: "Administrative & Support Services" },
    { code: "O", label: "Public Administration & Defence" },
    { code: "P", label: "Education" },
    { code: "Q", label: "Human Health & Social Work" },
    { code: "R", label: "Arts, Entertainment & Recreation" },
    { code: "S", label: "Other Service Activities" },
    { code: "T", label: "Household Activities" },
    { code: "U", label: "Extraterritorial Organisations" },
  ],

  // Type of Goods — Class 1 = top, then Subclass per class
  typeOfGoodsClasses: [
    "1. Household & Furniture",
    "2. Industrial / Construction Equipment",
    "3. Vehicles (incl. Hybrid as combustion)",
    "4. Foodstuffs (packaged)",
    "5. Foodstuffs (bulk / raw)",
    "6. Beverages",
    "7. Chemicals / Pharmaceuticals",
    "8. Petroleum & Fuels (liquid bulk)",
    "9. Liquids (other, packaged)",
    "10. Electronics / IT Equipment",
    "11. Textiles & Apparel",
    "12. Bulk goods (gravel, coal, ore, grain, coffee)",
    "13. Heavy single pieces (steel beams, logs)",
    "14. Glass & Ceramic Construction",
    "15. Machinery (movable)",
    "16. High-value / Jewellery",
    "17. Art & Antiques",
    "18. Other",
  ],

  typeOfGoodsSubclasses: {
    "10. Electronics / IT Equipment": [
      "Brown goods (entertainment electronics)",
      "White goods (household appliances)",
      "IT Hardware",
      "Consumer Electronics",
      "Industrial Electronics",
    ],
    "3. Vehicles (incl. Hybrid as combustion)": [
      "Passenger cars (combustion / hybrid)",
      "Passenger cars (EV)",
      "Trucks & Commercial",
      "Motorcycles",
      "Used vehicles",
    ],
    "7. Chemicals / Pharmaceuticals": [
      "Chemicals (non-hazardous)",
      "Chemicals (hazardous)",
      "Pharmaceutical finished",
      "Pharmaceutical raw materials",
    ],
    "1. Household & Furniture": [
      "Furniture",
      "Tableware & Glassware",
      "Mixed household",
    ],
  },

  // Transportation modes
  transportationModes: [
    "Land (Road / Rail / Inland Water)",
    "Sea",
    "Air",
  ],

  // Geographical regions (subset from workbook list)
  regions: [
    "Europe - North",
    "Europe - East",
    "Europe - South",
    "Europe - West",
    "America - North",
    "America - South",
    "Asia",
    "Asia - SouthEast",
    "Asia - NearEast",
    "Africa - North",
    "Africa - East",
    "Africa - South",
    "Africa - West",
    "Africa - Central",
    "Australia / Oceania",
    "Caribbean",
    "Worldwide other",
  ],
  countries: [
    "Germany","Austria","Switzerland","France","Italy","Spain","Netherlands",
    "Belgium","Poland","Czechia","Denmark","Sweden","Norway","Finland",
    "United Kingdom","Ireland","Portugal","Greece","Türkiye","Russia",
    "Ukraine","USA","Canada","Mexico","Brazil","Argentina","Chile","Colombia",
    "China","Japan","South Korea","India","Indonesia","Singapore","Hong Kong",
    "Vietnam","Thailand","Malaysia","UAE","Saudi Arabia","Qatar","Israel",
    "Egypt","Morocco","South Africa","Nigeria","Kenya","Australia","New Zealand",
  ],

  // Basis of Valuation
  basisOfValuation: [
    "Irrespective of Incoterm (CIF/CIP + Expected Profit)",
    "CIF / CIP",
    "Invoice Value",
    "Purchase Price",
    "Market Value at Destination",
    "Other (specify)",
  ],

  conditionTypes: ["FIX", "MIN", "Prop", "max"],
  absoluteRelative: ["fixed value", "percentage"],

  // Additional coverages — from CheckBoxes.bas
  additionalCoverages: [
    { key: "Exhibitions",   label: "Exhibitions",            cell: "Messen" },
    { key: "WorksOfArt",    label: "Works of Art",           cell: "Kunst" },
    { key: "HouseholdGoods",label: "Household Goods / Moving", cell: "Umzug" },
    { key: "Consequential", label: "Consequential Damage",   cell: "Gueterfolge" },
    { key: "FinancialLoss", label: "Financial Loss",         cell: "Vermoegen" },
    { key: "War",           label: "War",                     cell: "Krieg", spawnsCountries: true },
    { key: "StrikeAndRiot", label: "Strike & Riot",           cell: "Streik", spawnsCountries: true },
    { key: "ProtAndCondDiff", label: "Protection & Condition Difference", cell: "Schutz" },
    { key: "IP",            label: "Intellectual Property",  cell: "IP" },
    { key: "Luggage",       label: "Luggage",                cell: "Luggage" },
    { key: "Cyber",         label: "Cyber",                  cell: "Cyber" },
    { key: "Pandemic",      label: "Pandemic",               cell: "Pandemic" },
  ],

  // Permanent Storage — column labels
  storageColumns: [
    { key: "name",  label: "Name of Storage Place",       de: "Lagername" },
    { key: "custNo", label: "Storage ID — Insured",       de: "Kundennummer" },
    { key: "hdiNo", label: "Storage ID — Insurer",        de: "HDI Lagernummer" },
    { key: "country", label: "Country (ISO)",             de: "Land" },
    { key: "limit", label: "Limit of Liability",          de: "Versicherungssumme" },
    { key: "avgValue", label: "Average Value of Storage", de: "Aktueller Lagerwert" },
    { key: "lat", label: "Latitude",                       de: "Breitengrad" },
    { key: "lon", label: "Longitude",                      de: "Längengrad" },
    { key: "coordQ", label: "Coord. Quality",              de: "Koordinaten Qualität" },
  ],

  deductibleTypes: ["Fixed Amount", "Percentage"],

  storageGoodsCategories: [
    "Chemicals","Refrigerated Food","IT Hardware","Electronics","Textile",
    "Furniture","Vehicles","Machinery","Pharma","General Cargo","Other",
  ],
};
