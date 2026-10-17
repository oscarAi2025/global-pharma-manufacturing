import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { rankManufacturers, type ManufacturerFacts } from "@/lib/match";
import type { Parsed } from "@/lib/parse";
import { STAGE_ES, CLASS_ES, RULE_ES, MISSING_ES, REL_ES, Badge, Field, money, date } from "@/components/admin/ui";
import { addNote, addOrder, addQuote, approveMatch, setMatchStatus, setQuoteStatus, setStage, toggleTask } from "@/server/actions";
import { stages } from "@/lib/stages";

export default async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await db();
  const r = (await d.query<Record<string, unknown>>(
    `select r.*, b.name, b.company, b.email, b.phone from manufacturing_requests r join buyers b on b.id = r.buyer_id where r.id = $1`, [id])).rows[0];
  if (!r) notFound();
  const notes = (await d.query<Record<string, string>>("select * from request_notes where request_id = $1 order by created_at desc", [id])).rows;
  const matches = (await d.query<Record<string, string>>(
    "select c.*, m.internal_name, m.relationship from match_candidates c join manufacturers m on m.id = c.manufacturer_id where c.request_id = $1 order by c.score desc", [id])).rows;
  const quotes = (await d.query<Record<string, string>>(
    "select q.*, m.internal_name from quotes q join manufacturers m on m.id = q.manufacturer_id where q.request_id = $1 order by q.created_at", [id])).rows;
  const orders = (await d.query<Record<string, string>>("select * from commission_ledger where request_id = $1", [id])).rows;
  const mans = (await d.query<ManufacturerFacts>("select id, internal_name, country, relationship, verification, capacity_confirmed, dosage_forms, services, certifications, deleted_at from manufacturers where deleted_at is null")).rows;
  const parsed = (r.extracted ?? {}) as Parsed;
  const suggestions = rankManufacturers({
    dosage_form: String(r.dosage_form), market: String(r.market), manufacturingCountry: parsed.manufacturingCountry,
    manufacturingRegion: parsed.manufacturingRegion, certifications: parsed.certifications ?? [], services: parsed.services ?? [],
  }, mans).filter((s) => !matches.some((m) => m.manufacturer_id === s.m.id));
  const reasons = (r.score_reasons ?? []) as { rule: string; points: number }[];
  const missing = (r.missing ?? []) as string[];
  const source = (r.source ?? {}) as Record<string, string>;

  return (
    <div className="grid gap-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <div><h1 className="text-3xl">{String(r.ref)}</h1><p className="text-muted">{String(r.company)} · {String(r.name)} · <a href={`mailto:${r.email}`}>{String(r.email)}</a> {r.phone ? `· ${r.phone}` : ""}</p></div>
        <form action={setStage} className="flex gap-2"><input type="hidden" name="id" value={id} />
          <select name="stage" defaultValue={String(r.stage)} className="border border-rule bg-sheet px-2 py-1.5">{stages.map((s) => <option key={s} value={s}>{STAGE_ES[s]}</option>)}</select>
          <button className="btn !py-1.5">Cambiar etapa</button></form>
      </header>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="sheet p-5 lg:col-span-2">
          <h2 className="text-xl">Solicitud</h2>
          <dl className="mt-3 grid grid-cols-[10rem_1fr] gap-y-1 text-sm">
            {[["Producto", r.product_type], ["Forma", r.dosage_form], ["Cantidad", r.quantity_text], ["Mercado", r.market], ["Fórmula", r.formulation], ["Plazo", r.timeline], ["Idioma", r.locale], ["Recibida", date(r.created_at)]]
              .map(([k, v]) => <div key={String(k)} className="contents"><dt className="font-semibold text-muted">{String(k)}</dt><dd>{String(v ?? "—")}</dd></div>)}
          </dl>
          {r.query_text ? <p className="mt-4 text-sm"><span className="font-semibold text-muted">Búsqueda escrita:</span> {String(r.query_text)}</p> : null}
          {r.details ? <p className="mt-2 whitespace-pre-wrap text-sm"><span className="font-semibold text-muted">Detalles:</span> {String(r.details)}</p> : null}
          <p className="mt-4 text-xs text-muted">Procedencia: {Object.entries(source).map(([k, v]) => `${k}=${v}`).join(" · ") || "—"}</p>
        </div>
        <div className="sheet p-5">
          <h2 className="text-xl">Cualificación</h2>
          <p className="mt-2"><Badge tone={r.classification === "priority" ? "good" : r.classification === "incomplete" ? "warn" : "plain"}>{CLASS_ES[String(r.classification)]}</Badge> <strong className="ml-2">{String(r.score)}/100</strong></p>
          <p className="mt-1 text-xs text-muted">Orden de prioridad por reglas; no es una probabilidad de cierre.</p>
          <ul className="mt-3 text-sm">{reasons.map((x) => <li key={x.rule}>+{x.points} {RULE_ES[x.rule] ?? x.rule}</li>)}</ul>
          {missing.length > 0 && <><h3 className="mt-4 text-base">Preguntar al comprador</h3><ul className="mt-1 list-disc pl-5 text-sm">{missing.map((m) => <li key={m}>{MISSING_ES[m] ?? m}</li>)}</ul></>}
        </div>
      </section>

      <section>
        <h2 className="text-xl">Fabricantes</h2>
        <p className="mt-1 text-sm text-muted">Nada se envía a un fabricante sin que lo apruebes aquí.</p>
        {matches.length > 0 && <table className="reg-table mt-3"><thead><tr><th>Fabricante</th><th>Relación</th><th>Puntos</th><th>Estado</th></tr></thead><tbody>
          {matches.map((m) => <tr key={m.id}><td><a href={`/admin/manufacturers/${m.manufacturer_id}/`}>{m.internal_name}</a></td><td>{REL_ES[m.relationship]}</td><td>{m.score}</td>
            <td><form action={setMatchStatus} className="flex gap-2"><input type="hidden" name="id" value={id} /><input type="hidden" name="match_id" value={m.id} />
              <select name="status" defaultValue={m.status} className="border border-rule bg-sheet px-1 py-1 text-sm">{["approved", "contacted", "nda_pending", "rfq_sent", "declined"].map((s) => <option key={s}>{s}</option>)}</select>
              <button className="text-sm underline">Guardar</button></form></td></tr>)}</tbody></table>}
        <h3 className="mt-5 text-base">Sugeridos por el emparejamiento</h3>
        {suggestions.length ? <ul className="mt-2 divide-y divide-rule border-y border-rule">{suggestions.map(({ m, r: s }) => (
          <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
            <div><a href={`/admin/manufacturers/${m.id}/`} className="font-semibold">{m.internal_name}</a> <span className="text-sm text-muted">· {m.country} · {REL_ES[m.relationship]} · {s.score} puntos</span>
              <ul className="mt-1 text-sm text-muted">{s.reasons.map((x) => <li key={x}>— {x}</li>)}</ul></div>
            <form action={approveMatch}><input type="hidden" name="id" value={id} /><input type="hidden" name="manufacturer_id" value={m.id} /><input type="hidden" name="score" value={s.score} />
              <input type="hidden" name="reasons" value={JSON.stringify(s.reasons)} /><button className="btn !py-1.5 !px-3 text-sm">Aprobar</button></form>
          </li>))}</ul> : <p className="mt-2 text-sm text-muted">Ningún fabricante registrado trabaja esta forma. Da de alta fabricantes en la sección Fabricantes.</p>}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl">Cotizaciones</h2>
          {quotes.length > 0 && <table className="reg-table mt-3"><thead><tr><th>Fabricante</th><th>Importe</th><th>MOQ</th><th>Plazo</th><th>Estado</th></tr></thead><tbody>
            {quotes.map((q) => <tr key={q.id}><td>{q.internal_name}</td><td>{money(q.amount, q.currency)}</td><td>{q.moq ?? "—"}</td><td>{q.lead_time ?? "—"}</td>
              <td><form action={setQuoteStatus} className="flex gap-1"><input type="hidden" name="id" value={id} /><input type="hidden" name="quote_id" value={q.id} />
                <select name="status" defaultValue={q.status} className="border border-rule bg-sheet px-1 py-1 text-sm">{["received", "presented", "accepted", "rejected"].map((s) => <option key={s}>{s}</option>)}</select><button className="text-sm underline">OK</button></form></td></tr>)}</tbody></table>}
          <form action={addQuote} className="sheet mt-4 grid gap-3 p-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={id} />
            <label className="block text-sm sm:col-span-2"><span className="font-semibold text-muted">Fabricante</span>
              <select name="manufacturer_id" required className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">{mans.map((m) => <option key={m.id} value={m.id}>{m.internal_name}</option>)}</select></label>
            <Field label="Importe" name="amount" type="number" /><Field label="Moneda" name="currency" defaultValue="USD" />
            <Field label="MOQ" name="moq" /><Field label="Plazo" name="lead_time" />
            <Field label="Válida hasta" name="valid_until" type="date" /><Field label="Resumen para el comprador" name="buyer_summary" />
            <div className="sm:col-span-2"><button className="btn !py-1.5" disabled={!mans.length}>Añadir cotización</button></div>
          </form>
          <p className="mt-2 text-xs text-muted">Solo las cotizaciones en estado «presented» o «accepted» se ven en el portal del comprador, sin el nombre del fabricante.</p>
        </div>
        <div>
          <h2 className="text-xl">Pedidos y comisión</h2>
          {orders.length > 0 && <table className="reg-table mt-3"><thead><tr><th>Pedido</th><th>Importe</th><th>Comisión</th><th>Estado</th></tr></thead><tbody>
            {orders.map((o) => <tr key={o.order_id}><td>{o.description}{o.is_reorder ? " (recompra)" : ""}</td><td>{money(o.order_amount, o.currency)}</td><td>{money(o.commission, o.currency)}</td><td>{o.commission_status}</td></tr>)}</tbody></table>}
          <form action={addOrder} className="sheet mt-4 grid gap-3 p-4 sm:grid-cols-2">
            <input type="hidden" name="request_id" value={id} />
            <label className="block text-sm sm:col-span-2"><span className="font-semibold text-muted">Fabricante</span>
              <select name="manufacturer_id" required className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">{mans.map((m) => <option key={m.id} value={m.id}>{m.internal_name}</option>)}</select></label>
            <Field label="Descripción" name="description" required /><Field label="Importe facturado" name="amount" type="number" required />
            <Field label="Moneda" name="currency" defaultValue="USD" /><Field label="Factura" name="invoice_ref" />
            <Field label="Fecha de factura" name="invoiced_at" type="date" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="credited" /> Venta acreditada</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_reorder" /> Recompra</label>
            <div className="sm:col-span-2"><button className="btn !py-1.5" disabled={!mans.length}>Registrar pedido</button></div>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-xl">Notas, tareas y mensajes</h2>
        <form action={addNote} className="mt-3 flex flex-wrap gap-2">
          <input type="hidden" name="id" value={id} />
          <input name="body" required placeholder="Escribe una nota o tarea" className="min-w-[16rem] flex-1 border border-rule bg-sheet px-2 py-1.5" />
          <select name="kind" className="border border-rule bg-sheet px-2 py-1.5"><option value="note">Nota</option><option value="task">Tarea</option></select>
          <input type="date" name="due_at" className="border border-rule bg-sheet px-2 py-1.5" /><button className="btn !py-1.5">Añadir</button>
        </form>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">{notes.map((n) => (
          <li key={n.id} className="flex items-start justify-between gap-3 py-2 text-sm">
            <span><Badge tone={n.kind === "buyer_message" ? "good" : "plain"}>{n.kind === "task" ? "Tarea" : n.kind === "buyer_message" ? "Comprador" : "Nota"}</Badge> <span className={n.done ? "line-through text-muted" : ""}>{n.body}</span> <span className="text-muted">· {date(n.created_at)}{n.due_at ? ` · vence ${date(n.due_at)}` : ""}</span></span>
            {n.kind === "task" && <form action={toggleTask}><input type="hidden" name="id" value={id} /><input type="hidden" name="note_id" value={n.id} /><button className="underline">{n.done ? "Reabrir" : "Hecha"}</button></form>}
          </li>))}</ul>
      </section>
    </div>
  );
}
