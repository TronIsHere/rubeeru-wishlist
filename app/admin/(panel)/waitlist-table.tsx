"use client";

import { Check, Copy, Loader2, MailCheck, RotateCcw, Trash2, UserX } from "lucide-react";
import { useState, useTransition } from "react";
import { cn, faDateTime, fa } from "@/lib/utils";
import { STATUS_LABEL, USE_LABEL, type WaitStatus } from "@/lib/waitlist";
import { removeEntries, setStatus } from "../actions";

export type Row = {
  id: string;
  name: string;
  email: string;
  x: string;
  use?: string;
  ref?: string;
  status: WaitStatus;
  createdAt: string;
  invitedAt?: string;
};

const statusStyle: Record<WaitStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground",
  invited: "bg-success-soft text-success",
  rejected: "bg-rec-soft text-rec",
};

const xDisplay = (x: string) => (/^\d+$/.test(x) ? x : `@${x}`);

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="کپی"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      className="grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {done ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    </button>
  );
}

export function WaitlistTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  // Drop selections that no longer exist after a filter change or refresh.
  const ids = [...selected].filter((id) => rows.some((r) => r.id === id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const run = (targets: string[], fn: (ids: string[]) => Promise<void>) =>
    start(async () => {
      await fn(targets);
      setSelected(new Set());
    });

  const bulk = (status: WaitStatus) => run(ids, (t) => setStatus(t, status));

  if (rows.length === 0) {
    return <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">موردی پیدا نشد.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-start text-xs text-muted-foreground">
              <th className="w-12 px-4 py-3 text-start">
                <input
                  type="checkbox"
                  aria-label="انتخاب همه"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                  className="size-4 cursor-pointer accent-[var(--accent)]"
                />
              </th>
              <th className="px-3 py-3 text-start font-semibold">نام</th>
              <th className="px-3 py-3 text-start font-semibold">ایمیل</th>
              <th className="px-3 py-3 text-start font-semibold">X</th>
              <th className="px-3 py-3 text-start font-semibold">کاربرد</th>
              <th className="px-3 py-3 text-start font-semibold">ثبت‌نام</th>
              <th className="px-3 py-3 text-start font-semibold">وضعیت</th>
              <th className="px-3 py-3 text-start font-semibold">
                <span className="sr-only">اقدام</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={cn("border-b border-border/60 last:border-0 transition-colors", selected.has(r.id) ? "bg-accent-soft/60" : "hover:bg-muted/40")}>
                <td className="px-4 py-3">
                  <input type="checkbox" aria-label={`انتخاب ${r.name}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="size-4 cursor-pointer accent-[var(--accent)]" />
                </td>
                <td className="px-3 py-3">
                  <p className="font-semibold">{r.name}</p>
                  {r.ref && (
                    <p className="font-latin text-xs text-muted-foreground" dir="ltr">
                      ref: {r.ref}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <span dir="ltr" className="font-latin">
                      {r.email}
                    </span>
                    <CopyButton text={r.email} />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <span dir="ltr" className="font-latin">
                      {xDisplay(r.x)}
                    </span>
                    <CopyButton text={xDisplay(r.x)} />
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{r.use ? (USE_LABEL[r.use] ?? r.use) : "-"}</td>
                <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">{faDateTime(new Date(r.createdAt))}</td>
                <td className="px-3 py-3">
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", statusStyle[r.status])} title={r.invitedAt ? `دعوت: ${faDateTime(new Date(r.invitedAt))}` : undefined}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </td>
                <td className="px-3 py-3 text-end">
                  {r.status !== "invited" && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run([r.id], (t) => setStatus(t, "invited"))}
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-semibold text-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                      <MailCheck className="size-3.5" aria-hidden />
                      دعوت
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ids.length > 0 && (
        <div role="toolbar" aria-label="اقدام گروهی" className="animate-pop sticky bottom-4 z-10 mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/95 p-2 shadow-xl backdrop-blur-md">
          <span className="px-3 text-sm font-semibold tabular-nums">
            {pending ? <Loader2 className="size-4 animate-spin" aria-label="در حال انجام" /> : `${fa(ids.length)} مورد انتخاب شد`}
          </span>
          <button type="button" disabled={pending} onClick={() => bulk("invited")} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50">
            <MailCheck className="size-4" aria-hidden />
            دعوت‌شده
          </button>
          <button type="button" disabled={pending} onClick={() => bulk("pending")} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50">
            <RotateCcw className="size-4" aria-hidden />
            در انتظار
          </button>
          <button type="button" disabled={pending} onClick={() => bulk("rejected")} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50">
            <UserX className="size-4" aria-hidden />
            رد
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`${fa(ids.length)} مورد برای همیشه حذف شود؟`)) run(ids, removeEntries);
            }}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-rec transition-colors hover:bg-rec-soft disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden />
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
