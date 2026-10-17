import { notFound } from "next/navigation";
import { db, dbConfigured } from "@/server/db";
import { manufacturerByToken } from "@/server/portal";
import { postCapabilities, postManufacturerQuote } from "@/server/portal-actions";
import { FORMS, Field } from "@/components/admin/ui";

export default async function ManufacturerPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!dbConfigured()) notFound();
  const data = await manufacturerByToken(await db(), token);
  if (!data) notFound();
  const forms = data.m.dosage_forms as string[];
  return (
    <main className="wrap max-w-4xl py-12">
      <h1 className="text-4xl">Portal de fabricantes</h1>
      <p className="mt-2 text-muted">{String(data.m.internal_name)} · Las oportunidades se muestran sin datos del comprador. Lo que declares aquí se marca como «declarado» hasta que lo verifiquemos.</p>
      <section className="mt-10"><h2 className="text-xl">Oportunidades</h2>
        {data.opps.length ? data.opps.map((o) => (
          <div key={String(o.match_id)} className="sheet mt-4 p-5">
            <p className="font-semibold">{String(o.ref)} · {String(o.product_type)} · {String(o.dosage_form)}</p>
            <p className="mt-1 text-sm text-muted">Cantidad: {String(o.quantity_text)} · Mercado: {String(o.market)} · Fórmula: {String(o.formulation)} · Plazo: {String(o.timeline)}</p>
            <form action={postManufacturerQuote} className="mt-4 grid gap-3 sm:grid-cols-4">
              <input type="hidden" name="token" value={token} /><input type="hidden" name="request_id" value={String(o.request_id)} />
              <Field label="Importe" name="amount" type="number" /><Field label="Moneda" name="currency" defaultValue="USD" />
              <Field label="MOQ" name="moq" /><Field label="Plazo" name="lead_time" />
              <label className="block text-sm sm:col-span-4"><span className="font-semibold text-muted">Condiciones y comentarios</span><textarea name="notes" rows={2} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5" /></label>
              <div><button className="btn !py-1.5">Enviar cotización</button></div>
            </form>
          </div>)) : <p className="mt-3 text-muted">No hay oportunidades abiertas para ti en este momento.</p>}
      </section>
      <section className="mt-10"><h2 className="text-xl">Tus capacidades</h2>
        <form action={postCapabilities} className="sheet mt-3 grid gap-3 p-5"><input type="hidden" name="token" value={token} />
          <div className="flex flex-wrap gap-3 text-sm">{FORMS.map((f) => <label key={f} className="flex items-center gap-1"><input type="checkbox" name="dosage_forms" value={f} defaultChecked={forms.includes(f)} />{f}</label>)}</div>
          <Field label="Pedido mínimo (notas)" name="moq_notes" defaultValue={data.m.moq_notes} />
          <div><button className="btn !py-1.5">Guardar capacidades</button></div></form>
      </section>
    </main>
  );
}
