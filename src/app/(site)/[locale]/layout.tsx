import "../../globals.css";
import { notFound } from "next/navigation";
import { isLocale, localeMeta, locales } from "@/config/site";

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={localeMeta[locale].htmlLang}>
      <body>{children}</body>
    </html>
  );
}
