import { saveManufacturer } from "@/server/actions";
import { Field, FORMS, SERVICES, REL_ES } from "./ui";

export function ManufacturerForm({ m }: { m?: Record<string, unknown> }) {
  const forms = (m?.dosage_forms as string[]) ?? [];
  const services = (m?.services as string[]) ?? [];
  const certs = ((m?.certifications as { name: string; evidence_url?: string; verified?: boolean }[]) ?? [])
    .map((c) => [c.name, c.evidence_url ?? "", c.verified ? "verificado" : "declarado"].join(" | ")).join("\n");
  return (
    <form action={saveManufacturer} className="sheet grid gap-4 p-5 md:grid-cols-2">
      {m?.id ? <input type="hidden" name="id" value={String(m.id)} /> : null}
      <Field label="Nombre interno" name="internal_name" defaultValue={m?.internal_name} required />
      <Field label="Razón social" name="legal_name" defaultValue={m?.legal_name} />
      <Field label="País (en inglés, p. ej. Spain)" name="country" defaultValue={m?.country} required />
      <Field label="Ciudad" name="city" defaultValue={m?.city} />
      <Field label="Web" name="website" defaultValue={m?.website} />
      <Field label="Fuente de los datos (URL)" name="source_url" defaultValue={m?.source_url} />
      <label className="block text-sm"><span className="font-semibold text-muted">Relación</span>
        <select name="relationship" defaultValue={String(m?.relationship ?? "public_source")} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">
          {Object.entries(REL_ES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="block text-sm"><span className="font-semibold text-muted">Verificación</span>
        <select name="verification" defaultValue={String(m?.verification ?? "declared")} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5">
          <option value="declared">Declarado por el fabricante</option><option value="verified">Verificado por nosotros</option></select></label>
      <fieldset className="text-sm"><legend className="font-semibold text-muted">Formas que fabrica</legend>
        <div className="mt-1 flex flex-wrap gap-3">{FORMS.map((f) => <label key={f} className="flex items-center gap-1"><input type="checkbox" name="dosage_forms" value={f} defaultChecked={forms.includes(f)} />{f}</label>)}</div></fieldset>
      <fieldset className="text-sm"><legend className="font-semibold text-muted">Servicios</legend>
        <div className="mt-1 flex flex-wrap gap-3">{SERVICES.map((s) => <label key={s} className="flex items-center gap-1"><input type="checkbox" name="services" value={s} defaultChecked={services.includes(s)} />{s}</label>)}</div>
        <label className="mt-3 flex items-center gap-2"><input type="checkbox" name="capacity_confirmed" defaultChecked={Boolean(m?.capacity_confirmed)} /> Capacidad disponible confirmada</label></fieldset>
      <label className="block text-sm md:col-span-2"><span className="font-semibold text-muted">Certificaciones (una por línea: nombre | URL de la evidencia | verificado o declarado)</span>
        <textarea name="certifications" rows={3} defaultValue={certs} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5" placeholder="GMP | https://… | verificado" /></label>
      <Field label="MOQ (notas)" name="moq_notes" defaultValue={m?.moq_notes} />
      <Field label="Última verificación" name="last_verified_at" type="date" defaultValue={m?.last_verified_at ? String(m.last_verified_at).slice(0, 10) : ""} />
      <label className="block text-sm md:col-span-2"><span className="font-semibold text-muted">Resumen público anónimo (solo capacidades documentadas)</span>
        <textarea name="public_summary" rows={2} defaultValue={String(m?.public_summary ?? "")} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5" /></label>
      <Field label="Contacto" name="contact_name" defaultValue={m?.contact_name} />
      <Field label="Correo del contacto" name="contact_email" type="email" defaultValue={m?.contact_email} />
      <Field label="Teléfono" name="contact_phone" defaultValue={m?.contact_phone} />
      <label className="block text-sm md:col-span-2"><span className="font-semibold text-muted">Notas privadas</span>
        <textarea name="private_notes" rows={3} defaultValue={String(m?.private_notes ?? "")} className="mt-1 block w-full border border-rule bg-sheet px-2 py-1.5" /></label>
      <div className="md:col-span-2"><button className="btn">Guardar fabricante</button></div>
    </form>
  );
}
