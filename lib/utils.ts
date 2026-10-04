import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: { theme: { shadow: ["accent", "accent-lg"] } },
});

export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Latin digits → Persian: 1405 → ۱۴۰۵ */
export function fa(value: string | number) {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Persian / Arabic-Indic digits → Latin, for parsing user input. */
export function en(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Thousands-separated with «٬»: 12450 → ۱۲٬۴۵۰ */
export function faNumber(value: number) {
  return fa(Math.round(value).toLocaleString("en-US")).replace(/,/g, "٬");
}

/** Solar Hijri date and time, e.g. «۱۴ مهر ۱۴۰۵، ۱۸:۳۰». */
export function faDateTime(date: Date) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
