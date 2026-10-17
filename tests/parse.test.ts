import { describe, expect, it } from "vitest";
import { parseNeed } from "@/lib/parse";

describe("buscador en lenguaje natural", () => {
  it("ejemplos del encargo (EN)", () => {
    const a = parseNeed("I need 100,000 bottles of vitamin gummies manufactured in Europe.");
    expect(a).toMatchObject({ dosageForm: "gummies", productType: "supplement", quantity: 100000, quantityUnit: "bottles", manufacturingRegion: "europe" });
    const b = parseNeed("Looking for a GMP tablet manufacturer for export.");
    expect(b.dosageForm).toBe("tablets");
    expect(b.certifications).toContain("GMP");
    expect(b.services).toContain("export");
    const c = parseNeed("Private label supplements with low minimum order quantities.");
    expect(c).toMatchObject({ productType: "supplement", lowMoq: true });
    expect(c.services).toContain("private_label");
    const d = parseNeed("I want to manufacture 50,000 probiotic supplement bottles for the UK market.");
    expect(d).toMatchObject({ productType: "supplement", quantity: 50000, quantityUnit: "bottles", targetMarket: "United Kingdom" });
    expect(d.manufacturingRegion).toBeUndefined();
    expect(d.dosageForm).toBeUndefined(); // no lo dice: se preguntará
  });
  it("español y portugués", () => {
    const e = parseNeed("Necesito 5.000 frascos de gomitas de colágeno veganas para México");
    expect(e).toMatchObject({ dosageForm: "gummies", quantity: 5000, quantityUnit: "bottles", targetMarket: "Mexico" });
    expect(e.ingredients).toContain("colageno");
    expect(e.certifications).toContain("Vegan");
    const f = parseNeed("Quero fabricar 20 mil sachês de creatina no Brasil, marca própria");
    expect(f).toMatchObject({ dosageForm: "powders", quantity: 20000, quantityUnit: "sachets" });
    expect(f.services).toContain("private_label");
    const g = parseNeed("Fabricante de cápsulas blandas de omega 3 en España con bajo MOQ");
    expect(g).toMatchObject({ dosageForm: "softgels", manufacturingCountry: "Spain", manufacturingRegion: "europe", lowMoq: true });
  });
  it("no inventa: texto vacío o sin datos", () => {
    const h = parseNeed("hola, información por favor");
    expect(h.dosageForm).toBeUndefined();
    expect(h.quantity).toBeUndefined();
    expect(h.matched).toEqual([]);
  });
});
