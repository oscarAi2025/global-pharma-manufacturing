/**
 * Interpreta una necesidad escrita en lenguaje natural (EN/ES/PT) y la convierte en filtros estructurados.
 * Es un analizador por reglas: no inventa nada; lo que no reconoce queda como «desconocido» y se pregunta.
 */
import { dosageForms, productTypes } from "./lead";

export type DosageForm = (typeof dosageForms)[number];
export type ProductType = (typeof productTypes)[number];
export type Region = "europe" | "north_america" | "latin_america" | "asia" | "middle_east" | "africa" | "oceania";

export interface Parsed {
  productType?: ProductType;
  dosageForm?: DosageForm;
  ingredients: string[];
  quantity?: number;
  quantityUnit?: "units" | "bottles" | "boxes" | "kg" | "sachets" | "capsules" | "tablets";
  manufacturingRegion?: Region;
  manufacturingCountry?: string;
  targetMarket?: string;
  certifications: string[];
  lowMoq: boolean;
  services: string[];
  matched: { field: string; text: string }[];
}

const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

const FORMS: [DosageForm, RegExp][] = [
  ["softgels", /\b(soft ?gels?|softgel|capsulas? blandas?|capsulas? moles?|perlas)\b/],
  ["gummies", /\b(gumm(y|ies)|gomin?olas?|gomitas?|gomas?|jelly)\b/],
  ["tablets", /\b(tablets?|tabletas?|comprimidos?|pills?|pastillas?|effervescent|efervescentes?)\b/],
  ["capsules", /\b(capsules?|capsulas?|caps)\b/],
  ["powders", /\b(powders?|polvos?|pos|po|sachets?|sobres?|saches?|stick ?packs?)\b/],
  ["liquids", /\b(liquids?|liquidos?|syrups?|jarabes?|xaropes?|drops|gotas|shots?|solutions?|soluciones?|solucoes?|viales|ampollas?)\b/],
];

const TYPES: [ProductType, RegExp][] = [
  ["supplement", /\b(supplements?|suplementos?|complementos?|nutraceutic\w*|vitamins?|vitaminas?|probiotic\w*|probiotic|minerals?|minerales|minerais|collagen|colageno|protein|proteina|omega|multivitamin\w*)\b/],
  ["pharma", /\b(pharmaceutical|farmaceutic\w*|medicin\w*|medicament\w*|drugs?|generics?|genericos?|api|gmp tablets?|rx|otc)\b/],
  ["cosmetic", /\b(cosmetic\w*|cosmetico\w*|skin ?care|creams?|cremas?|cremes?|serum|lotion|locion|locao)\b/],
];

const INGREDIENTS = ["vitamin c", "vitamin d", "vitamin d3", "vitamina c", "vitamina d", "multivitamin", "multivitaminico", "probiotic", "probiotico",
  "collagen", "colageno", "omega 3", "omega-3", "magnesium", "magnesio", "zinc", "iron", "hierro", "ferro", "melatonin", "melatonina", "ashwagandha",
  "creatine", "creatina", "whey", "protein", "proteina", "biotin", "biotina", "elderberry", "sauco", "curcumin", "curcuma", "turmeric", "coq10",
  "glucosamine", "glucosamina", "apple cider vinegar", "vinagre de manzana", "fiber", "fibra", "electrolytes", "electrolitos", "caffeine", "cafeina"];

