import type { PageDoc } from "@/content/types";
import { t } from "@/content/ui";
import { pageOf, pathOf } from "@/content/registry";
import { QuoteForm } from "@/components/QuoteForm";

export function Quote({ page }: { page: PageDoc }) {
  const L = t(page.locale);
  const thanks = pageOf(page.locale, "thanks"), legal = pageOf(page.locale, "legal");
  return (
    <div className="wrap grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="max-w-[14ch]">{page.title}</h1>
        <p className="lead mt-6">{L.form.lead}</p>
        <p className="mt-6 max-w-prose text-muted">{L.home.model}</p>
      </div>
      <QuoteForm locale={page.locale} thanksPath={thanks ? pathOf(thanks) : "/"} privacyPath={legal ? pathOf(legal) : "/"} />
    </div>
  );
}
