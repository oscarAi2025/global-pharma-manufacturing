"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/config/site";
import { t } from "@/content/ui";
import { parseNeed, type Parsed } from "@/lib/parse";

const fmt = (n: number, l: Locale) => n.toLocaleString(l === "pt" ? "pt-BR" : l);
const ISO: Record<string, string> = { Spain: "ES", Germany: "DE", Italy: "IT", France: "FR", Portugal: "PT", Netherlands: "NL", Poland: "PL", "United Kingdom": "GB",
  Switzerland: "CH", Turkey: "TR", "United States": "US", Canada: "CA", Mexico: "MX", Colombia: "CO", Brazil: "BR", Argentina: "AR", Chile: "CL", Peru: "PE",
  India: "IN", China: "CN", Japan: "JP", "South Korea": "KR", "United Arab Emirates": "AE", "Saudi Arabia": "SA", "South Africa": "ZA", Australia: "AU" };
const ACCENT: Record<string, string> = { colageno: "colágeno", cafeina: "cafeína", curcuma: "cúrcuma", multivitaminico: "multivitamínico", proteina: "proteína", sauco: "saúco", probiotico: "probiótico" };
function country(name: string, l: Locale) {
  try { return new Intl.DisplayNames([l === "pt" ? "pt-BR" : l], { type: "region" }).of(ISO[name] ?? "") ?? name; } catch { return name; }
}

/** Buscador en lenguaje natural: muestra en vivo lo que entiende y lleva al formulario con los datos ya rellenos. */
export function NeedSearch({ locale, quotePath }: { locale: Locale; quotePath: string }) {
  const S = t(locale).search;
  const forms = t(locale).home.forms;
  const formNames: Record<string, string> = { capsules: forms[0], tablets: forms[1], softgels: forms[2], gummies: forms[3], powders: forms[4], liquids: forms[5] };
  const [q, setQ] = useState("");
  const p: Parsed = useMemo(() => parseNeed(q), [q]);

  const chips: { k: string; v: string }[] = [];
  if (p.dosageForm) chips.push({ k: S.fields.dosageForm, v: formNames[p.dosageForm] ?? p.dosageForm });
  if (p.productType) chips.push({ k: S.fields.productType, v: S.types[p.productType] });
  if (p.quantity) chips.push({ k: S.fields.quantity, v: `${fmt(p.quantity, locale)} ${S.units[p.quantityUnit ?? "units"]}` });
  if (p.targetMarket) chips.push({ k: S.fields.targetMarket, v: country(p.targetMarket, locale) });
  if (p.manufacturingCountry || p.manufacturingRegion) chips.push({ k: S.fields.manufacturingLocation, v: p.manufacturingCountry ? country(p.manufacturingCountry, locale) : S.regions[p.manufacturingRegion!] });
  if (p.ingredients.length) chips.push({ k: S.fields.ingredients, v: p.ingredients.map((i) => ACCENT[i] ?? i).join(", ") });
  if (p.certifications.length) chips.push({ k: S.fields.certifications, v: p.certifications.join(", ") });
  if (p.services.length) chips.push({ k: S.fields.services, v: p.services.map((s) => S.servicesNames[s as keyof typeof S.servicesNames] ?? s).join(", ") });
  if (p.lowMoq) chips.push({ k: S.fields.lowMoq, v: "✓" });

  const href = () => {
    const u = new URLSearchParams({ q });
    if (p.dosageForm) u.set("form", p.dosageForm);
    if (p.productType) u.set("type", p.productType);
    if (p.targetMarket) u.set("market", country(p.targetMarket, locale));
    return `${quotePath}?${u.toString()}`;
  };

  return (
    <form className="need" action={quotePath} method="get" onSubmit={(e) => { e.preventDefault(); location.href = href(); }} role="search">
      <label htmlFor="need-q" className="need-label">{S.label}</label>
      <div className="need-box">
        <textarea id="need-q" name="q" rows={2} value={q} onChange={(e) => setQ(e.target.value)} placeholder={S.placeholder} maxLength={600}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); (e.currentTarget.form as HTMLFormElement).requestSubmit(); } }} />
        <button type="submit" className="btn need-submit">{S.submit}</button>
      </div>
      <div className="need-read" aria-live="polite">
        <p className="need-read-title">{S.understood}</p>
        {chips.length ? (
          <dl className="need-chips">{chips.map((c) => <div key={c.k} className="need-chip"><dt>{c.k}</dt><dd>{c.v}</dd></div>)}</dl>
        ) : <p className="need-empty">{S.nothing}</p>}
      </div>
      <div className="need-examples">
        <span>{S.tryLabel}</span>
        {S.examples.map((ex) => <button key={ex} type="button" onClick={() => setQ(ex)}>{ex}</button>)}
      </div>
    </form>
  );
}
