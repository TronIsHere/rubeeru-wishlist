import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "wl_admin";
const SESSION_DAYS = 7;

const sha256 = (v: string) => createHash("sha256").update(v).digest();

/** Locked (null) until ADMIN_PASSWORD is set. The signing key derives from it, so changing it signs everyone out. */
function password() {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

const sign = (pw: string, exp: number) => createHmac("sha256", sha256(`wl-admin:${pw}`)).update(String(exp)).digest("hex");

export const adminEnabled = () => password() !== null;

export function passwordMatches(input: string) {
  const pw = password();
  return pw !== null && timingSafeEqual(sha256(input), sha256(pw));
}

export async function startAdminSession() {
  const pw = password();
  if (!pw) return;
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  (await cookies()).set(COOKIE, `${exp}.${sign(pw, exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const pw = password();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!pw || !raw) return false;
  const [expStr, mac] = raw.split(".");
  const exp = Number(expStr);
  if (!mac || !Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = Buffer.from(sign(pw, exp));
  const given = Buffer.from(mac);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** For pages and server actions: sends anyone without a valid session to the login form. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
