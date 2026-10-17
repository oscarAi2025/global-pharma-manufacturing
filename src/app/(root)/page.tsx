import type { Metadata } from "next";
import { site, locales, localeMeta } from "@/config/site";
import { pageOf, pathOf, absUrl } from "@/content/registry";
import { t } from "@/content/ui";

/** Raíz: selector de idioma sin redirección por IP. La portada inglesa es la versión x-default. */
export const metadata: Metadata = {
  title: site.name,
  description: "Supplement and pharmaceutical contract manufacturing sourcing. Choose your language.",
  robots: { index: false, follow: true },
  alternates: { canonical: absUrl("/en/") },
};

export default function Root() {
  return (
    <main className="wrap flex min-h-screen flex-col justify-center py-16">
      <h1 style={{ fontStretch: "72%", fontWeight: 780, fontSize: "1.5rem" }}>{site.name}</h1>
      <ul className="mt-8 space-y-6">
        {locales.map((l) => {
          const h = pageOf(l, "home");
          return (
            <li key={l} lang={localeMeta[l].htmlLang}>
              <a href={h ? pathOf(h) : `/${l}/`} hrefLang={localeMeta[l].htmlLang} className="text-ink no-underline">
                <span className="block text-sm font-semibold text-muted">{localeMeta[l].label}</span>
                <span className="block text-2xl font-bold underline decoration-1 underline-offset-4" style={{ fontStretch: "80%" }}>{t(l).home.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
