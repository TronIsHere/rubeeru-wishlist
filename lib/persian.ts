/**
 * Iranian mobile-number helpers (from the VibeFarsi `persian` registry item, mobile section only).
 * Accept Persian or Latin digits everywhere.
 */
import { en } from "./utils";

/** Normalizes «۰۹۱۲…», «+98912…», «0098912…» to the 10-digit form «912…». */
export function normalizeIranMobile(input: string): string {
  let d = en(input).replace(/\D/g, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98") && d.length > 10) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

export function isIranMobile(input: string): boolean {
  return /^9\d{9}$/.test(normalizeIranMobile(input));
}

/** «912 345 6789»: three groups, always LTR. */
export function formatIranMobile(input: string): string {
  const d = normalizeIranMobile(input);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}

const OPERATORS: [RegExp, string][] = [
  [/^(91\d|99[0-6])/, "همراه اول"],
  [/^(93[0-9]|90[1-5])/, "ایرانسل"],
  [/^92[0-2]/, "رایتل"],
  [/^998/, "شاتل موبایل"],
  [/^999/, "سامانتل"],
];

export function mobileOperator(input: string): string | null {
  const d = normalizeIranMobile(input);
  if (d.length < 3) return null;
  return OPERATORS.find(([re]) => re.test(d))?.[1] ?? null;
}
