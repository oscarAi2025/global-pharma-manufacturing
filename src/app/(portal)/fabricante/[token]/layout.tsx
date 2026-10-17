import "../../../globals.css";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Portal de fabricantes · Global Pharma Manufacturing" };
export default function M({ children }: { children: React.ReactNode }) { return <html lang="es"><body>{children}</body></html>; }
