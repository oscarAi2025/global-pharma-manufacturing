import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/config/site";
import { findPage } from "@/content/registry";
import { metadataFor } from "@/lib/seo";
import { PageShell } from "@/components/PageShell";
import { Home } from "@/components/views/Home";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const p = isLocale(locale) ? findPage(locale, []) : undefined;
  return p ? metadataFor(p) : {};
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const p = isLocale(locale) ? findPage(locale, []) : undefined;
  if (!p) notFound();
  return <PageShell locale={locale as Locale} page={p}><Home locale={locale as Locale} /></PageShell>;
}
