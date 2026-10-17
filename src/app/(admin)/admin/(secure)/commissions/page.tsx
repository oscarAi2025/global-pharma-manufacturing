import { db } from "@/server/db";
import { Field, money, date } from "@/components/admin/ui";
import { addPayment, setOrderCredited } from "@/server/actions";

const LABEL: Record<string, string> = { estimated: "Estimada", accrued: "Devengada", paid: "Cobrada", no_agreement: "Sin acuerdo" };

export default async function Commissions() {
  const d = await db();
  const rows = (await d.query<Record<string, string>>("select l.*, r.ref from commission_ledger l left join manufacturing_requests r on r.id = l.request_id order by l.invoiced_at desc nulls first")).rows;
  const mans = (await d.query<Record<string, string>>("select id, internal_name from manufacturers where deleted_at is null order by internal_name")).rows;
  const pays = (await d.query<Record<string, string>>("select p.*, m.internal_name from payments_received p join manufacturers m on m.id = p.manufacturer_id order by received_at desc limit 50")).rows;
  return (
    <div className="grid gap-10">
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3"><h1 className="text-3xl">Comisiones</h1><a href="/admin/export/commissions/">Exportar CSV</a></div>
        <p className="mt-2 max-w-prose text-sm text-muted">«Estimada»: venta registrada sin acreditar. «Devengada»: venta acreditada con acuerdo firmado, pendiente de cobro. Las ventas sin acuerdo firmado no generan comisión.</p>
        <div className="mt-4 overflow-x-auto"><table className="reg-table"><thead><tr><th>Fabricante</th><th>Solicitud</th><th>Pedido</th><th>Importe</th><th>%</th><th>Comisión</th><th>Cobrado</th><th>Estado</th><th></th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.order_id}><td>{r.manufacturer}</td><td>{r.ref ? <a href={`/admin/requests/${r.request_id}/`}>{r.ref}</a> : "—"}</td>
            <td>{r.description}{String(r.is_reorder) === "true" ? " (recompra)" : ""}<br /><span className="text-xs text-muted">{date(r.invoiced_at)}</span></td>
            <td>{money(r.order_amount, r.currency)}</td><td>{r.pct ?? "—"}</td><td>{money(r.commission, r.currency)}</td><td>{money(r.paid, r.currency)}</td><td>{LABEL[r.commission_status]}</td>
            <td>{String(r.credited) !== "true" && <form action={setOrderCredited}><input type="hidden" name="order_id" value={r.order_id} /><button className="text-sm underline">Acreditar venta</button></form>}</td></tr>)}</tbody></table></div>
        {!rows.length && <p className="mt-3 text-muted">Aún no hay pedidos. Se registran desde cada solicitud.</p>}
      </section>
      <section>
        <h2 className="text-xl">Registrar un cobro</h2>
        <form action={addPayment} className="sheet mt-3 grid gap-3 p-4 sm:grid-cols-3">
          <label className="block text-sm"><span className="font-semibold text-muted">Fabricante</span><select name="manufacturer_id" required className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">{mans.map((m) => <option key={m.id} value={m.id}>{m.internal_name}</option>)}</select></label>
          <label className="block text-sm"><span className="font-semibold text-muted">Pedido</span><select name="order_id" className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5"><option value="">—</option>{rows.map((r) => <option key={r.order_id} value={r.order_id}>{r.manufacturer} · {r.description}</option>)}</select></label>
          <Field label="Importe" name="amount" type="number" required /><Field label="Moneda" name="currency" defaultValue="USD" />
          <Field label="Fecha" name="received_at" type="date" required /><Field label="Referencia" name="reference" />
          <div className="sm:col-span-3"><button className="btn !py-1.5" disabled={!mans.length}>Registrar cobro</button></div>
        </form>
        {pays.length > 0 && <ul className="mt-4 text-sm">{pays.map((p) => <li key={p.id}>{date(p.received_at)} · {p.internal_name} · {money(p.amount, p.currency)} {p.reference ? `· ${p.reference}` : ""}</li>)}</ul>}
      </section>
    </div>
  );
}
