import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/theme";
import { BRAND } from "@/lib/brand";
import { THEME_COLORS } from "@/lib/theme";
import "./globals.css";

const iranSans = localFont({
  src: [
    { path: "../public/fonts/IRANSans-Light.woff", weight: "300", style: "normal" },
    { path: "../public/fonts/IRANSans-Reg.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/IRANSans-SemiBold.woff", weight: "600", style: "normal" },
    { path: "../public/fonts/IRANSans-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-iransans",
  display: "swap",
});

// Wordmark only
const lalezar = localFont({
  src: [{ path: "../public/fonts/Lalezar.woff2", weight: "400", style: "normal" }],
  variable: "--font-lalezar",
  display: "swap",
});

const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: `فهرست انتظار | ${BRAND.name}`,
  description: `${BRAND.name} هنوز در دسترسی محدود است. اسمتان را در فهرست انتظار بگذارید تا دعوت‌نامه برایتان برسد. ${BRAND.tagline}`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth" className={`${iranSans.variable} ${lalezar.variable} ${jetbrains.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
