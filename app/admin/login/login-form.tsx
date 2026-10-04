"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 w-full max-w-sm space-y-4 rounded-3xl border border-border bg-card p-6 shadow-md">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold">
          رمز مدیر
        </label>
        <input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={!!state.error || undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition-shadow focus:border-accent focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.error && (
          <p id="login-error" role="alert" className="text-sm text-rec">
            {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "ورود"}
      </button>
    </form>
  );
}
