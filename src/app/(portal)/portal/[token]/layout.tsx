import "../../../globals.css";
import type { Metadata } from "next";
import { db, dbConfigured } from "@/server/db";
import { hashToken } from "@/server/crypto";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Global Pharma Manufacturing" };

export default async function PortalRoot({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  let lang = "en";
  if (dbConfigured()) {
    const r = (await (await db()).query<{ locale: string }>("select r.locale from portal_tokens t join manufacturing_requests r on r.id = t.request_id where t.token_hash = $1", [hashToken(token)])).rows[0];
    if (r) lang = r.locale === "pt" ? "pt-BR" : r.locale;
  }
  return <html lang={lang}><body>{children}</body></html>;
}
