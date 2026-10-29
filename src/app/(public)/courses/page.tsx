import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, Clock, GraduationCap } from "lucide-react";
import { getPublishedCourses, levelLabel, type CourseLevel } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "The official Cyber Defend Academy course catalog.",
};

const levelStyle: Record<CourseLevel, string> = {
  beginner: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  intermediate: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  advanced: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">Academy</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Course catalog</h1>
        <p className="mt-4 text-slate-400">
          Three structured tracks take you from your first security concepts to enterprise-grade
          administration. Every track includes hands-on labs in our cyber range.
        </p>
      </header>

      {!courses ? (
        <p className="mt-10 rounded-lg border border-white/10 bg-navy-900 p-6 text-slate-300">
          Courses are temporarily unavailable. Please try again shortly.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-lg shadow-black/20"
            >
              <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${levelStyle[course.level]}`}
              >
                {levelLabel[course.level]}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white">{course.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{course.description}</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {course.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden /> {course.duration_weeks} weeks
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" aria-hidden /> Certificate
                </span>
              </div>

              <Link
                href={`/apply?course=${encodeURIComponent(course.slug)}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Apply for {course.short_title} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
