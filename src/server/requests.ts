import "server-only";
import { z } from "zod";
import type { Db } from "./db";
import { audit } from "./audit";
import { hashToken, newRef, newToken } from "./crypto";
import { step1Schema, step2Schema, trackingFields } from "@/lib/lead";
import { parseNeed } from "@/lib/parse";
import { qualify } from "@/lib/qualify";

export const requestInput = step1Schema.merge(step2Schema).extend({
  locale: z.enum(["es", "pt", "en"]),
  query: z.string().max(1000).optional().default(""),
  ...Object.fromEntries(trackingFields.map((k) => [k, z.string().max(300).optional().default("")])),
});
export type RequestInput = z.infer<typeof requestInput>;

/** Alta de una solicitud: comprador, solicitud cualificada, token de portal y auditoría. Devuelve el token en claro una sola vez. */
export async function createRequest(db: Db, input: RequestInput) {
  const text = [input.query, input.quantity, input.market, input.details].filter(Boolean).join(". ");
  const parsed = parseNeed(text);
  const q = qualify(input, parsed);
  const token = newToken();
  const buyer = (await db.query<{ id: string }>(
    "insert into buyers (name, company, email, phone, country) values ($1,$2,$3,$4,$5) returning id",
    [input.name, input.company, input.email.toLowerCase(), input.phone || null, input.market],
  )).rows[0];
  const source = Object.fromEntries(trackingFields.map((k) => [k, (input as Record<string, string>)[k] ?? ""]).filter(([, v]) => v));
  let ref = newRef();
  for (let i = 0; i < 3; i++) {
    try {
      const r = (await db.query<{ id: string }>(
        `insert into manufacturing_requests (ref, buyer_id, locale, product_type, dosage_form, quantity_text, quantity_units, market, formulation,
           timeline, details, query_text, extracted, missing, score, score_reasons, classification, stage, consent_at, source, portal_token_hash)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18, now(), $19, $20) returning id`,
        [ref, buyer.id, input.locale, input.product_type, input.dosage_form, input.quantity, q.quantityUnits ?? null, input.market, input.formulation,
          input.timeline, input.details, input.query, JSON.stringify(parsed), q.missing, q.score, JSON.stringify(q.reasons), q.classification,
          q.classification === "incomplete" || q.classification === "contact_needed" ? "needs_qualification" : "lead_received",
          JSON.stringify(source), hashToken(token)],
      )).rows[0];
      await db.query("insert into portal_tokens (token_hash, kind, request_id, expires_at) values ($1,'buyer',$2, now() + interval '180 days')", [hashToken(token), r.id]);
      await audit(db, "buyer", "request.created", "manufacturing_request", r.id, { ref, classification: q.classification, score: q.score });
      return { id: r.id, ref, token, qualification: q, parsed };
    } catch (e) {
      if (String(e).includes("duplicate key") && String(e).includes("ref")) { ref = newRef(); continue; }
      throw e;
    }
  }
  throw new Error("No se pudo generar una referencia única");
}

export async function requestByToken(db: Db, token: string) {
  const r = await db.query<Record<string, unknown>>(
    `select r.id, r.ref, r.locale, r.product_type, r.dosage_form, r.quantity_text, r.market, r.formulation, r.timeline, r.details,
            r.missing, r.stage, r.created_at, b.name, b.company
       from portal_tokens t join manufacturing_requests r on r.id = t.request_id join buyers b on b.id = r.buyer_id
      where t.token_hash = $1 and t.kind = 'buyer' and t.expires_at > now()`, [hashToken(token)]);
  if (!r.rows[0]) return null;
  const quotes = await db.query<Record<string, unknown>>(
    "select id, amount, currency, moq, lead_time, valid_until, buyer_summary, status from quotes where request_id = $1 and status in ('presented','accepted') order by created_at", [r.rows[0].id]);
  const messages = await db.query<Record<string, unknown>>(
    "select body, created_at from request_notes where request_id = $1 and kind = 'buyer_message' order by created_at", [r.rows[0].id]);
  return { request: r.rows[0], quotes: quotes.rows, messages: messages.rows };
}

export async function addBuyerMessage(db: Db, token: string, body: string) {
  const r = await db.query<{ id: string }>("select request_id as id from portal_tokens where token_hash = $1 and kind = 'buyer' and expires_at > now()", [hashToken(token)]);
  if (!r.rows[0]) return false;
  await db.query("insert into request_notes (request_id, kind, body) values ($1,'buyer_message',$2)", [r.rows[0].id, body.slice(0, 4000)]);
  await db.query("update manufacturing_requests set updated_at = now() where id = $1", [r.rows[0].id]);
  await audit(db, "buyer", "request.message", "manufacturing_request", r.rows[0].id);
  return true;
}
