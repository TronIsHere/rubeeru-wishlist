import { Captions, Clapperboard, Server } from "lucide-react";
import { fadeText, MistPanel } from "@/components/atmosphere";
import { FounderChip } from "@/components/founder";
import { JoinForm } from "@/components/join-form";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { BRAND } from "@/lib/brand";
import { waitlist } from "@/lib/server/db";
import { cn, fa, faNumber } from "@/lib/utils";
import { SHOW_COUNT_FROM } from "@/lib/waitlist";

const perks = [
  { icon: Clapperboard, text: "ضبط صفحه و چهره" },
  { icon: Captions, text: "زیرنویس فارسی خودکار" },
  { icon: Server, text: "سرور داخل ایران" },
];

export default async function Home({ searchParams }: PageProps<"/">) {
  const { ref } = await searchParams;
  // A DB hiccup must not take the signup page down; it only hides the counter.
  const count = await waitlist()
    .then((c) => c.estimatedDocumentCount())
    .catch(() => 0);

  return (
    <main className="flex flex-1 flex-col p-3 sm:p-4">
      <MistPanel className="flex min-h-[calc(100svh-1.5rem)] flex-1 flex-col rounded-[2rem] shadow-xl sm:min-h-[calc(100svh-2rem)] sm:rounded-[2.5rem]">
        <div className="flex min-h-[inherit] flex-col">
          <header className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
            <Logo tone="light" />
            <ThemeToggle className="border border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.14]" />
          </header>

          <section className="flex flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:px-8">
            <div className="relative flex w-full max-w-3xl flex-col items-center">
              {/* Dark scrim so the drifting mist never sits directly behind the headline */}
              <div className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10" style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.6), rgba(0,0,0,0.3) 60%, transparent)" }} aria-hidden />

              <FounderChip />

              <h1 className="mt-7 text-[clamp(2.2rem,6vw,4.25rem)] leading-[1.35] font-semibold">
                <span className="inline-block">سلام، من اروینم</span> <span className={cn("inline-block pb-1", fadeText)}>و {BRAND.name} رو می‌سازم</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                {BRAND.name} یه ابزاره برای ضبط صفحه و چهره با زیرنویس فارسی. هنوز بسته‌ست و دارم یکی‌یکی راه می‌دم. اسمتون رو بنویسین تا وقتی نوبتتون شد، خودم دعوت‌نامه رو براتون بفرستم.
              </p>

              <div className="mt-9 w-full">
                <JoinForm refCode={typeof ref === "string" ? ref : undefined} />
              </div>

              {count >= SHOW_COUNT_FROM && (
                <p className="mt-6 text-sm text-white/55">
                  <span className="font-semibold text-white/85" title={faNumber(count)}>
                    {fa(count)}
                  </span>{" "}
                  نفر تا حالا اسمشون رو نوشتن
                </p>
              )}
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 pb-7 sm:px-8">
            {perks.map((p) => (
              <span key={p.text} className="flex items-center gap-2 text-sm font-semibold text-white/45">
                <p.icon className="size-4" strokeWidth={1.75} aria-hidden />
                {p.text}
              </span>
            ))}
          </footer>
        </div>
      </MistPanel>
    </main>
  );
}
