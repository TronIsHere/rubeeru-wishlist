"use server";

import { headers } from "next/headers";
import { USE_LABEL } from "@/lib/waitlist";
import { waitlist, type WaitlistDoc } from "@/lib/server/db";
import { rateLimited } from "@/lib/server/rate-limit";

export type JoinState = {
  ok?: boolean;
  /** 1-based place in line; set on success, also when the person had already joined. */
  position?: number;
  already?: boolean;
  error?: string;
  field?: "name" | "email" | "x";
  values?: { name: string; email: string; x: string; use: string };
};

const str = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function parseEmail(raw: string): string | null {
  const email = raw.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null;
}

/** Accepts @handle, handle, x.com/handle, twitter.com/handle, or a numeric user id. */
function parseX(raw: string): string | null {
  let s = raw.trim();
  s = s.replace(/^https?:\/\//i, "");
  s = s.replace(/^(www\.)?(x|twitter)\.com\//i, "");
  s = s.replace(/^@/, "");
  s = s.split(/[/?#]/)[0] ?? "";
  if (/^\d{1,20}$/.test(s)) return s;
  if (/^[A-Za-z0-9_]{1,15}$/.test(s)) return s.toLowerCase();
  return null;
}

export async function joinWaitlist(_prev: JoinState, form: FormData): Promise<JoinState> {
  const name = str(form.get("name"), 80);
  const emailRaw = str(form.get("email"), 120);
  const xRaw = str(form.get("x"), 120);
  const use = str(form.get("use"), 20);
  const values = { name, email: emailRaw, x: xRaw, use };

  // Bots fill the hidden field. They get the normal success screen and nothing is stored.
  if (str(form.get("company"), 50)) return { ok: true, position: 1 };

  if (name.length < 2) return { error: "نام و نام خانوادگی را وارد کنید.", field: "name", values };
  const email = parseEmail(emailRaw);
  if (!email) return { error: "ایمیل درست نیست.", field: "email", values };
  const x = parseX(xRaw);
  if (!x) return { error: "حساب یا شناسهٔ X درست نیست.", field: "x", values };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (rateLimited(`join:${ip}`, 6, 60 * 60_000)) return { error: "تلاش‌های زیادی از این شبکه ثبت شد. کمی بعد دوباره امتحان کنید.", values };

  const ref = str(form.get("ref"), 40).replace(/[^\w.-]/g, "");
  const key = `email:${email}`;
  const col = await waitlist();
  const doc: Omit<WaitlistDoc, "_id"> = {
    name,
    email,
    x,
    key,
    ...(use in USE_LABEL ? { use } : {}),
    ...(ref ? { ref } : {}),
    status: "pending",
    createdAt: new Date(),
  };

  let already = false;
  let createdAt = doc.createdAt;
  try {
    await col.insertOne(doc as WaitlistDoc);
  } catch (e) {
    if ((e as { code?: number }).code !== 11000) throw e;
    // Same email or X again: show their original place instead of an error.
    already = true;
    const existing = await col.findOne({ $or: [{ key }, { x }] }, { projection: { createdAt: 1 } });
    if (existing) createdAt = existing.createdAt;
  }

  const position = await col.countDocuments({ createdAt: { $lte: createdAt } });
  return { ok: true, position, already };
}
