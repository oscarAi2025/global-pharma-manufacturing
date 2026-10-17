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
  // Sociedad que opera la web y trata los datos (confirmada por el propietario el 17/10/2026). EIN y correo PENDIENTES.
  operator: {
    legalName: process.env.OPERATOR_LEGAL_NAME ?? "IA DEV INVESTMENTS LLC",
    taxId: process.env.OPERATOR_TAX_ID ?? "",
    address: process.env.OPERATOR_ADDRESS ?? "1209 Mountain Road Pl NE, Suite R, Albuquerque, NM 87110, Estados Unidos",
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
