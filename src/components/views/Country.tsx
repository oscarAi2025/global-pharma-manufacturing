import type { PageDoc } from "@/content/types";
import { t } from "@/content/ui";
import { pageOf, pathOf } from "@/content/registry";
import { Blocks, Inline } from "@/components/Blocks";
import { QuoteForm } from "@/components/QuoteForm";

const fmt = (d: string, l: string) => new Date(d + "T12:00:00Z").toLocaleDateString(l, { day: "numeric", month: "long", year: "numeric" });

export function Country({ page }: { page: PageDoc }) {
  const L = t(page.locale);
  const thanks = pageOf(page.locale, "thanks"), legal = pageOf(page.locale, "legal");
  return (
    <article className="wrap py-14">
      <header className="max-w-prose">
        <h1>{page.title}</h1>
        {page.lead && <p className="lead mt-6"><Inline text={page.lead} /></p>}
        <p className="mt-4 text-sm text-muted">{L.country.reviewed} {fmt(page.reviewedAt, page.locale)}</p>
      </header>
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
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
            <ul className="max-w-prose space-y-2">
              {page.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener" target="_blank">{s.label}</a></li>)}
            </ul>
          </section>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 font-semibold">{L.country.cta}</p>
          <QuoteForm locale={page.locale} thanksPath={thanks ? pathOf(thanks) : "/"} privacyPath={legal ? pathOf(legal) : "/"} compact />
        </aside>
      </div>
    </article>
  );
}
