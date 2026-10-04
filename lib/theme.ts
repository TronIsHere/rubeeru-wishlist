export type ThemePref = "system" | "light" | "dark";

export const THEME_KEY = "rubeeru:theme";

/** Light/dark browser chrome; matches --background in globals.css. */
export const THEME_COLORS = { light: "#fafafa", dark: "#050507" } as const;

/**
 * Runs in <head> before first paint so a dark-mode visitor never sees a light flash.
 * Rendered by ThemeScript; keep in sync with applyTheme in components/theme.tsx.
 */
export const themeScript = `(function(){try{var p=localStorage.getItem("${THEME_KEY}");var d=p==="dark"||(p!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
