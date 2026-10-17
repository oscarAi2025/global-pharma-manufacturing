import { describe, expect, it } from "vitest";
import { parseNeed } from "@/lib/parse";
import { qualify } from "@/lib/qualify";
import { rankManufacturers, type ManufacturerFacts } from "@/lib/match";

const base = { product_type: "supplement", dosage_form: "gummies", quantity: "10.000 frascos de 60 gomitas", market: "España", formulation: "own", timeline: "q", details: "Gomitas de vitamina D veganas, frasco PET, etiqueta propia. Necesitamos GMP.", company: "Marca SL", email: "ana@marca.es" };

describe("cualificación", () => {
  it("solicitud completa → prioritaria, con motivos", () => {
    const q = qualify(base, parseNeed(`${base.quantity} ${base.details}`));
    expect(q.classification).toBe("priority");
    expect(q.score).toBe(q.reasons.reduce((s, r) => s + r.points, 0));
    expect(q.reasons.map((r) => r.rule)).toContain("business_email");
    expect(q.missing).toContain("manufacturing_location");
  });
  it("sin forma ni cantidad → incompleta y pide los datos", () => {
    const q = qualify({ ...base, dosage_form: "other", quantity: "no sé", details: "", email: "a@gmail.com", formulation: "unsure" }, parseNeed("no sé"));
    expect(q.classification).toBe("incomplete");
    expect(q.missing).toEqual(expect.arrayContaining(["dosage_form", "quantity_number", "formulation"]));
  });
});

const mk = (o: Partial<ManufacturerFacts>): ManufacturerFacts => ({ id: "x", internal_name: "X", country: "Spain", relationship: "public_source", verification: "declared", capacity_confirmed: false, dosage_forms: ["gummies"], services: [], certifications: [], ...o });

describe("emparejamiento", () => {
  it("excluye a quien no trabaja la forma y prioriza acuerdo firmado y verificación", () => {
    const list = [
      mk({ id: "a", internal_name: "Público", relationship: "public_source" }),
      mk({ id: "b", internal_name: "Con comisión", relationship: "commission_agreed", verification: "verified", certifications: [{ name: "GMP", verified: true }] }),
      mk({ id: "c", internal_name: "Sin gomitas", dosage_forms: ["tablets"], relationship: "commission_agreed" }),
    ];
    const r = rankManufacturers({ dosage_form: "gummies", market: "España", manufacturingCountry: "Spain", certifications: ["GMP"], services: [] }, list);
    expect(r.map((x) => x.m.id)).toEqual(["b", "a"]);
    expect(r[1].r.reasons.join(" ")).toMatch(/fuentes públicas/);
  });
});
