import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { isAdmin } from "@/lib/server/admin-auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "ورود مدیر", robots: { index: false, follow: false } };

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
      <ThemeToggle className="absolute end-4 top-4 border border-border bg-card text-muted-foreground hover:text-foreground" />
      <Logo />
      <h1 className="mt-8 text-2xl font-semibold">ورود به پنل مدیریت</h1>
      <p className="mt-2 text-sm text-muted-foreground">فهرست انتظار روبه‌رو</p>
      <LoginForm />
    </main>
  );
}
