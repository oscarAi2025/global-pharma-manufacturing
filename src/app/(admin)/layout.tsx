import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "CRM · Global Pharma Manufacturing", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body className="bg-paper">{children}</body></html>;
}
