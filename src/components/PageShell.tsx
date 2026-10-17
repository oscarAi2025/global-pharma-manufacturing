import type { Locale } from "@/config/site";
import type { PageDoc } from "@/content/types";
import { jsonLdFor } from "@/lib/seo";
import { Footer, Header } from "./Chrome";

export function PageShell({ locale, page, children }: { locale: Locale; page: PageDoc; children: React.ReactNode }) {
  const ld = jsonLdFor(page);
  return (
    <>
      <Header locale={locale} current={page} />
      <main id="main">{children}</main>
      <Footer locale={locale} />
      {ld.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
