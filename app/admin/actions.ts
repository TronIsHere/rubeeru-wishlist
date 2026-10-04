"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminEnabled, endAdminSession, passwordMatches, requireAdmin, startAdminSession } from "@/lib/server/admin-auth";
import { waitlist } from "@/lib/server/db";
import { rateLimited } from "@/lib/server/rate-limit";
import type { WaitStatus } from "@/lib/waitlist";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminEnabled()) return { error: "رمز مدیر تنظیم نشده. ADMIN_PASSWORD را در env بگذارید." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (rateLimited(`login:${ip}`, 5, 15 * 60_000)) return { error: "تلاش‌های ناموفق زیاد شد. ۱۵ دقیقه بعد دوباره امتحان کنید." };

  const input = form.get("password");
  if (typeof input !== "string" || !passwordMatches(input)) return { error: "رمز درست نیست." };

  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin/login");
}

function toIds(ids: string[]) {
  return ids.filter((id) => ObjectId.isValid(id)).slice(0, 500).map((id) => new ObjectId(id));
}

export async function setStatus(ids: string[], status: WaitStatus) {
  await requireAdmin();
  if (!["pending", "invited", "rejected"].includes(status)) return;
  const now = new Date();
  await (await waitlist()).updateMany(
    { _id: { $in: toIds(ids) } },
    status === "invited" ? { $set: { status, updatedAt: now, invitedAt: now } } : { $set: { status, updatedAt: now }, $unset: { invitedAt: "" } },
  );
  revalidatePath("/admin");
}

export async function removeEntries(ids: string[]) {
  await requireAdmin();
  await (await waitlist()).deleteMany({ _id: { $in: toIds(ids) } });
  revalidatePath("/admin");
}
