import type { Locale } from "@/config/site";
import { t } from "@/content/ui";
import { countriesFor, pageOf, pathOf } from "@/content/registry";
import { QuoteForm } from "@/components/QuoteForm";

export function Home({ locale }: { locale: Locale }) {
  const L = t(locale);
  const thanks = pageOf(locale, "thanks"), legal = pageOf(locale, "legal"), how = pageOf(locale, "how");
  const countries = countriesFor(locale);
  return (
    <>
      <section className="wrap grid items-start gap-10 pb-16 pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-16">
        <div className="lg:pt-6">
          <h1 className="max-w-[16ch]">{L.home.title}</h1>
          <p className="lead mt-6">{L.home.lead}</p>
          <p className="mt-6 font-semibold">{L.home.free}</p>
        </div>
        <QuoteForm locale={locale} thanksPath={thanks ? pathOf(thanks) : "/"} privacyPath={legal ? pathOf(legal) : "/"} compact />
      </section>

      <section className="rule-top">
        <div className="wrap py-14">
          <h2>{L.nav.how}</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {L.how.steps.map((s, i) => (
              <li key={i} className="border-t-2 border-ink pt-4">
                <span className="font-bold text-teal" style={{ fontStretch: "72%", fontSize: "2rem", lineHeight: 1 }}>{i + 1}</span>
                <h3 className="mt-3">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          {how && <p className="mt-8"><a href={pathOf(how)}>{L.nav.how}</a></p>}
        </div>
      </section>

      <section className="rule-top">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-2">
          <div>
            <h2>{L.home.formsTitle}</h2>
            <ul className="mt-6 grid grid-cols-1 border-t border-rule sm:grid-cols-2">
              {L.home.forms.map((f) => <li key={f} className="border-b border-rule py-3 pr-4 font-semibold">{f}</li>)}
            </ul>
            <p className="mt-4 max-w-prose text-muted">{L.home.formsNote}</p>
          </div>
          <div>
            <h2>{L.home.marketsTitle}</h2>
            <p className="mt-6 max-w-prose text-muted">{L.home.marketsLead}</p>
            {countries.length > 0 && (
              <ul className="mt-6 border-t border-rule">
                {countries.map((c) => (
                  <li key={c.id} className="border-b border-rule py-3" lang={c.locale}>
                    <a href={pathOf(c)} className="font-semibold">{c.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="rule-top">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-2">
          <div><h2>{L.home.modelTitle}</h2><p className="mt-4 max-w-prose">{L.home.model}</p></div>
          <div><h2>{L.home.privacyTitle}</h2><p className="mt-4 max-w-prose">{L.home.privacy}</p></div>
        </div>
      </section>
    </>
  );
}
