"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";
import { submitApplication, type ApplyState } from "./actions";
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS } from "./options";

type CourseOption = { id: string; title: string; summary: string; level: string };

const initialState: ApplyState = { status: "idle" };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400";

export function ApplyForm({
  courses,
  defaultCourseId,
}: {
  courses: CourseOption[];
  defaultCourseId?: string;
}) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <CircleCheck className="mx-auto h-12 w-12 text-emerald-400" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold text-white">Application received</h2>
        <p className="mt-2 text-slate-300">
          Thank you for applying to Cyber Defend Academy. Our admissions team will review your
          application and contact you by email with the outcome.
        </p>
        <Link href="/courses" className="mt-6 inline-block text-brand-400 hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = (field: string) => state.fieldErrors?.[field]?.[0];
  const selectedCourse = v.course_id ?? defaultCourseId;

  return (
    <form key={state.at} action={formAction} className="space-y-8" noValidate>
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200"
        >
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      {/* Honeypot field, hidden from people and screen readers */}
      <div className="hidden" aria-hidden>
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="text-lg font-semibold text-white">1. Choose your course</legend>
        <div className="mt-4 grid gap-3">
          {courses.map((course) => (
            <label
              key={course.id}
              className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-navy-950 p-4 transition has-[:checked]:border-brand-400 has-[:checked]:bg-brand-400/5"
            >
              <input
                type="radio"
                name="course_id"
                value={course.id}
                defaultChecked={course.id === selectedCourse}
                className="mt-1 accent-brand-400"
                required
              />
              <span>
                <span className="block font-medium text-white">{course.title}</span>
                <span className="block text-sm text-slate-400">{course.summary}</span>
              </span>
            </label>
          ))}
        </div>
        {err("course_id") && <p className="mt-2 text-sm text-rose-300">{err("course_id")}</p>}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold text-white">2. Personal details</legend>
        <Field label="Full name" error={err("full_name")}>
          <input name="full_name" defaultValue={v.full_name} autoComplete="name" className={inputClass} required />
        </Field>
        <Field label="Email" error={err("email")}>
          <input name="email" type="email" defaultValue={v.email} autoComplete="email" className={inputClass} required />
        </Field>
        <Field label="Phone number" error={err("phone")}>
          <input name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" placeholder="+234 ..." className={inputClass} required />
        </Field>
        <Field label="Country" error={err("country")}>
          <input name="country" defaultValue={v.country} autoComplete="country-name" className={inputClass} required />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold text-white">3. Background</legend>
        <Field label="Highest education" error={err("education_level")}>
          <select name="education_level" defaultValue={v.education_level ?? ""} className={inputClass} required>
            <option value="" disabled>Select...</option>
            {EDUCATION_LEVELS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="IT / security experience" error={err("experience_level")}>
          <select name="experience_level" defaultValue={v.experience_level ?? ""} className={inputClass} required>
            <option value="" disabled>Select...</option>
            {EXPERIENCE_LEVELS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Current occupation (optional)" error={err("occupation")}>
          <input name="occupation" defaultValue={v.occupation} className={inputClass} />
        </Field>
        <Field label="How did you hear about us? (optional)" error={err("how_heard")}>
          <input name="how_heard" defaultValue={v.how_heard} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset>
        <legend className="mb-4 text-lg font-semibold text-white">4. Motivation</legend>
        <Field label="Why do you want to join this course? (50-2000 characters)" error={err("motivation")}>
          <textarea name="motivation" rows={6} defaultValue={v.motivation} maxLength={2000} className={inputClass} required />
        </Field>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300">
        {label}
        {children}
      </label>
      {error && <p className="mt-1.5 text-sm text-rose-300">{error}</p>}
    </div>
  );
}
