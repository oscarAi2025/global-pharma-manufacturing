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
      <div className="wrap flex items-center justify-between gap-4 py-3 md:py-4">
        <a href={href(locale, "home")} className="brand text-ink no-underline">
          {site.name}
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-x-5 text-[0.98rem] md:flex">
          <a className="text-ink no-underline hover:underline" href={href(locale, "directory")}>{L.nav.makers}</a>
          <a className="text-ink no-underline hover:underline" href={href(locale, "how")}>{L.nav.how}</a>
          <a className="btn !px-4 !py-2" href={href(locale, "quote")}>{L.nav.quote}</a>
          <LangSwitch locale={locale} current={current} />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <a className="btn whitespace-nowrap !px-3 !py-2 text-sm" href={href(locale, "quote")}>{L.nav.quoteShort}</a>
          <details className="menu">
            <summary aria-label="Menú"><span /><span /><span /></summary>
            <div className="menu-panel">
              <a href={href(locale, "directory")}>{L.nav.makers}</a>
              <a href={href(locale, "how")}>{L.nav.how}</a>
              <LangSwitch locale={locale} current={current} />
            </div>
          </details>
        </div>
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
