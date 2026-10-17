import { z } from "zod";
import { locales } from "@/config/site";

/** Registro maestro de páginas: solo las «published» se generan y entran en el sitemap. */
export const pageStatus = ["draft", "data_pending", "review", "approved", "published", "needs_update", "noindex", "archived"] as const;

const inline = z.string().min(1);
export const blockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("h2"), text: inline, id: z.string().optional() }),
  z.object({ kind: z.literal("p"), text: inline }),
  z.object({ kind: z.literal("list"), items: z.array(inline).min(1) }),
  z.object({ kind: z.literal("steps"), items: z.array(z.object({ title: inline, text: inline })).min(2) }),
  z.object({ kind: z.literal("table"), head: z.array(inline).min(2), rows: z.array(z.array(z.string())).min(1) }),
  z.object({ kind: z.literal("note"), text: inline }),
]);
export type Block = z.infer<typeof blockSchema>;

export const pageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Páginas equivalentes en otros idiomas comparten grupo (base del hreflang). */
  group: z.string(),
  locale: z.enum(locales),
  /** Segmentos tras el idioma; [] es la portada del idioma. */
  slug: z.array(z.string().regex(/^[a-z0-9-]+$/)),
  type: z.enum(["home", "country", "form", "how", "quote", "thanks", "legal"]),
  /** Clave de forma farmacéutica (páginas de tipo «form»). */
  form: z.string().optional(),
  status: z.enum(pageStatus),
  title: z.string().min(5),
  metaTitle: z.string().min(10).max(65),
  description: z.string().min(70).max(165),
  primaryKeyword: z.string().optional(),
  intent: z.enum(["transactional", "commercial", "informational", "navigational"]),
  cluster: z.string(),
  country: z.string().optional(),
  reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  editor: z.string(),
  lead: z.string().optional(),
  body: z.array(blockSchema).default([]),
  faqs: z.array(z.object({ q: z.string().min(5), a: z.string().min(10) })).default([]),
  /** Fuentes oficiales citadas en la página (se muestran como referencias normativas). */
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
});
export type PageDoc = z.infer<typeof pageSchema>;
export type PageInput = z.input<typeof pageSchema>;
