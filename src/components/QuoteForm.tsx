"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/config/site";
import { t } from "@/content/ui";
import {
  FORM_NAME, attributionFrom, dosageForms, encodeForm, formulations, productTypes, step1Schema, step2Schema,
  timelines, trackingFields, validate, type FieldErrors,
} from "@/lib/lead";

const ATTR_KEY = "gpm_attribution";
const marketSuggestions: Record<Locale, string[]> = {
  es: ["España", "México", "Colombia", "Brasil", "Estados Unidos", "Unión Europea"],
  pt: ["Brasil", "Portugal", "México", "Colômbia", "Estados Unidos", "União Europeia"],
  en: ["United States", "United Kingdom", "European Union", "Mexico", "Brazil", "Colombia", "Spain"],
};

/**
 * Solicitud en dos pasos sobre un único formulario de Netlify Forms. Todos los campos están en el HTML
 * (Netlify los detecta en el build); el paso 2 se oculta hasta completar el paso 1.
 * Sin JavaScript, el formulario se envía entero de forma nativa y redirige a la página de gracias.
 */
export function QuoteForm({ locale, thanksPath, privacyPath, compact = false }: { locale: Locale; thanksPath: string; privacyPath: string; compact?: boolean }) {
  const L = t(locale).form;
  const forms = t(locale).home.forms;
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [js, setJs] = useState(false);
  const [attr, setAttr] = useState<Record<string, string>>({});

  useEffect(() => {
    setJs(true);
    // Los campos ocultos son controlados: un input hidden refleja su atributo y React lo reescribiría.
    let attr: Record<string, string> | null = null;
    try { attr = JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "null"); } catch { /* almacenamiento no disponible */ }
    if (!attr) {
      attr = attributionFrom(location.search, location.pathname, document.referrer);
      try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr)); } catch { /* sin persistencia */ }
    }
    setAttr(attr);
  }, []);

  const read = (): Record<string, string> => {
    const fd = new FormData(formRef.current!);
    const o: Record<string, string> = {};
    fd.forEach((v, k) => { o[k] = String(v); });
    return o;
  };

  const focusFirst = (errs: FieldErrors) => {
    const k = Object.keys(errs)[0];
    if (k) (formRef.current?.elements.namedItem(k) as HTMLElement | null)?.focus();
  };

  const next = () => {
    const errs = validate(step1Schema, read());
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs);
    setStep(2);
    requestAnimationFrame(() => (formRef.current?.elements.namedItem("formulation") as HTMLElement | null)?.focus());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = read();
    const errs = { ...validate(step1Schema, data), ...validate(step2Schema, data) };
    setErrors(errs);
    if (Object.keys(errs).length) {
      if (Object.keys(errs).some((k) => k in step1Schema.shape)) setStep(1);
      return focusFirst(errs);
    }
    if (data["bot-field"]) { setState("sent"); return; } // honeypot: se descarta en silencio
    setState("sending");
    try {
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encodeForm(data) });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const err = (k: string) => errors[k] ? <p id={`${k}-err`} className="field-error">{L[errors[k]]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (state === "sent") {
    return (
      <div className="sheet" role="status" aria-live="polite">
        <h2 className="sheet-title">{L.sent}</h2>
        <p className="mt-3 text-muted">{L.sentText}</p>
      </div>
    );
  }

  const showStep2 = !js || step === 2;
  const showStep1 = !js || step === 1;

  return (
    <form
      ref={formRef} name={FORM_NAME} method="POST" action={thanksPath} data-netlify="true" netlify-honeypot="bot-field"
      onSubmit={submit} noValidate className="sheet" aria-labelledby={`qf-title-${compact ? "c" : "p"}`}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <input type="hidden" name="locale" value={locale} />
      {trackingFields.map((k) => <input key={k} type="hidden" name={k} value={attr[k] ?? ""} readOnly />)}
      <p className="hidden" aria-hidden="true"><label>No rellenar <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

      <div className="sheet-head">
        <h2 id={`qf-title-${compact ? "c" : "p"}`} className="sheet-title">{L.title}</h2>
        {js && <p className="sheet-step" aria-live="polite">{step === 1 ? L.step1 : L.step2} <span className="text-muted">({step}/2)</span></p>}
      </div>

      <fieldset hidden={!showStep1} className="sheet-body">
        <legend className="sr-only">{L.step1}</legend>
        <div className="row">
          <label htmlFor="product_type">{L.productType}</label>
          <select id="product_type" name="product_type" defaultValue="supplement" {...aria("product_type")}>
            {productTypes.map((k) => <option key={k} value={k}>{L.productTypes[k]}</option>)}
          </select>
          {err("product_type")}
        </div>
        <div className="row">
          <label htmlFor="dosage_form">{L.dosageForm}</label>
          <select id="dosage_form" name="dosage_form" defaultValue="" {...aria("dosage_form")}>
            <option value="" disabled>—</option>
            {dosageForms.map((k, i) => <option key={k} value={k}>{k === "other" ? L.dosageOther : forms[i]}</option>)}
          </select>
          {err("dosage_form")}
        </div>
        <div className="row">
          <label htmlFor="quantity">{L.quantity}</label>
          <input id="quantity" name="quantity" type="text" placeholder={L.quantityHint} maxLength={200} {...aria("quantity")} />
          {err("quantity")}
        </div>
        <div className="row">
          <label htmlFor="market">{L.market}</label>
          <input id="market" name="market" type="text" list={`markets-${locale}`} maxLength={80} autoComplete="country-name" {...aria("market")} />
          <datalist id={`markets-${locale}`}>{marketSuggestions[locale].map((m) => <option key={m} value={m} />)}</datalist>
          {err("market")}
        </div>
        {js && <div className="sheet-actions"><button type="button" className="btn" onClick={next}>{L.next}</button></div>}
      </fieldset>

      <fieldset hidden={!showStep2} className="sheet-body">
        <legend className="sr-only">{L.step2}</legend>
        <div className="row">
          <label htmlFor="formulation">{L.formulation}</label>
          <select id="formulation" name="formulation" defaultValue="" {...aria("formulation")}>
            <option value="" disabled>—</option>
            {formulations.map((k) => <option key={k} value={k}>{L.formulations[k]}</option>)}
          </select>
          {err("formulation")}
        </div>
        <div className="row">
          <label htmlFor="timeline">{L.timeline}</label>
          <select id="timeline" name="timeline" defaultValue="" {...aria("timeline")}>
            <option value="" disabled>—</option>
            {timelines.map((k) => <option key={k} value={k}>{L.timelines[k]}</option>)}
          </select>
          {err("timeline")}
        </div>
        <div className="row">
          <label htmlFor="details">{L.details}</label>
          <textarea id="details" name="details" rows={3} maxLength={3000} />
        </div>
        <div className="row-pair">
          <div className="row">
            <label htmlFor="name">{L.name}</label>
            <input id="name" name="name" type="text" autoComplete="name" maxLength={120} {...aria("name")} />
            {err("name")}
          </div>
          <div className="row">
            <label htmlFor="company">{L.company}</label>
            <input id="company" name="company" type="text" autoComplete="organization" maxLength={160} {...aria("company")} />
            {err("company")}
          </div>
        </div>
        <div className="row-pair">
          <div className="row">
            <label htmlFor="email">{L.email}</label>
            <input id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={200} {...aria("email")} />
            {err("email")}
          </div>
          <div className="row">
            <label htmlFor="phone">{L.phone}</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </div>
        </div>
        <div className="row consent">
          <input id="consent" name="consent" type="checkbox" value="yes" {...aria("consent")} />
          <label htmlFor="consent">{L.consent} <a href={privacyPath}>{t(locale).footer.legal}</a></label>
          {err("consent")}
        </div>
        {state === "error" && <p className="field-error" role="alert">{L.error}</p>}
        <div className="sheet-actions">
          {js && <button type="button" className="btn-quiet" onClick={() => setStep(1)}>{L.back}</button>}
          <button type="submit" className="btn" disabled={state === "sending"}>{state === "sending" ? L.sending : L.submit}</button>
        </div>
      </fieldset>
    </form>
  );
}
