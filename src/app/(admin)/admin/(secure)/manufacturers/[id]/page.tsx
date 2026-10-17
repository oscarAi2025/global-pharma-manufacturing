import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { site } from "@/config/site";
import { Field, Badge, date } from "@/components/admin/ui";
import { ManufacturerForm } from "@/components/admin/ManufacturerForm";
import { addAgreement, newManufacturerLink } from "@/server/actions";

export default async function Manufacturer({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ link?: string }> }) {
  const { id } = await params; const { link } = await searchParams;
  const d = await db();
  const m = (await d.query<Record<string, unknown>>("select * from manufacturers where id = $1", [id])).rows[0];
  if (!m) notFound();
  const agreements = (await d.query<Record<string, string>>("select * from commission_agreements where manufacturer_id = $1 order by created_at desc", [id])).rows;
  const status: Record<string, string> = { draft: "Borrador", sent: "Enviado", signed: "Firmado", expired: "Vencido" };
  return (
    <div className="grid gap-10">
      <h1 className="text-3xl">{String(m.internal_name)}</h1>
      {link && <p className="border-l-4 border-teal bg-sheet px-4 py-3 text-sm">Enlace privado para el fabricante (válido 30 días, se muestra una sola vez):<br /><code className="break-all">{site.url}/fabricante/{link}/</code></p>}
      <section>
        <h2 className="text-xl">Acuerdos de intermediación</h2>
        <p className="mt-1 text-sm text-muted">Un porcentaje solo cuenta como pactado cuando el acuerdo está «Firmado». La propuesta por defecto es {site.defaultCommissionPct} %.</p>
        {agreements.length > 0 && <table className="reg-table mt-3"><thead><tr><th>%</th><th>Base</th><th>Recurrencia</th><th>Operaciones</th><th>Estado</th><th>Firma</th></tr></thead><tbody>
          {agreements.map((a) => <tr key={a.id}><td>{a.pct}</td><td>{a.basis === "net_collected" ? "Neto cobrado" : "Neto facturado"}</td><td>{a.recurring_months} meses</td><td>{a.covered_operations || "—"}</td>
            <td><Badge tone={a.status === "signed" ? "good" : "plain"}>{status[a.status]}</Badge></td><td>{date(a.signed_at)}</td></tr>)}</tbody></table>}
        <form action={addAgreement} className="sheet mt-4 grid gap-3 p-4 sm:grid-cols-3">
          <input type="hidden" name="manufacturer_id" value={id} />
          <Field label="Comisión %" name="pct" type="number" defaultValue={site.defaultCommissionPct} required />
          <label className="block text-sm"><span className="font-semibold text-muted">Base</span><select name="basis" className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5"><option value="net_invoiced">Neto facturado</option><option value="net_collected">Neto cobrado</option></select></label>
          <Field label="Meses de recompras cubiertas" name="recurring_months" type="number" defaultValue={24} />
          <Field label="Operaciones cubiertas" name="covered_operations" placeholder="Clientes presentados por nosotros" />
          <label className="block text-sm"><span className="font-semibold text-muted">Estado</span><select name="status" className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">{Object.entries(status).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <Field label="Fecha de firma" name="signed_at" type="date" />
          <Field label="Referencia del documento" name="document_ref" />
          <div className="sm:col-span-3"><button className="btn !py-1.5">Añadir acuerdo</button></div>
        </form>
      </section>
      <section className="flex flex-wrap items-center gap-4">
        <form action={newManufacturerLink}><input type="hidden" name="manufacturer_id" value={id} /><button className="btn !py-1.5">Generar enlace al portal del fabricante</button></form>
        <span className="text-sm text-muted">El fabricante podrá actualizar sus capacidades y enviar cotizaciones de las oportunidades que le apruebes.</span>
      </section>
      <section><h2 className="text-xl">Datos</h2><div className="mt-3"><ManufacturerForm m={m} /></div></section>
    </div>
  );
}
