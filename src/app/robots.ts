import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Las vistas previas de Netlify (deploy previews) no deben indexarse: se controla con SITE_ENV.
  const prod = process.env.SITE_ENV === "production";
  return {
    rules: prod ? [{ userAgent: "*", allow: "/" }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
