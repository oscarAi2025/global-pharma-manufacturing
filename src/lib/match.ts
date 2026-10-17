/**
 * Emparejamiento solicitud → fabricantes por atributos documentados. Solo sugiere: el propietario aprueba
 * qué fabricantes reciben la oportunidad. Un fabricante sin la forma farmacéutica requerida no se sugiere.
 */
export interface ManufacturerFacts {
  id: string;
  internal_name: string;
  country: string;
  relationship: "public_source" | "contacted" | "partner" | "commission_agreed";
  verification: "declared" | "verified";
  capacity_confirmed: boolean;
  dosage_forms: string[];
  services: string[];
  certifications: { name: string; verified?: boolean }[];
  deleted_at?: string | null;
}

export interface MatchInput {
  dosage_form: string;
  market: string;
  manufacturingCountry?: string;
  manufacturingRegion?: string;
  certifications: string[];
  services: string[];
}

const REGION_OF: Record<string, string> = {
  Spain: "europe", Germany: "europe", Italy: "europe", France: "europe", Portugal: "europe", Netherlands: "europe", Poland: "europe",
  "United Kingdom": "europe", Switzerland: "europe", Turkey: "europe", "United States": "north_america", Canada: "north_america",
  Mexico: "latin_america", Colombia: "latin_america", Brazil: "latin_america", Argentina: "latin_america", Chile: "latin_america", Peru: "latin_america",
  India: "asia", China: "asia", Japan: "asia", "South Korea": "asia",
};

export function scoreMatch(req: MatchInput, m: ManufacturerFacts): { score: number; reasons: string[] } | null {
  if (m.deleted_at) return null;
  if (req.dosage_form !== "other" && !m.dosage_forms.includes(req.dosage_form)) return null;
  const reasons: string[] = [];
  let score = 0;
  if (req.dosage_form !== "other") { score += 40; reasons.push(`Trabaja la forma requerida (${req.dosage_form})`); }
  if (m.relationship === "commission_agreed") { score += 20; reasons.push("Acuerdo de comisión firmado"); }
  else if (m.relationship === "partner") { score += 10; reasons.push("Fabricante asociado (sin comisión pactada)"); }
  else if (m.relationship === "public_source") reasons.push("Solo identificado en fuentes públicas: contactar antes de proponerlo");
  if (m.verification === "verified") { score += 10; reasons.push("Datos verificados por el equipo"); }
  if (m.capacity_confirmed) { score += 10; reasons.push("Capacidad disponible confirmada"); }
  const country = req.manufacturingCountry;
  const region = req.manufacturingRegion;
  if (country && m.country === country) { score += 10; reasons.push(`Fabrica en ${country}`); }
  else if (region && REGION_OF[m.country] === region) { score += 7; reasons.push(`Fabrica en la región solicitada (${region})`); }
  const names = m.certifications.filter((c) => c.verified).map((c) => c.name.toLowerCase());
  const wanted = req.certifications.map((c) => c.toLowerCase());
  const covered = wanted.filter((w) => names.some((n) => n.includes(w.split(" ")[0])));
  if (wanted.length && covered.length === wanted.length) { score += 10; reasons.push(`Certificaciones verificadas: ${covered.join(", ")}`); }
  else if (covered.length) { score += 5; reasons.push(`Cubre parte de las certificaciones: ${covered.join(", ")}`); }
  const svc = req.services.filter((s) => m.services.includes(s));
  if (svc.length) { score += 5; reasons.push(`Servicios: ${svc.join(", ")}`); }
  return { score, reasons };
}

export function rankManufacturers(req: MatchInput, list: ManufacturerFacts[]) {
  return list
    .map((m) => ({ m, r: scoreMatch(req, m) }))
    .filter((x): x is { m: ManufacturerFacts; r: { score: number; reasons: string[] } } => x.r !== null)
    .sort((a, b) => b.r.score - a.r.score);
}
