"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/config/site";
import { t } from "@/content/ui";
import type { PublicManufacturer } from "@/server/public";
import { FormIcon } from "./Illustrations";

const KEYS = ["capsules", "tablets", "softgels", "gummies", "powders", "liquids", "topicals"];

export function Directory({ locale, items, quotePath, initialForm, compact = false }: { locale: Locale; items: PublicManufacturer[]; quotePath: string; initialForm?: string; compact?: boolean }) {
  const L = t(locale); const D = L.dir;
  const names: Record<string, string> = Object.fromEntries(KEYS.map((k, i) => [k, i < 6 ? L.home.forms[i] : L.home.formsExtra.topicals]));
  const [form, setForm] = useState(initialForm ?? "");
  const [country, setCountry] = useState("");
  const [verified, setVerified] = useState(false);
  const [capacity, setCapacity] = useState(false);
  const [q, setQ] = useState("");
  const [partners, setPartners] = useState(false);
  const countries = [...new Set(items.map((i) => i.country))].sort();
  const shown = useMemo(() => items.filter((m) =>
    (!form || m.forms.includes(form)) && (!partners || m.origin === "partner") && (!country || m.country === country) && (!capacity || m.capacity) &&
    (!verified || m.certifications.some((c) => c.verified)) &&
    (!q || `${m.summary} ${(m.areas ?? []).join(" ")} ${m.certifications.map((c) => c.name).join(" ")}`.toLowerCase().includes(q.toLowerCase()))), [items, form, country, verified, capacity, q, partners]);

  if (!items.length) {
    return (
      <div className="dir-empty">
        <FormIcon form={initialForm ?? "capsules"} className="h-16 w-16 text-ink" />
        <div><h3>{D.emptyTitle}</h3><p className="mt-2 max-w-prose text-muted">{D.emptyText}</p>
          <a className="btn mt-5" href={`${quotePath}${initialForm ? `?form=${initialForm}` : ""}`}>{L.nav.quote}</a></div>
      </div>
    );
  }
  return (
    <div className={compact ? "" : "grid gap-8 lg:grid-cols-[260px_1fr]"}>
      {!compact && (
        <aside className="dir-filters" aria-label={D.filters}>
          <p className="font-semibold">{D.filters}</p>
          <label className="mt-4 block text-sm"><span className="text-muted">{D.search}</span><input value={q} onChange={(e) => setQ(e.target.value)} className="dir-input" /></label>
          <fieldset className="mt-4"><legend className="text-sm text-muted">{D.form}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" aria-pressed={!form} onClick={() => setForm("")} className="dir-chip">{D.any}</button>
              {KEYS.map((k) => <button key={k} type="button" aria-pressed={form === k} onClick={() => setForm(form === k ? "" : k)} className="dir-chip">{names[k]}</button>)}
            </div></fieldset>
          <label className="mt-4 block text-sm"><span className="text-muted">{D.country}</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="dir-input"><option value="">{D.anyCountry}</option>{countries.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-teal" />{D.verifiedOnly}</label>
          <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={partners} onChange={(e) => setPartners(e.target.checked)} className="accent-teal" />{D.onlyPartners}</label>
          <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={capacity} onChange={(e) => setCapacity(e.target.checked)} className="accent-teal" />{D.capacityOnly}</label>
        </aside>
      )}
      <div>
        {!compact && <p className="text-sm font-semibold text-muted" aria-live="polite">{D.results(shown.length)}</p>}
        <ul className="dir-grid mt-3">
          {shown.map((m) => (
            <li key={m.code} className={`maker ${m.origin === "public" ? "is-public" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="maker-code">{m.code}</p><p className="maker-country">{m.country}</p></div>
                <div className="flex -space-x-2">{m.forms.slice(0, 3).map((f) => <span key={f} className="maker-form" title={names[f] ?? f}><FormIcon form={f} className="h-7 w-7" /></span>)}</div>
              </div>
              <p className={`mt-3 inline-block self-start maker-badge ${m.origin === "partner" ? "is-verified" : ""}`}>{m.origin === "partner" ? D.agreement : D.publicBadge}</p>
              {m.summary && <p className="mt-3 text-[0.97rem]">{m.summary}</p>}
              {m.areas && m.areas.length > 0 && <p className="mt-2 text-sm text-muted">{m.areas.join(" · ")}</p>}
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {m.certifications.map((c) => <li key={c.name} className={`maker-badge ${c.verified ? "is-verified" : ""}`}>{c.name} · {c.verified ? D.verified : D.declared}</li>)}
                {m.capacity && <li className="maker-badge is-verified">{D.capacity}</li>}
              </ul>
              {m.moq && <p className="mt-3 text-sm"><span className="text-muted">{D.moq}:</span> {m.moq}</p>}
              {m.validUntil && <p className="mt-2 text-sm"><span className="text-muted">{D.validUntil}:</span> {m.validUntil}</p>}
              {m.source && <p className="mt-2 text-xs text-muted">{D.source}: <a href={m.source.url} rel="noopener" target="_blank">{m.source.name}</a> ({m.source.retrieved})</p>}
              <a className="btn mt-4 !py-2 text-sm" href={`${quotePath}?form=${m.forms[0] ?? ""}`}>{D.request}</a>
            </li>
          ))}
        </ul>
        {!shown.length && <p className="mt-4 text-muted">{D.none}</p>}
      </div>
    </div>
  );
}
