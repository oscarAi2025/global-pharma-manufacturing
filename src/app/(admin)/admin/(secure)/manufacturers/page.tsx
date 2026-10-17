import { db } from "@/server/db";
import { REL_ES, Badge } from "@/components/admin/ui";
import { ManufacturerForm } from "@/components/admin/ManufacturerForm";

export default async function Manufacturers() {
  const rows = (await (await db()).query<Record<string, unknown>>(
    `select m.*, (select count(*) from commission_agreements a where a.manufacturer_id = m.id and a.status = 'signed') signed
       from manufacturers m where deleted_at is null order by m.internal_name`)).rows;
  return (
    <div className="grid gap-10">
      <section>
        <h1 className="text-3xl">Fabricantes</h1>
        <p className="mt-2 max-w-prose text-sm text-muted">Una empresa encontrada en fuentes públicas no es un fabricante asociado. La relación y la verificación se guardan por separado.</p>
        <table className="reg-table mt-4"><thead><tr><th>Nombre</th><th>País</th><th>Formas</th><th>Relación</th><th>Verificación</th><th>Acuerdo</th></tr></thead>
          <tbody>{rows.map((m) => <tr key={String(m.id)}><td><a href={`/admin/manufacturers/${m.id}/`}>{String(m.internal_name)}</a></td><td>{String(m.country)}</td>
            <td>{(m.dosage_forms as string[]).join(", ")}</td><td>{REL_ES[String(m.relationship)]}</td>
            <td><Badge tone={m.verification === "verified" ? "good" : "plain"}>{m.verification === "verified" ? "Verificado" : "Declarado"}</Badge></td>
            <td>{Number(m.signed) ? <Badge tone="good">Firmado</Badge> : "—"}</td></tr>)}</tbody></table>
        {!rows.length && <p className="mt-3 text-muted">Aún no hay fabricantes. Da de alta el primero con el formulario.</p>}
      </section>
      <section><h2 className="text-xl">Nuevo fabricante</h2><div className="mt-3"><ManufacturerForm /></div></section>
    </div>
  );
}
