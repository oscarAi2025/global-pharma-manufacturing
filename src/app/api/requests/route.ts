import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/server/db";
import { createRequest, requestInput } from "@/server/requests";

export const dynamic = "force-dynamic";

// Límite simple por instancia (las funciones se reciclan; Netlify Forms y el honeypot cubren el resto).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), win = 10 * 60_000;
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for") ?? "?";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }
  if (body["bot-field"]) return NextResponse.json({ ok: true, ref: null }); // honeypot
  const parsed = requestInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  if (!dbConfigured()) return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  try {
    const r = await createRequest(await db(), parsed.data);
    return NextResponse.json({ ok: true, ref: r.ref, portal: `/portal/${r.token}/` }, { status: 201 });
  } catch (e) {
    console.error("createRequest", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
