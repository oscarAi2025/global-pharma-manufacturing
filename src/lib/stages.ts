/** Etapas del pipeline comercial (mismo orden que la restricción de la base de datos). */
export const stages = ["lead_received","needs_qualification","qualified","manufacturer_matching","manufacturer_contacted","nda_pending","rfq_submitted",
  "quote_received","quote_presented","negotiation","contract_signed","production_initiated","order_invoiced","commission_due","commission_paid","lost"] as const;
