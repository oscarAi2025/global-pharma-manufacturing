"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "./db";
import { audit } from "./audit";
import { checkPassword, endSession, requireAdmin, startSession } from "./auth";
import { hashToken, newToken } from "./crypto";
import { stages } from "@/lib/stages";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const list = (f: FormData, k: string) => f.getAll(k).map(String).filter(Boolean);
const num = (f: FormData, k: string) => { const v = str(f, k).replace(",", "."); return v ? Number(v) : null; };

export async function login(_: unknown, f: FormData) {
  if (!checkPassword(str(f, "password"))) return { error: "Contraseña incorrecta." };
  await startSession();
  redirect("/admin/");
}
export async function logout() { await endSession(); redirect("/admin/login/"); }


export async function setStage(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), stage = z.enum(stages).parse(str(f, "stage"));
  const d = await db();
  await d.query("update manufacturing_requests set stage = $2, updated_at = now() where id = $1", [id, stage]);
  await audit(d, "admin", "request.stage", "manufacturing_request", id, { stage });
  revalidatePath(`/admin/requests/${id}/`);
}

export async function addNote(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"); const body = str(f, "body"); if (!body) return;
  const kind = str(f, "kind") === "task" ? "task" : "note";
  const d = await db();
  await d.query("insert into request_notes (request_id, kind, body, due_at) values ($1,$2,$3,$4)", [id, kind, body, str(f, "due_at") || null]);
  revalidatePath(`/admin/requests/${id}/`);
}

export async function toggleTask(f: FormData) {
  await requireAdmin();
  const d = await db();
  await d.query("update request_notes set done = not done where id = $1", [str(f, "note_id")]);
  revalidatePath(`/admin/requests/${str(f, "id")}/`);
}

export async function approveMatch(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), m = str(f, "manufacturer_id");
  const d = await db();
  await d.query(`insert into match_candidates (request_id, manufacturer_id, status, score, reasons, approved_at)
     values ($1,$2,'approved',$3,$4, now()) on conflict (request_id, manufacturer_id) do update set status = 'approved', approved_at = now()`,
    [id, m, Number(str(f, "score")) || 0, str(f, "reasons") || "[]"]);
  await audit(d, "admin", "match.approved", "manufacturing_request", id, { manufacturer_id: m });
  revalidatePath(`/admin/requests/${id}/`);
}

export async function setMatchStatus(f: FormData) {
  await requireAdmin();
  const status = z.enum(["approved","contacted","nda_pending","rfq_sent","declined"]).parse(str(f, "status"));
  const d = await db();
  await d.query("update match_candidates set status = $2 where id = $1", [str(f, "match_id"), status]);
  revalidatePath(`/admin/requests/${str(f, "id")}/`);
}

export async function addQuote(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"); const d = await db();
  await d.query(`insert into quotes (request_id, manufacturer_id, amount, currency, moq, lead_time, valid_until, buyer_summary, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, str(f, "manufacturer_id"), num(f, "amount"), str(f, "currency") || "USD", str(f, "moq") || null, str(f, "lead_time") || null,
      str(f, "valid_until") || null, str(f, "buyer_summary") || null, str(f, "notes") || null]);
  await audit(d, "admin", "quote.added", "manufacturing_request", id);
  revalidatePath(`/admin/requests/${id}/`);
}

export async function setQuoteStatus(f: FormData) {
  await requireAdmin();
  const status = z.enum(["received","presented","accepted","rejected"]).parse(str(f, "status"));
  const d = await db();
  await d.query("update quotes set status = $2 where id = $1", [str(f, "quote_id"), status]);
  await audit(d, "admin", "quote.status", "quote", str(f, "quote_id"), { status });
  revalidatePath(`/admin/requests/${str(f, "id")}/`);
}

export async function addOrder(f: FormData) {
  await requireAdmin();
  const d = await db();
  const mId = str(f, "manufacturer_id");
  const agreement = (await d.query<{ id: string }>("select id from commission_agreements where manufacturer_id = $1 and status = 'signed' order by signed_at desc nulls last limit 1", [mId])).rows[0];
  const reqId = str(f, "request_id") || null;
  const buyer = reqId ? (await d.query<{ buyer_id: string }>("select buyer_id from manufacturing_requests where id = $1", [reqId])).rows[0]?.buyer_id : null;
  await d.query(`insert into orders (request_id, manufacturer_id, agreement_id, buyer_id, description, is_reorder, invoice_ref, amount, currency, invoiced_at, credited)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [reqId, mId, agreement?.id ?? null, buyer ?? null, str(f, "description"), f.get("is_reorder") === "on", str(f, "invoice_ref") || null,
      num(f, "amount") ?? 0, str(f, "currency") || "USD", str(f, "invoiced_at") || null, f.get("credited") === "on"]);
  await audit(d, "admin", "order.added", "order", null, { request_id: reqId, manufacturer_id: mId });
  revalidatePath("/admin/commissions/");
  if (reqId) revalidatePath(`/admin/requests/${reqId}/`);
}

