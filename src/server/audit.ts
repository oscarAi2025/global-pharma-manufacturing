import "server-only";
import type { Db } from "./db";

export async function audit(db: Db, actor: string, action: string, entity: string, entityId: string | null, data: Record<string, unknown> = {}) {
  await db.query("insert into audit_logs (actor, action, entity, entity_id, data) values ($1,$2,$3,$4,$5)", [actor, action, entity, entityId, JSON.stringify(data)]);
}