const COUNTRIES: Record<string, { name: string; region: Region }> = {
  spain: { name: "Spain", region: "europe" }, espana: { name: "Spain", region: "europe" }, espanha: { name: "Spain", region: "europe" },
  germany: { name: "Germany", region: "europe" }, alemania: { name: "Germany", region: "europe" }, alemanha: { name: "Germany", region: "europe" },
  italy: { name: "Italy", region: "europe" }, italia: { name: "Italy", region: "europe" },
  france: { name: "France", region: "europe" }, francia: { name: "France", region: "europe" }, franca: { name: "France", region: "europe" },
  portugal: { name: "Portugal", region: "europe" }, netherlands: { name: "Netherlands", region: "europe" }, "paises bajos": { name: "Netherlands", region: "europe" },
  poland: { name: "Poland", region: "europe" }, polonia: { name: "Poland", region: "europe" },
  "united kingdom": { name: "United Kingdom", region: "europe" }, uk: { name: "United Kingdom", region: "europe" }, "reino unido": { name: "United Kingdom", region: "europe" },
  switzerland: { name: "Switzerland", region: "europe" }, suiza: { name: "Switzerland", region: "europe" }, turkey: { name: "Turkey", region: "europe" }, turquia: { name: "Turkey", region: "europe" },
  usa: { name: "United States", region: "north_america" }, us: { name: "United States", region: "north_america" }, "united states": { name: "United States", region: "north_america" },
  "estados unidos": { name: "United States", region: "north_america" }, eeuu: { name: "United States", region: "north_america" }, eua: { name: "United States", region: "north_america" },
  canada: { name: "Canada", region: "north_america" },
  mexico: { name: "Mexico", region: "latin_america" }, colombia: { name: "Colombia", region: "latin_america" }, colombia_: { name: "Colombia", region: "latin_america" },
  brazil: { name: "Brazil", region: "latin_america" }, brasil: { name: "Brazil", region: "latin_america" }, argentina: { name: "Argentina", region: "latin_america" },
  chile: { name: "Chile", region: "latin_america" }, peru: { name: "Peru", region: "latin_america" },
  india: { name: "India", region: "asia" }, china: { name: "China", region: "asia" }, japan: { name: "Japan", region: "asia" }, japon: { name: "Japan", region: "asia" },
  korea: { name: "South Korea", region: "asia" }, corea: { name: "South Korea", region: "asia" },
  uae: { name: "United Arab Emirates", region: "middle_east" }, emirates: { name: "United Arab Emirates", region: "middle_east" }, emiratos: { name: "United Arab Emirates", region: "middle_east" },
  "saudi arabia": { name: "Saudi Arabia", region: "middle_east" }, "arabia saudi": { name: "Saudi Arabia", region: "middle_east" },
  "south africa": { name: "South Africa", region: "africa" }, sudafrica: { name: "South Africa", region: "africa" },
  australia: { name: "Australia", region: "oceania" },
};
const REGIONS: [Region, RegExp][] = [
  ["europe", /\b(europe|european|eu|europa|europeo|europeu|ue)\b/],
  ["north_america", /\b(north america|norteamerica|america do norte)\b/],
  ["latin_america", /\b(latin america|latam|latinoamerica|america latina)\b/],
  ["asia", /\b(asia)\b/],
];

const CERTS: [string, RegExp][] = [
  ["GMP", /\b(c?gmp|bpm|bpf|good manufacturing|buenas practicas)\b/],
  ["FDA-registered facility", /\bfda\b/],
  ["ISO 22000 / FSSC 22000", /\b(iso ?22000|fssc)\b/],
  ["Organic", /\b(organic|organico|ecologico|bio)\b/],
  ["Halal", /\bhalal\b/], ["Kosher", /\bkosher\b/],
  ["Vegan", /\b(vegan|vegan[oa]s?)\b/],
  ["NSF", /\bnsf\b/],
];

const SERVICES: [string, RegExp][] = [
  ["private_label", /\b(private ?label|white ?label|marca blanca|marca propia|marca propria|maquila)\b/],
  ["formulation", /\b(formulat\w*|formula(cion|cao)?|develop\w*|desarroll\w*|desenvolv\w*)\b/],
  ["packaging", /\b(packag\w*|envas\w*|embala\w*|blister)\b/],
  ["export", /\b(export\w*|exporta\w*)\b/],
];

const UNIT_WORDS: [Parsed["quantityUnit"], RegExp][] = [
  ["bottles", /^(bottles?|frascos?|botes?|potes?)/], ["boxes", /^(boxes|cajas?|caixas?)/], ["kg", /^(kg|kilos?)/],
  ["sachets", /^(sachets?|sobres?|saches?|sticks?)/], ["capsules", /^(capsules?|capsulas?)/], ["tablets", /^(tablets?|comprimidos?|tabletas?)/],
  ["units", /^(units?|unidades?|pcs|pieces?|piezas?)/],
];

