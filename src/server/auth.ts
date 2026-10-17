import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeEqual, sign, unsign } from "./crypto";

const COOKIE = "gpm_admin";
const TTL_H = 12;

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);

export function checkPassword(pw: string): boolean {
  return adminConfigured() && safeEqual(pw, process.env.ADMIN_PASSWORD!);
}

export async function startSession() {
  const exp = Date.now() + TTL_H * 3600_000;
  (await cookies()).set(COOKIE, sign(`admin|${exp}`, process.env.SESSION_SECRET!), {
    httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: TTL_H * 3600,
  });
}

export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  const raw = v ? unsign(v, process.env.SESSION_SECRET!) : null;
  if (!raw) return false;
  const exp = Number(raw.split("|")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login/");
}