export async function setOrderCredited(f: FormData) {
  await requireAdmin();
  const d = await db();
  await d.query("update orders set credited = true, invoiced_at = coalesce(invoiced_at, current_date) where id = $1", [str(f, "order_id")]);
  await audit(d, "admin", "order.credited", "order", str(f, "order_id"));
  revalidatePath("/admin/commissions/");
}

export async function addPayment(f: FormData) {
  await requireAdmin();
  const d = await db();
  await d.query("insert into payments_received (manufacturer_id, order_id, amount, currency, received_at, reference) values ($1,$2,$3,$4,$5,$6)",
    [str(f, "manufacturer_id"), str(f, "order_id") || null, num(f, "amount"), str(f, "currency") || "USD", str(f, "received_at"), str(f, "reference") || null]);
  await audit(d, "admin", "payment.added", "payment", null, { manufacturer_id: str(f, "manufacturer_id") });
  revalidatePath("/admin/commissions/");
}

const manufacturerSchema = z.object({
  internal_name: z.string().min(2), legal_name: z.string().optional(), country: z.string().min(2), city: z.string().optional(),
  website: z.string().optional(), relationship: z.enum(["public_source","contacted","partner","commission_agreed"]),
  verification: z.enum(["declared","verified"]), public_summary: z.string().optional(), private_notes: z.string().optional(),
  moq_notes: z.string().optional(), contact_name: z.string().optional(), contact_email: z.string().optional(), contact_phone: z.string().optional(),
  source_url: z.string().optional(), last_verified_at: z.string().optional(),
});

export async function saveManufacturer(f: FormData) {
  await requireAdmin();
  const v = manufacturerSchema.parse(Object.fromEntries(Object.keys(manufacturerSchema.shape).map((k) => [k, str(f, k)])));
  const certs = str(f, "certifications").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, evidence, verified] = l.split("|").map((x) => x?.trim());
    return { name, evidence_url: evidence || null, verified: verified === "verificado" };
  });
  const vals = [v.internal_name, v.legal_name || null, v.country, v.city || null, v.website || null, v.relationship, v.verification,
    f.get("capacity_confirmed") === "on", list(f, "dosage_forms"), list(f, "services"), JSON.stringify(certs), v.moq_notes || null,
    v.public_summary || null, v.private_notes || null, v.contact_name || null, v.contact_email || null, v.contact_phone || null,
    v.source_url || null, v.last_verified_at || null];
  const d = await db();
  const id = str(f, "id");
  if (id) {
    await d.query(`update manufacturers set internal_name=$2, legal_name=$3, country=$4, city=$5, website=$6, relationship=$7, verification=$8,
      capacity_confirmed=$9, dosage_forms=$10, services=$11, certifications=$12, moq_notes=$13, public_summary=$14, private_notes=$15,
      contact_name=$16, contact_email=$17, contact_phone=$18, source_url=$19, last_verified_at=$20, updated_at=now() where id=$1`, [id, ...vals]);
    await audit(d, "admin", "manufacturer.updated", "manufacturer", id);
    revalidatePath(`/admin/manufacturers/${id}/`);
    redirect(`/admin/manufacturers/${id}/`);
  }
  const r = (await d.query<{ id: string }>(`insert into manufacturers (internal_name, legal_name, country, city, website, relationship, verification,
      capacity_confirmed, dosage_forms, services, certifications, moq_notes, public_summary, private_notes, contact_name, contact_email, contact_phone,
      source_url, last_verified_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) returning id`, vals)).rows[0];
  await audit(d, "admin", "manufacturer.created", "manufacturer", r.id);
  redirect(`/admin/manufacturers/${r.id}/`);
}

export async function addAgreement(f: FormData) {
  await requireAdmin();
  const id = str(f, "manufacturer_id"); const d = await db();
  await d.query(`insert into commission_agreements (manufacturer_id, pct, basis, recurring_months, covered_operations, status, signed_at, document_ref, notes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [id, num(f, "pct"), str(f, "basis") || "net_invoiced", Number(str(f, "recurring_months") || 24), str(f, "covered_operations"),
      str(f, "status") || "draft", str(f, "signed_at") || null, str(f, "document_ref") || null, str(f, "notes") || null]);
  if (str(f, "status") === "signed") await d.query("update manufacturers set relationship = 'commission_agreed' where id = $1", [id]);
  await audit(d, "admin", "agreement.added", "manufacturer", id, { status: str(f, "status"), pct: num(f, "pct") });
  revalidatePath(`/admin/manufacturers/${id}/`);
}

export async function newManufacturerLink(f: FormData) {
  await requireAdmin();
  const id = str(f, "manufacturer_id"); const token = newToken(); const d = await db();
  await d.query("insert into portal_tokens (token_hash, kind, manufacturer_id, expires_at) values ($1,'manufacturer',$2, now() + interval '30 days')", [hashToken(token), id]);
  await audit(d, "admin", "manufacturer.portal_link", "manufacturer", id);
  redirect(`/admin/manufacturers/${id}/?link=${encodeURIComponent(token)}`);
}