function parseNumber(raw: string, mult?: string): number | undefined {
  const s = raw.replace(/\s/g, "");
  let n: number;
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) n = Number(s.replace(/[.,]/g, ""));
  else n = Number(s.replace(",", "."));
  if (!Number.isFinite(n)) return undefined;
  const m = (mult ?? "").toLowerCase();
  if (/^(k|mil)$/.test(m)) n *= 1000;
  if (/^(m|million|millones?|milhoes|millon)$/.test(m)) n *= 1_000_000;
  return Math.round(n);
}

export function parseNeed(text: string): Parsed {
  const t = norm(text);
  const out: Parsed = { ingredients: [], certifications: [], lowMoq: false, services: [], matched: [] };
  const hit = (field: string, re: RegExp) => { const m = t.match(re); if (m) out.matched.push({ field, text: m[0] }); return !!m; };

  for (const [k, re] of FORMS) if (hit("dosageForm", re)) { out.dosageForm = k; break; }
  for (const [k, re] of TYPES) if (hit("productType", re)) { out.productType = k; break; }
  if (!out.productType && out.dosageForm && ["gummies", "softgels"].includes(out.dosageForm)) out.productType = "supplement";
  for (const ing of INGREDIENTS) {
    const key = ing.replace(/[- ]/g, "");
    if (new RegExp(`\\b${ing.replace(/[- ]/g, "[- ]?")}\\b`).test(t) && !out.ingredients.some((x) => x.replace(/[- ]/g, "") === key)) out.ingredients.push(ing);
  }

  const q = t.match(/(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)(?:\s*(k|mil|million|millones|millon|milhoes|m)\b)?((?:\s+[a-z0-9-]+){0,4})/);
  if (q) {
    const n = parseNumber(q[1], q[2]);
    if (n && n >= 10) {
      out.quantity = n;
      const words = q[3].trim().split(/\s+/);
      for (const w of words) { for (const [u, re] of UNIT_WORDS) if (re.test(w)) { out.quantityUnit = u; break; } if (out.quantityUnit) break; }
      out.quantityUnit ??= "units";
      out.matched.push({ field: "quantity", text: `${q[1]}${q[2] ? " " + q[2] : ""}` });
    }
  }

  // «fabricado en Europa / made in India» → lugar de fabricación; «para el mercado UK / for the UK market» → mercado
  const makeIn = t.match(/\b(made in|manufactured in|produced in|in|en|em|no|na|fabricad[oa]s? en|fabricad[oa]s? em|from|desde)\s+([a-z ]{2,20}?)(?=[,.;]|\s+(for|para|market|mercado|with|con|com)\b|$)/);
  const forMkt = t.match(/\b(for|para)\s+(the\s+|el\s+|o\s+)?(mercado\s+(de\s+|do\s+)?)?([a-z ]{2,20}?)(\s+market)?(?=[,.;]|$|\s+(with|con|com|in|en|em)\b)/);
  const findPlace = (s?: string) => {
    if (!s) return undefined;
    const k = Object.keys(COUNTRIES).sort((a, b) => b.length - a.length).find((c) => new RegExp(`\\b${c}\\b`).test(s));
    if (k) return { country: COUNTRIES[k] };
    for (const [r, re] of REGIONS) if (re.test(s)) return { region: r };
    return undefined;
  };
  const mk = findPlace(forMkt?.[5]);
  if (mk?.country) { out.targetMarket = mk.country.name; out.matched.push({ field: "targetMarket", text: forMkt![0] }); }
  const mi = findPlace(makeIn?.[2]);
  if (mi && !(mi.country && mi.country.name === out.targetMarket && forMkt)) {
    if (mi.country) { out.manufacturingCountry = mi.country.name; out.manufacturingRegion = mi.country.region; }
    else out.manufacturingRegion = mi.region;
    out.matched.push({ field: "manufacturingLocation", text: makeIn![0] });
  }
  if (!out.manufacturingRegion) for (const [r, re] of REGIONS) if (hit("manufacturingLocation", re)) { out.manufacturingRegion = r; break; }

  for (const [c, re] of CERTS) if (hit("certification", re)) out.certifications.push(c);
  for (const [s, re] of SERVICES) if (hit("service", re)) out.services.push(s);
  if (hit("lowMoq", /\b(low moq|small (batch|run|order)s?|low minimum|bajo moq|moq bajo|pocas unidades|pedido minimo bajo|lotes? pequenos?|baixo moq|lote minimo baixo)\b/)) out.lowMoq = true;
  return out;
}
