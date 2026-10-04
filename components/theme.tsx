"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { THEME_KEY, themeScript, type ThemePref } from "@/lib/theme";
import { cn } from "@/lib/utils";

/* Theme preference, remembered per browser. No stored choice follows the OS. */
const listeners = new Set<() => void>();
const darkQuery = () => matchMedia("(prefers-color-scheme: dark)");

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function applyTheme(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && darkQuery().matches);
  document.documentElement.classList.toggle("dark", dark);
}

function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {}
  applyTheme(pref);
  listeners.forEach((l) => l());
}

/** Sets the theme class before first paint; the script type flips on the client so React doesn't warn about it. */
export function ThemeScript() {
  useEffect(() => {
    applyTheme(readPref());
    const mq = darkQuery();
    const onOs = () => {
      if (readPref() !== "system") return;
      applyTheme("system");
      listeners.forEach((l) => l());
    };
    mq.addEventListener("change", onOs);
    return () => mq.removeEventListener("change", onOs);
  }, []);
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  // The <html> class is the source of truth ("system" resolves through the OS).
  const isDark = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const Icon = isDark ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setThemePref(isDark ? "light" : "dark")}
      aria-label={isDark ? "حالت روشن" : "حالت تیره"}
      className={cn("grid size-10 cursor-pointer place-items-center rounded-full transition-colors", className)}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
