import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/site";
import { builtPages, findPage } from "@/content/registry";
import { metadataFor } from "@/lib/seo";
import { PageShell } from "@/components/PageShell";
import { Country } from "@/components/views/Country";
import { How } from "@/components/views/How";
import { Quote } from "@/components/views/Quote";
import { Thanks } from "@/components/views/Thanks";
import { Legal } from "@/components/views/Legal";
import { DirectoryView } from "@/components/views/DirectoryView";

type P = { params: Promise<{ locale: string; slug: string[] }> };
export const dynamicParams = false;
// El directorio lee la base de datos: se regenera cada 10 minutos (ISR).
export const revalidate = 600;

export function generateStaticParams() {
  return builtPages().filter((p) => p.slug.length).map((p) => ({ locale: p.locale, slug: p.slug }));
}

async function load({ params }: P) {
  const { locale, slug } = await params;
  return isLocale(locale) ? findPage(locale, slug) : undefined;
}

export async function generateMetadata(props: P) {
  const p = await load(props);
  return p ? metadataFor(p) : {};
}

export default async function Page(props: P) {
  const p = await load(props);
  if (!p) notFound();
  const l = p.locale as Locale;
  const view = { country: <Country page={p} />, form: <Country page={p} />, directory: <DirectoryView page={p} />, how: <How page={p} />, quote: <Quote page={p} />, thanks: <Thanks page={p} />, legal: <Legal page={p} />, home: null }[p.type];
  return <PageShell locale={l} page={p}>{view}</PageShell>;
}
