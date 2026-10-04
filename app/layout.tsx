import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/theme";
import { BRAND, FOUNDER } from "@/lib/brand";
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

const title = `${BRAND.name} | لیست انتظار`;
const description = `من ${FOUNDER.name}م و ${BRAND.name} رو می‌سازم. هنوز بسته‌ست؛ اسمتون رو تو لیست انتظار بنویسین تا خودم دعوت‌نامه بفرستم.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3210"),
  title,
  description,
  authors: [{ name: FOUNDER.name, url: FOUNDER.url }],
  openGraph: { title, description, type: "website", locale: "fa_IR", images: [{ url: FOUNDER.photo, width: 400, height: 400, alt: FOUNDER.name }] },
  twitter: { card: "summary", title, description, creator: `@${FOUNDER.handle}`, images: [FOUNDER.photo] },
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
