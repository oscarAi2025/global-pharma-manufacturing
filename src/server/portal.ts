import "server-only";
import type { Db } from "./db";
import { hashToken } from "./crypto";
import { audit } from "./audit";

export async function manufacturerByToken(db: Db, token: string) {
  const m = (await db.query<Record<string, unknown>>(
    `select m.id, m.internal_name, m.dosage_forms, m.moq_notes from portal_tokens t join manufacturers m on m.id = t.manufacturer_id
      where t.token_hash = $1 and t.kind = 'manufacturer' and t.expires_at > now() and m.deleted_at is null`, [hashToken(token)])).rows[0];
  if (!m) return null;
  // Solo oportunidades aprobadas por el propietario; sin datos del comprador.
  const opps = (await db.query<Record<string, unknown>>(
    `select c.id match_id, r.id request_id, r.ref, r.product_type, r.dosage_form, r.quantity_text, r.market, r.formulation, r.timeline, c.status
       from match_candidates c join manufacturing_requests r on r.id = c.request_id
      where c.manufacturer_id = $1 and c.status in ('approved','contacted','nda_pending','rfq_sent') order by r.created_at desc`, [m.id])).rows;
  return { m, opps };
}

export async function manufacturerQuote(db: Db, token: string, requestId: string, q: { amount: number | null; currency: string; moq: string; lead_time: string; notes: string }) {
  const r = await manufacturerByToken(db, token);
  if (!r || !r.opps.some((o) => o.request_id === requestId)) return false;
  await db.query("insert into quotes (request_id, manufacturer_id, amount, currency, moq, lead_time, notes) values ($1,$2,$3,$4,$5,$6,$7)",
    [requestId, r.m.id, q.amount, q.currency || "USD", q.moq || null, q.lead_time || null, q.notes || null]);
  await db.query("update manufacturing_requests set stage = case when stage in ('rfq_submitted','manufacturer_contacted','nda_pending','manufacturer_matching') then 'quote_received' else stage end, updated_at = now() where id = $1", [requestId]);
  await audit(db, `manufacturer:${r.m.id}`, "quote.submitted", "manufacturing_request", requestId);
  return true;
}

export async function manufacturerCapabilities(db: Db, token: string, forms: string[], moq: string) {
  const r = await manufacturerByToken(db, token);
  if (!r) return false;
  // Lo que declara el fabricante queda como «declarado» hasta que lo verifiquemos.
  await db.query("update manufacturers set dosage_forms = $2, moq_notes = $3, verification = 'declared', updated_at = now() where id = $1", [r.m.id, forms, moq || null]);
  await audit(db, `manufacturer:${r.m.id}`, "manufacturer.self_update", "manufacturer", String(r.m.id));
  return true;
}
