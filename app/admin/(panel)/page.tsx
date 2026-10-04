import { Download, Search } from "lucide-react";
import Link from "next/link";
import type { Filter } from "mongodb";
import { waitlist, type WaitlistDoc } from "@/lib/server/db";
import { cn, fa, faNumber } from "@/lib/utils";
import { STATUS_LABEL, type WaitStatus } from "@/lib/waitlist";
import { WaitlistTable, type Row } from "./waitlist-table";

const PAGE_SIZE = 50;
const STATUSES = Object.keys(STATUS_LABEL) as WaitStatus[];

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Stable URL builder so filters, search and paging keep each other. */
function href(params: { status?: string; q?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const statusRaw = first(sp.status);
  const status = STATUSES.find((s) => s === statusRaw);
  const q = first(sp.q).trim().slice(0, 80);
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  const filter: Filter<WaitlistDoc> = {};
  if (status) filter.status = status;
  if (q) {
    const handle = q.replace(/^@/, "");
    const rx = { $regex: escapeRegex(q), $options: "i" };
    const xRx = { $regex: escapeRegex(handle), $options: "i" };
    filter.$or = [{ name: rx }, { email: rx }, { x: xRx }];
  }

  const col = await waitlist();
  const [docs, matching, byStatus, lastWeek] = await Promise.all([
    col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
    col.countDocuments(filter),
    col.aggregate<{ _id: WaitStatus; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    col.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
  ]);

  const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.n])) as Partial<Record<WaitStatus, number>>;
  const total = byStatus.reduce((sum, s) => sum + s.n, 0);
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));

  const rows: Row[] = docs.map((d) => ({
    id: d._id.toHexString(),
    name: d.name,
    email: d.email,
    x: d.x,
    use: d.use,
    ref: d.ref,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    invitedAt: d.invitedAt?.toISOString(),
  }));

  const stats = [
    { label: "کل ثبت‌نام‌ها", value: total },
    { label: "در انتظار", value: counts.pending ?? 0, tone: "text-warning-foreground" },
    { label: "دعوت‌شده", value: counts.invited ?? 0, tone: "text-success" },
    { label: "۷ روز گذشته", value: lastWeek, tone: "text-accent" },
  ];

  const exportHref = `/admin/export${status ? `?status=${status}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={cn("mt-1 text-3xl font-semibold tabular-nums", s.tone)}>{faNumber(s.value)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="فیلتر وضعیت" className="flex flex-wrap gap-2">
          {[{ key: undefined, label: "همه", n: total }, ...STATUSES.map((s) => ({ key: s as string | undefined, label: STATUS_LABEL[s], n: counts[s] ?? 0 }))].map((t) => {
            const active = t.key === status;
            return (
              <Link
                key={t.label}
                href={href({ status: t.key, q })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                  active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {t.label}
                <span className={cn("text-xs tabular-nums", active ? "opacity-70" : "opacity-60")}>{fa(t.n)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <form action="/admin" className="relative flex-1 md:w-72 md:flex-none">
            {status && <input type="hidden" name="status" value={status} />}
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="جستجوی نام، ایمیل یا X"
              aria-label="جستجو"
              className="h-10 w-full rounded-full border border-border bg-card ps-10 pe-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-accent focus-visible:ring-2 focus-visible:ring-ring"
            />
          </form>
          <a
            href={exportHref}
            className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold transition-colors hover:border-foreground/20 hover:bg-muted"
          >
            <Download className="size-4" aria-hidden />
            CSV
          </a>
        </div>
      </div>

      <WaitlistTable rows={rows} />

      {pages > 1 && (
        <nav aria-label="صفحه‌بندی" className="flex items-center justify-center gap-3 text-sm">
          {page > 1 && (
            <Link href={href({ status, q, page: page - 1 })} className="rounded-full border border-border bg-card px-4 py-2 font-semibold hover:bg-muted">
              قبلی
            </Link>
          )}
          <span className="text-muted-foreground tabular-nums">
            صفحه {fa(page)} از {fa(pages)}
          </span>
          {page < pages && (
            <Link href={href({ status, q, page: page + 1 })} className="rounded-full border border-border bg-card px-4 py-2 font-semibold hover:bg-muted">
              بعدی
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
