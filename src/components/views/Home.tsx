import type { Locale } from "@/config/site";
import { t } from "@/content/ui";
import { countriesFor, formsFor, pageOf, pathOf } from "@/content/registry";
import { QuoteForm } from "@/components/QuoteForm";
import { NeedSearch } from "@/components/NeedSearch";
import { FormIcon, SpecPlate } from "@/components/Illustrations";

const AUTHORITY: Record<string, string> = { MX: "COFEPRIS", CO: "INVIMA", ES: "AESAN", BR: "Anvisa" };
const BASIC = ["capsules", "tablets", "softgels", "gummies", "powders", "liquids"];

export function Home({ locale }: { locale: Locale }) {
  const L = t(locale);
  const thanks = pageOf(locale, "thanks"), legal = pageOf(locale, "legal"), quote = pageOf(locale, "quote");
  const quotePath = quote ? pathOf(quote) : `/${locale}/`;
  const countries = countriesFor(locale);
  const formPages = formsFor(locale);
  const tiles = formPages.length
    ? formPages.map((p) => ({ key: p.form!, name: p.title, text: p.description, href: pathOf(p) }))
    : BASIC.map((k, i) => ({ key: k, name: L.home.forms[i], text: "", href: `${quotePath}?form=${k}` }));

  return (
    <>
      <section className="hero">
        <div className="wrap grid items-center gap-10 pb-28 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16">
          <div>
            <h1 className="max-w-[15ch]">{L.home.title}</h1>
            <p className="lead mt-6">{L.home.lead}</p>
            <p className="mt-5 font-semibold text-teal-deep">{L.home.free}</p>
          </div>
          <div className="hero-plate">
            <SpecPlate labels={BASIC.map((_, i) => L.home.forms[i])} />
          </div>
        </div>
      </section>

      <div className="wrap -mt-20 relative">
        <NeedSearch locale={locale} quotePath={quotePath} />
      </div>

      <section className="wrap pt-24">
        <div className="max-w-prose">
          <h2>{L.explore.title}</h2>
          <p className="mt-4 text-muted">{L.explore.lead}</p>
        </div>
        <ul className={`tiles mt-10 ${tiles.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {tiles.map((x) => (
            <li key={x.key}>
              <a href={x.href} className="tile">
                <FormIcon form={x.key} className="h-14 w-14 text-ink" />
                <span className="tile-name">{x.name}</span>
                {x.text && <span className="tile-text">{x.text}</span>}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-prose text-sm text-muted">{L.home.formsNote}</p>
      </section>

      <section className="band mt-24">
        <div className="wrap py-16">
          <h2 className="text-paper">{L.steps}</h2>
          <ol className="steps mt-10">
            {L.how.steps.map((s, i) => (
              <li key={i}>
                <span className="step-n" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-4 text-paper">{s.title}</h3>
                <p className="mt-2 text-[#cfe3df]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {countries.length > 0 && (
        <section className="wrap pt-20">
          <h2>{L.markets.title}</h2>
          <p className="mt-4 max-w-prose text-muted">{L.home.marketsLead}</p>
          <ul className="markets mt-8">
            {countries.map((c) => (
              <li key={c.id} lang={c.locale}>
                <a href={pathOf(c)}>
                  <span className="markets-code">{c.country}</span>
                  <span className="markets-title">{c.title}</span>
                  <span className="markets-auth">{L.markets.authority}: {AUTHORITY[c.country ?? ""] ?? "—"}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="wrap grid gap-12 pt-20 lg:grid-cols-2">
        <div className="pledge"><h2>{L.home.modelTitle}</h2><p className="mt-4 max-w-prose">{L.home.model}</p></div>
        <div className="pledge"><h2>{L.home.privacyTitle}</h2><p className="mt-4 max-w-prose">{L.home.privacy}</p></div>
      </section>

      <section className="wrap grid gap-10 pt-20 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h2 className="max-w-[16ch]">{L.close.title}</h2>
          <p className="lead mt-5">{L.close.text}</p>
        </div>
        <QuoteForm locale={locale} thanksPath={thanks ? pathOf(thanks) : "/"} privacyPath={legal ? pathOf(legal) : "/"} compact />
      </section>
    </>
  );
}
