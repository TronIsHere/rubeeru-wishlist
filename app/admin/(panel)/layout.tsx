import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { requireAdmin } from "@/lib/server/admin-auth";
import { logout } from "../actions";

export const metadata = { title: "پنل مدیریت", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo href="/admin" />
            <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent sm:inline">فهرست انتظار</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-muted-foreground hover:bg-muted hover:text-foreground" />
            <form action={logout}>
              <button type="submit" className="flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <LogOut className="size-4" aria-hidden />
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
