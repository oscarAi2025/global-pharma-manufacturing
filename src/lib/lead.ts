import { z } from "zod";

export const FORM_NAME = "solicitud";

export const productTypes = ["supplement", "pharma", "cosmetic", "other"] as const;
export const dosageForms = ["capsules", "tablets", "softgels", "gummies", "powders", "liquids", "other"] as const;
export const formulations = ["own", "develop", "catalog", "unsure"] as const;
export const timelines = ["asap", "q", "h", "later"] as const;

/** Campos de cada paso: el paso 1 basta para entender el proyecto; el 2 para responder. */
export const step1Fields = ["product_type", "dosage_form", "quantity", "market"] as const;
export const step2Fields = ["formulation", "timeline", "details", "name", "company", "email", "phone", "consent"] as const;

const req = z.string().trim().min(1, "required");

export const step1Schema = z.object({
  product_type: z.enum(productTypes, { message: "required" }),
  dosage_form: z.enum(dosageForms, { message: "required" }),
  quantity: req.max(200),
  market: req.max(80),
});

export const step2Schema = z.object({
  formulation: z.enum(formulations, { message: "required" }),
  timeline: z.enum(timelines, { message: "required" }),
  details: z.string().max(3000).optional().default(""),
  name: req.max(120),
  company: req.max(160),
  email: z.string().trim().email("invalidEmail").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  consent: z.literal("yes", { message: "required" }),
});

export type FieldErrors = Record<string, "required" | "invalidEmail">;

export function validate(schema: z.ZodTypeAny, data: Record<string, string>): FieldErrors {
  const r = schema.safeParse(data);
  if (r.success) return {};
  const errs: FieldErrors = {};
  for (const i of r.error.issues) {
    const k = String(i.path[0]);
    if (!errs[k]) errs[k] = i.message === "invalidEmail" ? "invalidEmail" : "required";
  }
  return errs;
}

/** Procedencia comercial: se guarda la primera atribución de la visita. */
export const trackingFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "landing_page", "referrer"] as const;

export function attributionFrom(search: string, landing: string, referrer: string): Record<string, string> {
  const q = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const k of trackingFields.slice(0, 5)) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 200);
  }
  out.landing_page = landing.slice(0, 300);
  if (referrer) out.referrer = referrer.slice(0, 300);
  return out;
}

export function encodeForm(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}
