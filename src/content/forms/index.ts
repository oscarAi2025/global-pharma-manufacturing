import type { PageInput } from "../types";
import { z } from "zod";
import { blockSchema } from "../types";

/** Páginas por forma farmacéutica: un JSON por forma con las tres versiones (EN/ES/PT) y sus fuentes. */
const localeSchema = z.object({
  slug: z.string(), title: z.string(), metaTitle: z.string(), description: z.string(), lead: z.string(),
  body: z.array(blockSchema), faqs: z.array(z.object({ q: z.string(), a: z.string() })),
});
const fileSchema = z.object({
  key: z.string(), sources: z.array(z.object({ label: z.string(), url: z.string().url() })),
  locales: z.object({ en: localeSchema, es: localeSchema, pt: localeSchema }),
});

import tablets from "./tablets.json";
import capsules from "./capsules.json";
import softgels from "./softgels.json";
import gummies from "./gummies.json";
import powders from "./powders.json";
import liquids from "./liquids.json";
import topicals from "./topicals.json";
import privateLabel from "./private-label.json";

const files: unknown[] = [capsules, tablets, softgels, gummies, powders, liquids, topicals, privateLabel];

const PREFIX = { en: "manufacturing", es: "fabricacion", pt: "fabricacao" } as const;

export const formPages: PageInput[] = files.flatMap((raw) => {
  const f = fileSchema.parse(raw);
  return (["en", "es", "pt"] as const).map((l) => {
    const c = f.locales[l];
    return {
      id: `form-${f.key}-${l}`, group: `form-${f.key}`, locale: l, slug: [PREFIX[l], c.slug], type: "form" as const, form: f.key,
      status: "published" as const, intent: "commercial" as const, cluster: `form-${f.key}`, title: c.title, metaTitle: c.metaTitle,
      description: c.description, lead: c.lead, body: c.body, faqs: c.faqs, sources: f.sources, reviewedAt: "2026-10-17",
      editor: l === "pt" ? "Equipe editorial" : l === "en" ? "Editorial team" : "Equipo editorial",
    };
  });
});
