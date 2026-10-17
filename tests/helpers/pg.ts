import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Db } from "@/server/db";

const DIR = "netlify/database/migrations";

/** Postgres real en memoria (PGlite) con todas las migraciones aplicadas en orden. */
export async function freshDb(): Promise<Db & { close(): Promise<void> }> {
  const pg = new PGlite();
  for (const f of readdirSync(DIR).sort()) {
    const p = join(DIR, f);
    const sql = statSync(p).isDirectory() ? readFileSync(join(p, "migration.sql"), "utf8") : readFileSync(p, "utf8");
    // PGlite no trae pgcrypto como extensión instalable; gen_random_uuid() es nativo desde Postgres 13.
    await pg.exec(sql.replace(/create extension if not exists pgcrypto;/i, ""));
  }
  return {
    query: (text, params) => pg.query(text, params) as never,
    close: () => pg.close(),
  };
}
