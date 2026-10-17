import { describe, expect, it } from "vitest";
import { freshDb } from "./helpers/pg";
import { addBuyerMessage, createRequest, requestByToken, requestInput } from "@/server/requests";

describe("solicitudes en base de datos", () => {
  it("crea, cualifica, guarda procedencia y abre el portal solo con el token", async () => {
    const db = await freshDb();
    const input = requestInput.parse({
      locale: "es", product_type: "supplement", dosage_form: "gummies", quantity: "10.000 frascos", market: "España",
      formulation: "own", timeline: "q", details: "Gomitas veganas de vitamina D con GMP", name: "Ana", company: "Marca SL",
      email: "Ana@Marca.es", consent: "yes", utm_source: "google", landing_page: "/es/",
    });
    const r = await createRequest(db, input);
    expect(r.ref).toMatch(/^GPM-[A-Z2-9]{6}$/);
    const row = (await db.query<Record<string, unknown>>("select * from manufacturing_requests where id = $1", [r.id])).rows[0];
    expect(row.classification).toBe("priority");
    expect(row.portal_token_hash).not.toBe(r.token); // solo se guarda el hash
    expect(row.source).toMatchObject({ utm_source: "google", landing_page: "/es/" });
    expect((await requestByToken(db, "token-falso"))).toBeNull();
    const p = await requestByToken(db, r.token);
    expect(p?.request.ref).toBe(r.ref);
    expect(await addBuyerMessage(db, r.token, "Adjunto la fórmula por correo")).toBe(true);
    expect((await requestByToken(db, r.token))?.messages).toHaveLength(1);
    const logs = (await db.query("select action from audit_logs")).rows.map((x) => (x as { action: string }).action);
    expect(logs).toEqual(["request.created", "request.message"]);
    await db.close();
  });
});
