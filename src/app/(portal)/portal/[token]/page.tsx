import { notFound } from "next/navigation";
import { db, dbConfigured } from "@/server/db";
import { requestByToken } from "@/server/requests";
import { postBuyerMessage } from "@/server/portal-actions";
import { site } from "@/config/site";

const T = {
  es: { title: "Tu solicitud", ref: "Referencia", steps: ["Recibida", "En revisión", "Buscando fabricantes", "Propuestas listas", "Decisión"], missing: "Para cotizar mejor nos falta", quotes: "Propuestas", proposal: "Propuesta", none: "Todavía no hay propuestas. Te avisaremos por correo.", msg: "Escríbenos", send: "Enviar mensaje", your: "Tus mensajes", moq: "Pedido mínimo", lead: "Plazo", amount: "Importe" },
  pt: { title: "Sua solicitação", ref: "Referência", steps: ["Recebida", "Em análise", "Buscando fabricantes", "Propostas prontas", "Decisão"], missing: "Para cotar melhor precisamos de", quotes: "Propostas", proposal: "Proposta", none: "Ainda não há propostas. Avisaremos por e-mail.", msg: "Escreva para nós", send: "Enviar mensagem", your: "Suas mensagens", moq: "Lote mínimo", lead: "Prazo", amount: "Valor" },
  en: { title: "Your request", ref: "Reference", steps: ["Received", "Under review", "Finding manufacturers", "Proposals ready", "Decision"], missing: "To quote accurately we still need", quotes: "Proposals", proposal: "Proposal", none: "No proposals yet. We'll email you.", msg: "Write to us", send: "Send message", your: "Your messages", moq: "Minimum order", lead: "Lead time", amount: "Amount" },
};
const MISSING: Record<string, Record<string, string>> = {
  es: { dosage_form: "La forma (cápsula, comprimido, gomita…)", quantity_number: "La cantidad en unidades", formulation: "Si tienes fórmula propia", packaging: "La presentación: unidades por envase y tipo de envase", certifications: "Las certificaciones que necesitas", manufacturing_location: "Dónde prefieres fabricar" },
  pt: { dosage_form: "A forma (cápsula, comprimido, goma…)", quantity_number: "A quantidade em unidades", formulation: "Se você tem fórmula própria", packaging: "A apresentação: unidades por embalagem e tipo", certifications: "As certificações necessárias", manufacturing_location: "Onde prefere fabricar" },
  en: { dosage_form: "The dosage form (capsule, tablet, gummy…)", quantity_number: "The quantity in units", formulation: "Whether you have your own formula", packaging: "Presentation: units per pack and pack type", certifications: "The certifications you need", manufacturing_location: "Where you'd prefer to manufacture" },
};
const STEP_OF: Record<string, number> = { lead_received: 0, needs_qualification: 1, qualified: 1, manufacturer_matching: 2, manufacturer_contacted: 2, nda_pending: 2, rfq_submitted: 2, quote_received: 2, quote_presented: 3, negotiation: 4, contract_signed: 4, production_initiated: 4, order_invoiced: 4, commission_due: 4, commission_paid: 4, lost: 4 };

export default async function Portal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!dbConfigured()) notFound();
  const data = await requestByToken(await db(), token);
  if (!data) notFound();
  const r = data.request as Record<string, string | string[]>;
  const l = (r.locale as "es" | "pt" | "en") ?? "en"; const L = T[l];
  const step = STEP_OF[String(r.stage)] ?? 0;
  return (
    <main className="wrap max-w-3xl py-12">
      <p className="font-bold" style={{ fontStretch: "75%" }}>{site.name}</p>
      <h1 className="mt-6 text-4xl">{L.title}</h1>
      <p className="mt-2 text-muted">{L.ref}: <strong className="text-ink">{String(r.ref)}</strong> · {String(r.dosage_form)} · {String(r.quantity_text)} · {String(r.market)}</p>
      <ol className="mt-8 grid grid-cols-5 gap-2 text-xs sm:text-sm">{L.steps.map((s, i) => (
        <li key={s} className={`border-t-4 pt-2 ${i <= step ? "border-teal font-semibold" : "border-rule text-muted"}`}>{s}</li>))}</ol>
      {(r.missing as string[]).length > 0 && <section className="mt-10"><h2 className="text-xl">{L.missing}</h2>
        <ul className="mt-3 list-disc pl-5">{(r.missing as string[]).map((m) => <li key={m}>{MISSING[l][m] ?? m}</li>)}</ul></section>}
      <section className="mt-10"><h2 className="text-xl">{L.quotes}</h2>
        {data.quotes.length ? <div className="mt-3 grid gap-3">{data.quotes.map((q, i) => (
          <div key={String(q.id)} className="sheet p-4"><p className="font-semibold">{L.proposal} {String.fromCharCode(65 + i)}</p>
            <p className="mt-1 text-sm">{q.amount ? `${L.amount}: ${Number(q.amount).toLocaleString(l)} ${q.currency}` : ""} {q.moq ? `· ${L.moq}: ${q.moq}` : ""} {q.lead_time ? `· ${L.lead}: ${q.lead_time}` : ""}</p>
            {q.buyer_summary ? <p className="mt-2 text-sm text-muted">{String(q.buyer_summary)}</p> : null}</div>))}</div> : <p className="mt-3 text-muted">{L.none}</p>}
      </section>
      <section className="mt-10"><h2 className="text-xl">{L.msg}</h2>
        <form action={postBuyerMessage} className="mt-3 grid gap-3"><input type="hidden" name="token" value={token} />
          <textarea name="body" rows={4} required maxLength={4000} className="border border-rule bg-sheet p-3" /><div><button className="btn">{L.send}</button></div></form>
        {data.messages.length > 0 && <><h3 className="mt-6 text-base">{L.your}</h3><ul className="mt-2 grid gap-2 text-sm">{data.messages.map((m, i) => <li key={i} className="border-l-4 border-rule pl-3">{String(m.body)}</li>)}</ul></>}
      </section>
    </main>
  );
}
