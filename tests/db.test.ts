import { describe, expect, it } from "vitest";
import { freshDb } from "./helpers/pg";

describe("migraciones", () => {
  it("se aplican y el libro de comisiones separa estimado, devengado y cobrado", async () => {
    const db = await freshDb();
    const m = (await db.query<{ id: string }>("insert into manufacturers (internal_name, country) values ('Fab A','ES') returning id")).rows[0].id;
    const a = (await db.query<{ id: string }>("insert into commission_agreements (manufacturer_id, pct, status) values ($1, 3, 'signed') returning id", [m])).rows[0].id;
    const o1 = (await db.query<{ id: string }>("insert into orders (manufacturer_id, agreement_id, description, amount) values ($1,$2,'Primer pedido',10000) returning id", [m, a])).rows[0].id;
    const o2 = (await db.query<{ id: string }>("insert into orders (manufacturer_id, agreement_id, description, amount, credited) values ($1,$2,'Recompra',5000,true) returning id", [m, a])).rows[0].id;
    const o3 = (await db.query<{ id: string }>("insert into orders (manufacturer_id, description, amount, credited) values ($1,'Sin acuerdo',8000,true) returning id", [m])).rows[0].id;
    let L = Object.fromEntries((await db.query<{ order_id: string; commission: string; commission_status: string }>("select order_id, commission, commission_status from commission_ledger")).rows.map((r) => [r.order_id, r]));
    expect(L[o1].commission_status).toBe("estimated");
    expect(Number(L[o1].commission)).toBe(300);
    expect(L[o2].commission_status).toBe("accrued");
    expect(L[o3].commission_status).toBe("no_agreement");
    await db.query("insert into payments_received (manufacturer_id, order_id, amount, received_at) values ($1,$2,150,'2026-10-17')", [m, o2]);
    L = Object.fromEntries((await db.query<{ order_id: string; commission: string; commission_status: string }>("select order_id, commission, commission_status from commission_ledger")).rows.map((r) => [r.order_id, r]));
    expect(L[o2].commission_status).toBe("paid");
    await db.close();
  });
});
