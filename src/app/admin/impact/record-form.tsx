"use client";

import { useActionState } from "react";
import { CircleAlert, CircleCheck, Plus } from "lucide-react";
import { addMetricRecord, type MetricFormState } from "./actions";
import { FORM_FIELDS, type MetricKind } from "./fields";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400";

export function RecordForm({ kind }: { kind: MetricKind }) {
  const [state, formAction, pending] = useActionState<MetricFormState, FormData>(
    addMetricRecord.bind(null, kind),
    {},
  );

  return (
    <details className="rounded-xl border border-white/10 bg-navy-900 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-medium text-cyan-300">
        <Plus className="h-4 w-4" aria-hidden /> Add record
      </summary>
      <form action={formAction} className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-2">
        {FORM_FIELDS[kind].map((field) => {
          if (field.type === "checkbox") {
            return (
              <label key={field.name} className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
                <input type="checkbox" name={field.name} className="accent-cyan-400" />
                {field.label}
              </label>
            );
          }
          return (
            <label
              key={field.name}
              className={`block text-sm font-medium text-slate-300 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
            >
              {field.label}
              {field.required && <span className="text-rose-300"> *</span>}
              {field.type === "textarea" ? (
                <textarea name={field.name} rows={3} className={inputClass} />
              ) : field.type === "select" ? (
                <select name={field.name} required={field.required} defaultValue="" className={inputClass}>
                  <option value="">Select...</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {field.optionLabels?.[o] ?? o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  step={field.step}
                  required={field.required}
                  className={inputClass}
                />
              )}
            </label>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save record"}
          </button>
          {state.error && (
            <span role="alert" className="flex items-center gap-1.5 text-sm text-rose-300">
              <CircleAlert className="h-4 w-4" aria-hidden /> {state.error}
            </span>
          )}
          {state.ok && (
            <span key={state.savedAt} className="flex items-center gap-1.5 text-sm text-emerald-300">
              <CircleCheck className="h-4 w-4" aria-hidden /> Saved
            </span>
          )}
        </div>
      </form>
    </details>
  );
}
