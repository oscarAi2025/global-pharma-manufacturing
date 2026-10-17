import { db } from "@/server/db";
import { STAGE_ES, CLASS_ES, Badge, date } from "@/components/admin/ui";
import { stages } from "@/lib/stages";

export default async function Requests({ searchParams }: { searchParams: Promise<{ stage?: string; class?: string }> }) {
  const sp = await searchParams;
  const where: string[] = []; const params: unknown[] = [];
  if (sp.stage) { params.push(sp.stage); where.push(`r.stage = $${params.length}`); }
  if (sp.class) { params.push(sp.class); where.push(`r.classification = $${params.length}`); }
  const rows = (await (await db()).query<Record<string, string>>(
    `select r.id, r.ref, r.product_type, r.dosage_form, r.quantity_text, r.market, r.classification, r.score, r.stage, r.created_at, r.locale, b.company, b.email
       from manufacturing_requests r join buyers b on b.id = r.buyer_id ${where.length ? "where " + where.join(" and ") : ""}
      order by r.created_at desc limit 300`, params)).rows;
  return (
    <div>
      <h1 className="text-3xl">Solicitudes</h1>
      <form className="mt-4 flex flex-wrap gap-3 text-sm">
        <select name="stage" defaultValue={sp.stage ?? ""} className="border border-rule bg-sheet px-2 py-1.5"><option value="">Todas las etapas</option>{stages.map((s) => <option key={s} value={s}>{STAGE_ES[s]}</option>)}</select>
        <select name="class" defaultValue={sp.class ?? ""} className="border border-rule bg-sheet px-2 py-1.5"><option value="">Todas las clasificaciones</option>{Object.entries(CLASS_ES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button className="btn !py-1.5">Filtrar</button>
      </form>
      <div className="mt-6 overflow-x-auto">
        <table className="reg-table"><thead><tr><th>Ref.</th><th>Empresa</th><th>Producto</th><th>Cantidad</th><th>Mercado</th><th>Clasificación</th><th>Etapa</th><th>Idioma</th><th>Fecha</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.id}><td><a href={`/admin/requests/${r.id}/`}>{r.ref}</a></td><td>{r.company}<br /><span className="text-xs text-muted">{r.email}</span></td>
            <td>{r.product_type} · {r.dosage_form}</td><td>{r.quantity_text}</td><td>{r.market}</td>
            <td><Badge tone={r.classification === "priority" ? "good" : r.classification === "incomplete" ? "warn" : "plain"}>{CLASS_ES[r.classification]} · {r.score}</Badge></td>
            <td>{STAGE_ES[r.stage]}</td><td>{r.locale}</td><td>{date(r.created_at)}</td></tr>)}</tbody></table>
        {!rows.length && <p className="mt-4 text-muted">No hay solicitudes con esos filtros.</p>}
      </div>
    </div>
  );
}
