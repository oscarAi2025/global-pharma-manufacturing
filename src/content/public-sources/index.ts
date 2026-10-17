import { z } from "zod";

/**
 * Fabricantes identificados en registros oficiales (INVIMA, AESAN/AEMPS…). Datos tal como los publica la fuente.
 * NO son fabricantes asociados: se muestran con la etiqueta «Identificado en fuentes públicas · sin acuerdo».
 */
export const sourceFileSchema = z.object({
  source: z.object({ name: z.string(), url: z.string().url(), retrieved: z.string(), publisherDate: z.string().optional() }),
  items: z.array(z.object({
    country: z.string(), city: z.string().optional(), region: z.string().optional(),
    scope: z.enum(["supplements", "medicines", "both"]),
    forms: z.array(z.string()).default([]),
    areas: z.array(z.string()).default([]),
    certificate: z.string().optional(), validUntil: z.string().optional(),
  })),
});
export type SourceFile = z.infer<typeof sourceFileSchema>;

const files: unknown[] = [];
export const publicSources: SourceFile[] = files.map((f) => sourceFileSchema.parse(f));
