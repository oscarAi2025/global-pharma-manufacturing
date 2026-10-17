export const STAGE_ES: Record<string, string> = {
  lead_received: "Recibida", needs_qualification: "Por cualificar", qualified: "Cualificada", manufacturer_matching: "Buscando fabricante",
  manufacturer_contacted: "Fabricante contactado", nda_pending: "NDA pendiente", rfq_submitted: "RFQ enviada", quote_received: "Cotización recibida",
  quote_presented: "Cotización presentada", negotiation: "Negociación", contract_signed: "Contrato firmado", production_initiated: "Producción iniciada",
  order_invoiced: "Pedido facturado", commission_due: "Comisión pendiente", commission_paid: "Comisión cobrada", lost: "Perdida",
};
export const CLASS_ES: Record<string, string> = {
  incomplete: "Incompleta", pending_validation: "Pendiente de validar", qualified: "Cualificada", priority: "Prioritaria", not_viable: "No viable", contact_needed: "Hay que contactar",
};
export const REL_ES: Record<string, string> = { public_source: "Fuente pública", contacted: "Contactado", partner: "Asociado", commission_agreed: "Comisión pactada" };
export const RULE_ES: Record<string, string> = {
  dosage_form_known: "Forma conocida", quantity_numeric: "Cantidad numérica", quantity_large: "Volumen alto", quantity_medium: "Volumen medio",
  market_known: "Mercado indicado", formulation_known: "Fórmula definida", timeline_soon: "Plazo cercano", timeline_mid: "Plazo medio",
  business_email: "Correo de empresa", detailed_request: "Solicitud detallada", certifications_stated: "Certificaciones indicadas",
  focus_supplement: "Suplemento (foco)", focus_pharma: "Farmacéutico",
};
export const MISSING_ES: Record<string, string> = {
  dosage_form: "Forma farmacéutica", quantity_number: "Cantidad en unidades", formulation: "Estado de la fórmula", packaging: "Presentación y envase",
  certifications: "Certificaciones requeridas", manufacturing_location: "Dónde quiere fabricar",
};
export const FORMS = ["capsules", "tablets", "softgels", "gummies", "powders", "liquids", "topicals", "other"];
export const SERVICES = ["private_label", "formulation", "packaging", "export"];

export const money = (n: unknown, c = "USD") => n == null || n === "" ? "—" : Number(n).toLocaleString("es-ES", { style: "currency", currency: String(c) });
export const date = (d: unknown) => d ? new Date(String(d)).toLocaleDateString("es-ES") : "—";

export function Badge({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "good" | "warn" }) {
  const cls = tone === "good" ? "border-teal bg-[#dcefeb]" : tone === "warn" ? "border-amber bg-[#f6e6c4]" : "border-rule bg-paper";
  return <span className={`inline-block rounded-[3px] border px-2 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

export function Field({ label, name, defaultValue, type = "text", required, placeholder }: { label: string; name: string; defaultValue?: unknown; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm"><span className="font-semibold text-muted">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue == null ? "" : String(defaultValue)} required={required} placeholder={placeholder} step={type === "number" ? "any" : undefined}
        className="mt-1 block w-full rounded-[2px] border border-rule bg-sheet px-2 py-1.5" />
    </label>
  );
}
