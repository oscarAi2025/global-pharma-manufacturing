import type { Metadata } from "next";
import { site, localeMeta } from "@/config/site";
import { absUrl, alternatesOf, isIndexable, pathOf, pageOf } from "@/content/registry";
import type { PageDoc } from "@/content/types";

export function metadataFor(p: PageDoc): Metadata {
  const url = absUrl(pathOf(p));
  const languages = Object.fromEntries(alternatesOf(p).map((a) => [a.hreflang, a.href]));
  return {
    title: p.metaTitle,
    description: p.description,
    alternates: { canonical: url, languages: Object.keys(languages).length ? languages : undefined },
    robots: isIndexable(p) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { type: "website", url, title: p.metaTitle, description: p.description, siteName: site.name, locale: localeMeta[p.locale].ogLocale },
    twitter: { card: "summary", title: p.metaTitle, description: p.description },
  };
}

type Json = Record<string, unknown>;

/** Datos estructurados solo de lo que existe: sin reseñas, precios ni empresas inventadas. */
export function jsonLdFor(p: PageDoc): Json[] {
  const url = absUrl(pathOf(p));
  const org: Json = { "@type": "Organization", "@id": `${site.url}/#org`, name: site.name, url: site.url };
  if (site.operator.legalName) org.legalName = site.operator.legalName;
  const out: Json[] = [];
  if (p.type === "home") {
    out.push({ "@context": "https://schema.org", ...org });
    out.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: localeMeta[p.locale].htmlLang, publisher: { "@id": `${site.url}/#org` } });
  }
  if (p.slug.length) {
    const home = pageOf(p.locale, "home");
    const items = [
      { "@type": "ListItem", position: 1, name: site.name, item: home ? absUrl(pathOf(home)) : site.url },
      { "@type": "ListItem", position: 2, name: p.title, item: url },
    ];
    out.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
  }
  if (p.type === "country") {
    out.push({
      "@context": "https://schema.org", "@type": "Service", name: p.title, serviceType: "Contract manufacturing sourcing",
      areaServed: p.country, provider: { "@id": `${site.url}/#org` }, url, inLanguage: localeMeta[p.locale].htmlLang,
    });
  }
  if (p.faqs.length) {
    out.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return out;
}
