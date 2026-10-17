import { site, locales, localeMeta, type Locale } from "@/config/site";
import { t } from "@/content/ui";
import { pageOf, pathOf } from "@/content/registry";
import type { PageDoc } from "@/content/types";

const href = (l: Locale, g: string) => { const p = pageOf(l, g); return p ? pathOf(p) : `/${l}/`; };

export function Header({ locale, current }: { locale: Locale; current?: PageDoc }) {
  const L = t(locale);
  return (
    <header className="border-b border-rule bg-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-sheet focus:p-2">{L.skip}</a>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <a href={href(locale, "home")} className="text-ink no-underline" style={{ fontStretch: "72%", fontWeight: 780, fontSize: "1.3rem", letterSpacing: "-0.01em" }}>
          {site.name}
        </a>
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.98rem]">
          <a className="text-ink no-underline hover:underline" href={href(locale, "how")}>{L.nav.how}</a>
          <a className="btn !px-4 !py-2" href={href(locale, "quote")}>{L.nav.quote}</a>
          <LangSwitch locale={locale} current={current} />
        </nav>
      </div>
    </header>
  );
}

function LangSwitch({ locale, current }: { locale: Locale; current?: PageDoc }) {
  return (
    <ul className="flex gap-3 text-sm" aria-label="Idioma / Language">
      {locales.filter((l) => l !== locale).map((l) => {
        const eq = current ? pageOf(l, current.group) : undefined;
        return (
          <li key={l}><a lang={localeMeta[l].htmlLang} hrefLang={localeMeta[l].htmlLang} href={eq ? pathOf(eq) : `/${l}/`} className="text-muted">{localeMeta[l].label}</a></li>
        );
      })}
    </ul>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const L = t(locale);
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="wrap flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p className="max-w-prose">{L.footer.note}</p>
        <p><a href={href(locale, "legal")} className="text-muted">{L.footer.legal}</a></p>
      </div>
    </footer>
  );
}
