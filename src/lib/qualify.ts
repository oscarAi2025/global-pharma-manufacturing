/**
 * Cualificación explicable de solicitudes. Reglas y pesos configurables; la puntuación es un orden de
 * prioridad interno, NO una probabilidad de cierre, y cada punto lleva su motivo.
 */
import type { Parsed } from "./parse";

export interface RequestFacts {
  product_type: string;
  dosage_form: string;
  quantity: string;
  market: string;
  formulation: string;
  timeline: string;
  details: string;
  company: string;
  email: string;
}

export const rules = {
  dosageKnown: 15, quantityNumeric: 15, quantityLarge: 10, quantityMedium: 5, largeUnits: 5000, mediumUnits: 1000,
  marketKnown: 10, formulationKnown: 10, timelineSoon: 10, timelineMid: 5, businessEmail: 10, detailed: 5,
  certifications: 5, focusSupplement: 10, focusPharma: 5,
  priorityAt: 70, qualifiedAt: 50,
} as const;

const FREE_MAIL = /@(gmail|hotmail|outlook|live|yahoo|icloud|aol|proton(mail)?|gmx|yandex|mail)\./i;

export type MissingKey = "dosage_form" | "quantity_number" | "formulation" | "packaging" | "certifications" | "manufacturing_location";
export type Classification = "incomplete" | "pending_validation" | "qualified" | "priority" | "not_viable" | "contact_needed";

export interface Qualification {
  score: number;
  reasons: { rule: string; points: number }[];
  missing: MissingKey[];
  classification: Classification;
  quantityUnits?: number;
}

export function qualify(f: RequestFacts, parsed: Parsed): Qualification {
  const reasons: Qualification["reasons"] = [];
  const add = (rule: string, points: number) => { if (points) reasons.push({ rule, points }); };
  const missing: MissingKey[] = [];

  const dosageKnown = f.dosage_form !== "other" || Boolean(parsed.dosageForm);
  if (dosageKnown) add("dosage_form_known", rules.dosageKnown); else missing.push("dosage_form");

  const units = parsed.quantity;
  if (units) {
    add("quantity_numeric", rules.quantityNumeric);
    if (units >= rules.largeUnits) add("quantity_large", rules.quantityLarge);
    else if (units >= rules.mediumUnits) add("quantity_medium", rules.quantityMedium);
  } else missing.push("quantity_number");

  if (f.market.trim()) add("market_known", rules.marketKnown);
  if (f.formulation !== "unsure") add("formulation_known", rules.formulationKnown); else missing.push("formulation");
  if (f.timeline === "asap" || f.timeline === "q") add("timeline_soon", rules.timelineSoon);
  else if (f.timeline === "h") add("timeline_mid", rules.timelineMid);
  if (!FREE_MAIL.test(f.email)) add("business_email", rules.businessEmail);
  if (f.details.trim().length >= 40) add("detailed_request", rules.detailed);
  if (parsed.certifications.length) add("certifications_stated", rules.certifications); else missing.push("certifications");
  if (!parsed.quantityUnit || parsed.quantityUnit === "units") missing.push("packaging");
  if (!parsed.manufacturingRegion && !parsed.manufacturingCountry) missing.push("manufacturing_location");
  if (f.product_type === "supplement") add("focus_supplement", rules.focusSupplement);
  else if (f.product_type === "pharma") add("focus_pharma", rules.focusPharma);

  const score = Math.min(100, reasons.reduce((s, r) => s + r.points, 0));
  let classification: Classification;
  if (!dosageKnown && !units) classification = "incomplete";
  else if (score >= rules.priorityAt) classification = "priority";
  else if (score >= rules.qualifiedAt) classification = "qualified";
  else if (missing.length >= 4) classification = "contact_needed";
  else classification = "pending_validation";
  return { score, reasons, missing, classification, quantityUnits: units };
}
