import "server-only";

/** Interfaz mínima de consulta: la cumplen pg.Pool, el Pool de Neon y PGlite (pruebas). */
export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

let cached: Db | null = null;
let override: Db | null = null;

/** Solo para pruebas: inyecta una base de datos en memoria. */
export function setDbForTests(db: Db | null) { override = db; }

export async function db(): Promise<Db> {
  if (override) return override;
  if (cached) return cached;
  const { getDatabase } = await import("@netlify/database");
  const conn = getDatabase();
  cached = { query: (text, params) => conn.pool.query(text, params as unknown[]) as never };
  return cached;
}

export function dbConfigured(): boolean {
  return Boolean(override || process.env.NETLIFY_DB_URL || process.env.NETLIFY_DATABASE_URL);
}
