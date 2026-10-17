import "server-only";
import { db, dbConfigured } from "./db";

export interface PublicManufacturer {
  code: string; country: string; forms: string[]; services: string[]; certifications: { name: string; verified: boolean }[];
  moq: string | null; summary: string; capacity: boolean; verified: boolean; agreement: boolean;
}

/** Solo fabricantes asociados o con comisión pactada que tengan resumen público. Nunca nombre, web ni contacto. */
export async function publicManufacturers(): Promise<PublicManufacturer[]> {
  if (!dbConfigured()) return [];
  try {
    const rows = (await (await db()).query<Record<string, unknown>>(
      `select id, country, dosage_forms, services, certifications, moq_notes, public_summary, capacity_confirmed, verification, relationship
         from manufacturers where deleted_at is null and relationship in ('partner','commission_agreed') and coalesce(public_summary,'') <> ''
        order by (relationship = 'commission_agreed') desc, (verification = 'verified') desc, created_at`)).rows;
    return rows.map((r, i) => ({
      code: `M-${String(i + 1).padStart(3, "0")}`, country: String(r.country), forms: r.dosage_forms as string[], services: r.services as string[],
      certifications: ((r.certifications as { name: string; verified?: boolean }[]) ?? []).map((c) => ({ name: c.name, verified: Boolean(c.verified) })),
      moq: (r.moq_notes as string) || null, summary: String(r.public_summary), capacity: Boolean(r.capacity_confirmed),
      verified: r.verification === "verified", agreement: r.relationship === "commission_agreed",
    }));
  } catch (e) {
    console.error("publicManufacturers", e);
    return [];
  }
}
