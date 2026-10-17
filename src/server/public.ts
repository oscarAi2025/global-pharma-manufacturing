import "server-only";
import { db, dbConfigured } from "./db";
import { publicSources } from "@/content/public-sources";

export interface PublicManufacturer {
  origin: "partner" | "public";
  source?: { name: string; url: string; retrieved: string };
  areas?: string[];
  validUntil?: string;
  code: string; country: string; forms: string[]; services: string[]; certifications: { name: string; verified: boolean }[];
  moq: string | null; summary: string; capacity: boolean; verified: boolean; agreement: boolean;
}

/** Solo fabricantes asociados o con comisión pactada que tengan resumen público. Nunca nombre, web ni contacto. */
export async function publicManufacturers(): Promise<PublicManufacturer[]> {
  if (!dbConfigured()) return publicSourceManufacturers();
  try {
    const rows = (await (await db()).query<Record<string, unknown>>(
      `select id, country, dosage_forms, services, certifications, moq_notes, public_summary, capacity_confirmed, verification, relationship
         from manufacturers where deleted_at is null and relationship in ('partner','commission_agreed') and coalesce(public_summary,'') <> ''
        order by (relationship = 'commission_agreed') desc, (verification = 'verified') desc, created_at`)).rows;
    return rows.map((r, i) => ({
      origin: "partner" as const,
      code: `M-${String(i + 1).padStart(3, "0")}`, country: String(r.country), forms: r.dosage_forms as string[], services: r.services as string[],
      certifications: ((r.certifications as { name: string; verified?: boolean }[]) ?? []).map((c) => ({ name: c.name, verified: Boolean(c.verified) })),
      moq: (r.moq_notes as string) || null, summary: String(r.public_summary), capacity: Boolean(r.capacity_confirmed),
      verified: r.verification === "verified", agreement: r.relationship === "commission_agreed",
    })).concat(publicSourceManufacturers() as never[]);
  } catch (e) {
    console.error("publicManufacturers", e);
    return publicSourceManufacturers();
  }
}

/** Fabricantes de registros oficiales, anonimizados (sin nombre ni contacto). */
export function publicSourceManufacturers(): PublicManufacturer[] {
  let n = 0;
  return publicSources.flatMap((f) => f.items.map((it) => ({
    origin: "public" as const, source: { name: f.source.name, url: f.source.url, retrieved: f.source.retrieved },
    code: `P-${String(++n).padStart(3, "0")}`, country: it.country, forms: it.forms, services: [],
    certifications: it.certificate ? [{ name: it.certificate, verified: true }] : [], moq: null,
    summary: [it.city, it.region].filter(Boolean).join(", "), capacity: false, verified: true, agreement: false,
    areas: it.areas, validUntil: it.validUntil,
  })));
}
