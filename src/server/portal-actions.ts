"use server";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { manufacturerCapabilities, manufacturerQuote } from "./portal";
import { addBuyerMessage } from "./requests";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function postBuyerMessage(f: FormData) {
  const token = s(f, "token"); const body = s(f, "body");
  if (token && body) await addBuyerMessage(await db(), token, body);
  revalidatePath(`/portal/${token}/`);
}
export async function postManufacturerQuote(f: FormData) {
  const token = s(f, "token");
  const amount = s(f, "amount") ? Number(s(f, "amount").replace(",", ".")) : null;
  await manufacturerQuote(await db(), token, s(f, "request_id"), { amount, currency: s(f, "currency"), moq: s(f, "moq"), lead_time: s(f, "lead_time"), notes: s(f, "notes") });
  revalidatePath(`/fabricante/${token}/`);
}
export async function postCapabilities(f: FormData) {
  const token = s(f, "token");
  await manufacturerCapabilities(await db(), token, f.getAll("dosage_forms").map(String), s(f, "moq_notes"));
  revalidatePath(`/fabricante/${token}/`);
}
