import { isAdmin } from "@/server/auth";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

const Q: Record<string, string> = {
  requests: `select r.ref, r.created_at, r.locale, b.company, b.name, b.email, r.product_type, r.dosage_form, r.quantity_text, r.market,
              r.formulation, r.timeline, r.classification, r.score, r.stage, r.source->>'utm_source' utm_source, r.source->>'landing_page' landing_page
             from manufacturing_requests r join buyers b on b.id = r.buyer_id order by r.created_at desc`,
  commissions: "select manufacturer, description, is_reorder, order_amount, currency, invoiced_at, credited, pct, commission, paid, commission_status from commission_ledger",
};

const cell = (v: unknown) => { const s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export async function GET(_: Request, { params }: { params: Promise<{ kind: string }> }) {
  if (!(await isAdmin())) return new Response("No autorizado", { status: 401 });
  const { kind } = await params;
  if (!Q[kind]) return new Response("No encontrado", { status: 404 });
  const rows = (await (await db()).query<Record<string, unknown>>(Q[kind])).rows;
  const head = rows[0] ? Object.keys(rows[0]) : [];
  const csv = [head.join(","), ...rows.map((r) => head.map((h) => cell(r[h])).join(","))].join("\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${kind}.csv"`, "Cache-Control": "no-store" } });
}
