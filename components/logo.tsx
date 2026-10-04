import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Viewfinder mark, identical to the main app (public/logo.svg). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-9 place-items-center overflow-hidden rounded-xl bg-ink ring-1 ring-inset ring-white/10", className)}>
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
        <path d="M24 38V30a6 6 0 0 1 6-6h8M62 24h8a6 6 0 0 1 6 6v8M76 62v8a6 6 0 0 1-6 6h-8M38 76h-8a6 6 0 0 1-6-6v-8" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="17" fill="none" stroke="#fff" strokeWidth="3" opacity="0.25" />
        <circle cx="50" cy="50" r="10" className="fill-rec" />
      </svg>
    </span>
  );
}

export function Logo({ className, tone = "dark", href = "/" }: { className?: string; tone?: "dark" | "light"; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 rounded-lg", className)} aria-label={`${BRAND.name}، صفحه‌ی اصلی`}>
      <LogoMark />
      <span className={cn("font-brand text-2xl leading-none", tone === "light" ? "text-white" : "text-foreground")}>{BRAND.name}</span>
    </Link>
  );
}
