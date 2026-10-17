import { site, type Locale, defaultLocale } from "@/config/site";
import { corePages } from "./core-pages";
import { countryPages } from "./country-pages";
import { pageSchema, type PageDoc, type PageInput } from "./types";

/** Valida el registro completo: falla el build ante páginas inválidas, ids o rutas repetidas, o grupos inconsistentes. */
export function buildRegistry(input: PageInput[]): PageDoc[] {
  const pages = input.map((p) => {
    const r = pageSchema.safeParse(p);
    if (!r.success) throw new Error(`Página inválida «${p.id}»: ${r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    return r.data;
  });
  const seen = new Set<string>();
  const paths = new Set<string>();
  const groupLocale = new Set<string>();
  for (const p of pages) {
    if (seen.has(p.id)) throw new Error(`Id repetido: ${p.id}`);
    seen.add(p.id);
    const path = pathOf(p);
    if (paths.has(path)) throw new Error(`Ruta repetida: ${path}`);
    paths.add(path);
    const gl = `${p.group}|${p.locale}`;
    if (groupLocale.has(gl)) throw new Error(`El grupo «${p.group}» tiene dos páginas en ${p.locale}`);
    groupLocale.add(gl);
    if (p.type === "country" && p.status === "published" && (p.body.length < 6 || p.sources.length < 2))
      throw new Error(`«${p.id}» no tiene contenido o fuentes suficientes para publicarse`);
  }
  return pages;
}

export const registry: PageDoc[] = buildRegistry([...corePages, ...countryPages]);

/** Se generan las publicadas y las noindex (gracias, aviso legal). El resto no existe en el sitio. */
export const isBuilt = (p: PageDoc) => p.status === "published" || p.status === "noindex";
export const isIndexable = (p: PageDoc) => p.status === "published";

export function pathOf(p: Pick<PageDoc, "locale" | "slug">): string {
  return `/${p.locale}/${p.slug.length ? p.slug.join("/") + "/" : ""}`;
}
export const absUrl = (path: string) => `${site.url}${path}`;

export function builtPages(): PageDoc[] {
  return registry.filter(isBuilt);
}

export function findPage(locale: Locale, slug: string[]): PageDoc | undefined {
  return builtPages().find((p) => p.locale === locale && p.slug.join("/") === slug.join("/"));
}

export function pageOf(locale: Locale, group: string): PageDoc | undefined {
  return builtPages().find((p) => p.locale === locale && p.group === group);
}

/** Alternativas hreflang: solo versiones equivalentes (mismo grupo) y construidas. x-default → inglés si existe. */
export function alternatesOf(p: PageDoc): { hreflang: string; href: string }[] {
  const siblings = builtPages().filter((o) => o.group === p.group && isIndexable(o) === isIndexable(p));
  if (siblings.length < 2) return [];
  const out = siblings.map((o) => ({ hreflang: o.locale === "pt" ? "pt-BR" : o.locale, href: absUrl(pathOf(o)) }));
  const def = siblings.find((o) => o.locale === defaultLocale);
  if (def) out.push({ hreflang: "x-default", href: absUrl(pathOf(def)) });
  return out;
}

export function countriesFor(locale: Locale): PageDoc[] {
  const all = registry.filter((p) => p.type === "country" && isIndexable(p));
  const own = all.filter((p) => p.locale === locale);
  return own.length ? own : all; // en inglés aún no hay páginas por país: se enlazan las de ES/PT
}
