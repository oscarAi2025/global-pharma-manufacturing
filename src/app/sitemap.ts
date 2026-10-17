import type { MetadataRoute } from "next";
import { absUrl, alternatesOf, isIndexable, pathOf, registry } from "@/content/registry";

export const dynamic = "force-static";

/** Solo páginas publicadas e indexables, con sus alternativas hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  return registry.filter(isIndexable).map((p) => {
    const alts = alternatesOf(p).filter((a) => a.hreflang !== "x-default");
    return {
      url: absUrl(pathOf(p)),
      lastModified: p.reviewedAt,
      alternates: alts.length ? { languages: Object.fromEntries(alts.map((a) => [a.hreflang, a.href])) } : undefined,
    };
  });
}
