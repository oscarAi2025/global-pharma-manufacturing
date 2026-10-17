import type { PageDoc } from "@/content/types";
import { t } from "@/content/ui";
import { pageOf, pathOf } from "@/content/registry";
import { Blocks } from "@/components/Blocks";

export function How({ page }: { page: PageDoc }) {
  const L = t(page.locale);
  const q = pageOf(page.locale, "quote");
  return (
    <article className="wrap py-14">
      <h1>{page.title}</h1>
      <Blocks blocks={[{ kind: "steps", items: L.how.steps }]} />
      <h2 className="mt-14">{L.home.modelTitle}</h2>
      <p className="mt-4 max-w-prose">{L.home.model}</p>
      <h2 className="mt-14">{L.home.privacyTitle}</h2>
      <p className="mt-4 max-w-prose">{L.home.privacy}</p>
      {q && <p className="mt-10"><a className="btn" href={pathOf(q)}>{L.nav.quote}</a></p>}
    </article>
  );
}
