import { describe, expect, it } from "vitest";
import { attributionFrom, encodeForm, step1Schema, step2Schema, validate } from "@/lib/lead";

describe("validación de la solicitud", () => {
  it("paso 1: exige forma, cantidad y mercado", () => {
    expect(validate(step1Schema, { product_type: "supplement", dosage_form: "", quantity: " ", market: "" }))
      .toEqual({ dosage_form: "required", quantity: "required", market: "required" });
    expect(validate(step1Schema, { product_type: "supplement", dosage_form: "gummies", quantity: "5.000 frascos", market: "México" })).toEqual({});
  });
  it("paso 2: correo válido y consentimiento", () => {
    const base = { formulation: "own", timeline: "q", name: "Ana", company: "Marca SL", email: "ana@marca.es", consent: "yes" };
    expect(validate(step2Schema, base)).toEqual({});
    expect(validate(step2Schema, { ...base, email: "ana@" })).toEqual({ email: "invalidEmail" });
    expect(validate(step2Schema, { ...base, consent: "" })).toEqual({ consent: "required" });
  });
  it("atribución: UTM, página de entrada y referente", () => {
    expect(attributionFrom("?utm_source=google&utm_campaign=mx&x=1", "/es/", "https://www.google.com/"))
      .toEqual({ utm_source: "google", utm_campaign: "mx", landing_page: "/es/", referrer: "https://www.google.com/" });
  });
  it("codifica como formulario", () => {
    expect(encodeForm({ "form-name": "solicitud", market: "España" })).toBe("form-name=solicitud&market=Espa%C3%B1a");
  });
});
