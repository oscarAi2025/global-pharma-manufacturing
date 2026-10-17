/**
 * Marca y datos del operador en un único sitio: cambiar el nombre o el dominio no exige tocar el código.
 * Los campos marcados como PENDIENTE deben completarse antes de publicar en producción.
 */
export const site = {
  name: "Global Pharma Manufacturing", // nombre provisional
  shortName: "GPM",
  // Dominio definitivo PENDIENTE. Se usa para canonical, hreflang y sitemap.
  url: (process.env.SITE_URL ?? "https://global-pharma-manufacturing.netlify.app").replace(/\/$/, ""),
  contactEmail: process.env.CONTACT_EMAIL ?? "",
  // Sociedad que opera la web y trata los datos (aviso legal y privacidad). PENDIENTE de confirmar por el propietario.
  operator: {
    legalName: process.env.OPERATOR_LEGAL_NAME ?? "",
    taxId: process.env.OPERATOR_TAX_ID ?? "",
    address: process.env.OPERATOR_ADDRESS ?? "",
  },
  // Porcentaje que se registra por defecto en acuerdos nuevos; nunca se muestra como tarifa aceptada.
  defaultCommissionPct: 3,
} as const;

export const locales = ["es", "pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en"; // x-default

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  es: { label: "Español", htmlLang: "es", ogLocale: "es_ES" },
  pt: { label: "Português", htmlLang: "pt-BR", ogLocale: "pt_BR" },
  en: { label: "English", htmlLang: "en", ogLocale: "en_US" },
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
