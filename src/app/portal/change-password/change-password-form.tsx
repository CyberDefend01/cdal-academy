"use client";

import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { changePassword, type ChangePasswordState } from "./actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2.5 text-sm text-white focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(changePassword, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"
        >
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden />
          {state.error}
        </div>
      )}
      <label className="block text-sm font-medium text-slate-300">
        New password
        <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-slate-300">
        Confirm new password
        <input name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
      </label>
      <p className="text-xs text-slate-500">
        At least 12 characters, with uppercase and lowercase letters and a number.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand-500 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
}
