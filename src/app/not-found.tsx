import "./globals.css";
import { locales, localeMeta } from "@/config/site";
import { t } from "@/content/ui";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="wrap py-24">
          <h1>404</h1>
          <p className="lead mt-4">This page doesn&apos;t exist or was removed.</p>
          <ul className="mt-8 space-y-2">
            {locales.map((l) => <li key={l} lang={localeMeta[l].htmlLang}><a href={`/${l}/`}>{t(l).home.title}</a></li>)}
          </ul>
        </main>
      </body>
    </html>
  );
}
