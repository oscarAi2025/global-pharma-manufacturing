import type { PageDoc } from "@/content/types";
import { t } from "@/content/ui";
import { formsFor, pageOf, pathOf } from "@/content/registry";
import { publicManufacturers } from "@/server/public";
import { Directory } from "@/components/Directory";
import { FormIcon } from "@/components/Illustrations";
import { Blocks, Inline } from "@/components/Blocks";
import { QuoteForm } from "@/components/QuoteForm";

const fmt = (d: string, l: string) => new Date(d + "T12:00:00Z").toLocaleDateString(l, { day: "numeric", month: "long", year: "numeric" });

export async function Country({ page }: { page: PageDoc }) {
  const L = t(page.locale);
  const isForm = page.type === "form";
  const makers = isForm ? (await publicManufacturers()).filter((m) => m.forms.includes(page.form ?? "")) : [];
  const others = isForm ? formsFor(page.locale).filter((p) => p.form !== page.form) : [];
  const quote = pageOf(page.locale, "quote"); const dir = pageOf(page.locale, "directory");
  const thanks = pageOf(page.locale, "thanks"), legal = pageOf(page.locale, "legal");
  return (
    <article className="wrap py-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <header className="max-w-prose">
            {isForm && <FormIcon form={page.form ?? ""} className="mb-4 h-16 w-16 text-ink" />}
            <h1>{page.title}</h1>
            {page.lead && <p className="lead mt-6"><Inline text={page.lead} /></p>}
            <p className="mt-4 text-sm text-muted">{L.country.reviewed} {fmt(page.reviewedAt, page.locale)}</p>
          </header>
          <div className="mt-6">
            <Blocks blocks={page.body} />
            {page.faqs.length > 0 && (
              <section>
                <h2 className="mb-4 mt-14">{L.country.faqs}</h2>
                <div className="max-w-prose border-t border-rule">
                  {page.faqs.map((f, i) => (
                    <details key={i} className="border-b border-rule py-3">
                      <summary className="cursor-pointer font-semibold">{f.q}</summary>
                      <p className="mt-2 text-muted"><Inline text={f.a} /></p>
                    </details>
                  ))}
                </div>
              </section>
            )}
            <section>
              <h2 className="mb-4 mt-14">{L.country.sources}</h2>
              <ul className="max-w-prose space-y-2 text-sm">
                {page.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener" target="_blank">{s.label}</a></li>)}
              </ul>
            </section>
          </div>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 font-semibold">{isForm ? L.form.title : L.country.cta}</p>
          <QuoteForm locale={page.locale} thanksPath={thanks ? pathOf(thanks) : "/"} privacyPath={legal ? pathOf(legal) : "/"} compact />
        </aside>
      </div>
      {isForm && (
        <section className="mt-16">
          <h2>{L.dir.makers}</h2>
          <div className="mt-6"><Directory locale={page.locale} items={makers} quotePath={quote ? pathOf(quote) : "/"} initialForm={page.form} compact /></div>
          {dir && <p className="mt-4"><a href={pathOf(dir)}>{L.dir.seeAll}</a></p>}
        </section>
      )}
      {others.length > 0 && (
        <nav className="mt-16" aria-label={L.dir.related}>
          <h2>{L.dir.related}</h2>
          <ul className="tiles mt-6 sm:grid-cols-2 lg:grid-cols-4">{others.map((o) => (
            <li key={o.id}><a href={pathOf(o)} className="tile"><FormIcon form={o.form ?? ""} className="h-10 w-10 text-ink" /><span className="tile-name">{o.title}</span></a></li>))}
            {others.length % 4 !== 0 && quote && <li className="tile-cta" style={{ gridColumn: `span ${4 - (others.length % 4)}` }}><a href={pathOf(quote)} className="tile tile-dark"><span className="tile-name">{L.close.title}</span><span className="text-sm">{L.nav.quote}</span></a></li>}</ul>
        </nav>
      )}
    </article>
  );
}
