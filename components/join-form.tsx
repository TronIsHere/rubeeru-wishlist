"use client";

import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { joinWaitlist, type JoinState } from "@/app/actions";
import { cn, fa } from "@/lib/utils";
import { USE_OPTIONS } from "@/lib/waitlist";

const field =
  "h-12 w-full rounded-xl border bg-white/[0.06] px-4 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40 focus:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-white/20";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-2 text-sm font-semibold text-white/90">
      {children}
      {optional && <span className="text-xs font-normal text-white/40">اختیاری</span>}
    </label>
  );
}

export function JoinForm({ refCode }: { refCode?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinWaitlist, {});

  if (state.ok) {
    return (
      <div role="status" className="animate-pop mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success text-white shadow-lg shadow-success/30">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">{state.already ? "قبلاً در فهرست بودید" : "در فهرست انتظار هستید"}</h2>
        <p className="mt-3 text-white/70">
          جای شما در صف: <span className="font-semibold text-white">{fa(state.position ?? 1)}</span>
        </p>
        <p className="mt-2 text-sm leading-7 text-white/55">وقتی نوبتتان رسید، دعوت‌نامه را با همین ایمیلی که وارد کردید برایتان می‌فرستیم.</p>
      </div>
    );
  }

  const v = state.values;
  return (
    <form action={action} noValidate className="mx-auto w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-start backdrop-blur-md sm:p-7">
      <input type="hidden" name="ref" value={refCode ?? ""} />
      {/* Honeypot: invisible to people, tempting to bots */}
      <div className="absolute -start-[9999px]" aria-hidden>
        <label>
          شرکت
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <Label htmlFor="name">نام و نام خانوادگی</Label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={v?.name}
          placeholder="مثلاً سارا احمدی"
          aria-invalid={state.field === "name" || undefined}
          aria-describedby={state.field === "name" ? "form-error" : undefined}
          className={cn(field, state.field === "name" ? "border-rec" : "border-white/10")}
        />
      </div>

      <div>
        <Label htmlFor="email">ایمیل</Label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          dir="ltr"
          autoComplete="email"
          defaultValue={v?.email}
          placeholder="you@example.com"
          aria-invalid={state.field === "email" || undefined}
          aria-describedby={state.field === "email" ? "form-error" : undefined}
          className={cn(field, "font-latin text-start", state.field === "email" ? "border-rec" : "border-white/10")}
        />
      </div>

      <div>
        <Label htmlFor="x">حساب یا شناسهٔ X</Label>
        <input
          id="x"
          name="x"
          type="text"
          dir="ltr"
          autoComplete="username"
          defaultValue={v?.x}
          placeholder="@username یا شناسه"
          aria-invalid={state.field === "x" || undefined}
          aria-describedby={state.field === "x" ? "form-error" : undefined}
          className={cn(field, "font-latin text-start", state.field === "x" ? "border-rec" : "border-white/10")}
        />
      </div>

      <div>
        <Label htmlFor="use" optional>
          بیشتر برای چه کاری؟
        </Label>
        <select id="use" name="use" defaultValue={v?.use ?? ""} className={cn(field, "border-white/10")}>
          <option value="" className="text-ink">
            انتخاب کنید
          </option>
          {USE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p id="form-error" role="alert" className="text-sm text-[#ff8da1]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-ink shadow-[0_0_40px_-8px_rgba(199,212,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_-6px_rgba(77,124,255,0.8)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <>
            ثبت در فهرست انتظار
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
      <p className="text-center text-xs leading-6 text-white/40">فقط برای خبر دادن درباره‌ی دسترسی با شما تماس می‌گیریم؛ بدون تبلیغ و اسپم.</p>
    </form>
  );
}
