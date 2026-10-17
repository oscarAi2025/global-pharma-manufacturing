import { db } from "@/server/db";
import { STAGE_ES, CLASS_ES, Badge, money, date } from "@/components/admin/ui";

export default async function Dashboard() {
  const d = await db();
  const stages = (await d.query<{ stage: string; n: string }>("select stage, count(*) n from manufacturing_requests group by stage order by count(*) desc")).rows;
  const latest = (await d.query<Record<string, string>>(
    `select r.id, r.ref, r.dosage_form, r.quantity_text, r.market, r.classification, r.score, r.stage, r.created_at, b.company
       from manufacturing_requests r join buyers b on b.id = r.buyer_id order by r.created_at desc limit 8`)).rows;
  const comm = (await d.query<{ commission_status: string; currency: string; total: string }>(
    "select commission_status, currency, sum(commission) total from commission_ledger group by 1,2")).rows;
  const tasks = (await d.query<Record<string, string>>(
    `select n.id, n.body, n.due_at, r.id rid, r.ref from request_notes n join manufacturing_requests r on r.id = n.request_id
      where n.kind = 'task' and not n.done order by n.due_at nulls last limit 8`)).rows;
  const label = { estimated: "Estimada (venta no acreditada)", accrued: "Devengada pendiente de cobro", paid: "Cobrada", no_agreement: "Sin acuerdo firmado" } as Record<string, string>;
  return (
    <div className="grid gap-10">
      <section>
        <h1 className="text-3xl">Resumen</h1>
        <div className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {comm.length ? comm.map((c) => (
            <div key={c.commission_status + c.currency} className="bg-sheet p-4"><p className="text-sm text-muted">{label[c.commission_status]}</p><p className="mt-1 text-2xl font-bold">{money(c.total, c.currency)}</p></div>
          )) : <div className="bg-sheet p-4 text-muted sm:col-span-4">Aún no hay pedidos registrados.</div>}
        </div>
      </section>
      <section className="grid gap-10 lg:grid-cols-2">
        <div><h2 className="text-xl">Embudo</h2>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">{stages.map((s) => <li key={s.stage} className="flex justify-between py-2"><a href={`/admin/requests/?stage=${s.stage}`}>{STAGE_ES[s.stage]}</a><strong>{s.n}</strong></li>)}</ul>
          {!stages.length && <p className="mt-3 text-muted">Sin solicitudes todavía.</p>}
        </div>
        <div><h2 className="text-xl">Tareas abiertas</h2>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">{tasks.map((t) => <li key={t.id} className="py-2"><a href={`/admin/requests/${t.rid}/`}>{t.ref}</a> · {t.body} <span className="text-sm text-muted">{date(t.due_at)}</span></li>)}</ul>
          {!tasks.length && <p className="mt-3 text-muted">Ninguna.</p>}
        </div>
      </section>
      <section><h2 className="text-xl">Últimas solicitudes</h2>
        <table className="reg-table mt-3"><thead><tr><th>Ref.</th><th>Empresa</th><th>Producto</th><th>Mercado</th><th>Clasificación</th><th>Etapa</th><th>Fecha</th></tr></thead>
          <tbody>{latest.map((r) => <tr key={r.id}><td><a href={`/admin/requests/${r.id}/`}>{r.ref}</a></td><td>{r.company}</td><td>{r.dosage_form} · {r.quantity_text}</td><td>{r.market}</td>
            <td><Badge tone={r.classification === "priority" ? "good" : r.classification === "incomplete" ? "warn" : "plain"}>{CLASS_ES[r.classification]} · {r.score}</Badge></td><td>{STAGE_ES[r.stage]}</td><td>{date(r.created_at)}</td></tr>)}</tbody></table>
      </section>
    </div>
  );
}
