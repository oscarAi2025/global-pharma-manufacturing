import { requireAdmin } from "@/server/auth";
import { dbConfigured } from "@/server/db";
import { logout } from "@/server/actions";

export const dynamic = "force-dynamic";

export default async function SecureLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-rule bg-sheet">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <a href="/admin/" className="font-bold text-ink no-underline" style={{ fontStretch: "75%" }}>GPM · CRM</a>
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="/admin/requests/">Solicitudes</a><a href="/admin/manufacturers/">Fabricantes</a><a href="/admin/commissions/">Comisiones</a>
            <a href="/admin/export/requests/">Exportar solicitudes</a>
          </nav>
          <form action={logout} className="ml-auto"><button className="text-sm text-muted underline">Salir</button></form>
        </div>
      </header>
      <main className="wrap py-8">
        {!dbConfigured() && <p className="mb-6 border-l-4 border-amber bg-sheet px-4 py-3">La base de datos no está conectada en este entorno. Activa Netlify Database en el proyecto.</p>}
        {dbConfigured() && children}
      </main>
    </div>
  );
}
