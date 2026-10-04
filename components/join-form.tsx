"use client";

import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { FounderPhoto } from "@/components/founder";
import { XIcon } from "@/components/x-icon";
import { FOUNDER } from "@/lib/brand";
import { joinWaitlist, type JoinState } from "@/app/actions";
import { cn, fa } from "@/lib/utils";
import { USE_OPTIONS } from "@/lib/waitlist";

const field =
  "h-12 w-full rounded-xl border bg-white/[0.06] px-4 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/40 focus:bg-white/[0.09] focus-visible:ring-2 focus-visible:ring-white/20";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-2 text-sm font-semibold text-white/90">
      {children}
      {optional && <span className="text-xs font-normal text-white/40">دلخواه</span>}
    </label>
  );
}

export function JoinForm({ refCode }: { refCode?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinWaitlist, {});

  if (state.ok) {
    return (
      <div role="status" className="animate-pop mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-md">
        <div className="relative mx-auto w-fit">
          <FounderPhoto size={72} />
          <span className="absolute -bottom-1 -end-1 grid size-7 place-items-center rounded-full bg-success text-white ring-2 ring-ink">
            <Check className="size-4" strokeWidth={3} aria-hidden />
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-semibold">{state.already ? "قبلاً اسمتون رو نوشته بودین" : "مرسی، اسمتون ثبت شد"}</h2>
        <p className="mt-3 text-white/70">
          جاتون تو صف: <span className="font-semibold text-white">{fa(state.position ?? 1)}</span>
        </p>
        <p className="mt-2 text-sm leading-7 text-white/55">وقتی نوبتتون شد، خودم با ایمیل یا پیام تو X براتون می‌نویسم.</p>
        <a
          href={FOUNDER.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          <XIcon className="size-3.5" />
          منو تو X دنبال کنین
        </a>
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
        <Label htmlFor="name">اسم و فامیل</Label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={v?.name}
          placeholder="مثلا سارا احمدی"
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
        <Label htmlFor="x">اکانتت تو X</Label>
        <input
          id="x"
          name="x"
          type="text"
          dir="ltr"
          autoComplete="username"
          defaultValue={v?.x}
          placeholder="@username یا آیدی"
          aria-invalid={state.field === "x" || undefined}
          aria-describedby={state.field === "x" ? "form-error" : undefined}
          className={cn(field, "font-latin text-start", state.field === "x" ? "border-rec" : "border-white/10")}
        />
      </div>

      <div>
        <Label htmlFor="use" optional>
          بیشتر واسه چی می‌خوای؟
        </Label>
        <select id="use" name="use" defaultValue={v?.use ?? ""} className={cn(field, "border-white/10")}>
          <option value="" className="text-ink">
            انتخاب کنین
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
            بذار تو لیست انتظار
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
      <p className="text-center text-xs leading-6 text-white/40">فقط واسه اینه که بگم دسترسی باز شده؛ بدون تبلیغ و اسپم.</p>
    </form>
  );
}
