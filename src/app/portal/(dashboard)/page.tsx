import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, GraduationCap, TrendingUp } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { getPublishedCourses, levelLabel } from "@/lib/courses";
import { getMyEnrollments, getUpcomingExams } from "@/lib/portal";
import { Card, ProgressBar } from "./ui";

export const metadata: Metadata = { title: "Overview" };

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

export default async function PortalOverview() {
  const student = await requireStudent();
  const [enrollments, exams, catalog] = await Promise.all([
    getMyEnrollments(student.id),
    getUpcomingExams(),
    getPublishedCourses(),
  ]);

  const active = enrollments.filter((e) => e.status === "active");
  const completed = enrollments.filter((e) => e.status === "completed").length;
  const avgProgress = active.length
    ? Math.round(active.reduce((sum, e) => sum + e.progress, 0) / active.length)
    : 0;
  const current = active[0];
  const enrolledIds = new Set(enrollments.map((e) => e.courses.id));
  const available = (catalog ?? []).filter((c) => !enrolledIds.has(c.id));
  const firstName = student.fullName?.split(" ")[0] ?? "Student";

  const stats = [
    { label: "Active courses", value: active.length, icon: BookOpen },
    { label: "Average progress", value: `${avgProgress}%`, icon: TrendingUp },
    { label: "Upcoming exams", value: exams.length, icon: CalendarClock },
    { label: "Completed courses", value: completed, icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-navy-700 to-navy-900 p-6 sm:p-8">
        <p className="text-sm text-cyan-300">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Hello, {firstName}</h1>
        {current ? (
          <div className="mt-5 max-w-xl">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="font-medium text-slate-200">
                {current.courses.title}
                {current.cohort && <span className="text-slate-400"> · {current.cohort}</span>}
              </span>
              <span className="text-cyan-300">{current.progress}% complete</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={current.progress} />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-slate-300">You have no active courses right now.</p>
        )}
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-navy-900 p-4">
            <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
            <p className="mt-3 text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Exam schedule">
          {exams.length ? (
            <ul className="divide-y divide-white/5">
              {exams.map((exam) => (
                <li key={exam.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-medium text-slate-200">{exam.title}</p>
                  <p className="text-sm text-slate-400">
                    {exam.courses?.short_title} · {dateFmt.format(new Date(exam.starts_at))} ·{" "}
                    {exam.duration_minutes} min{exam.location && ` · ${exam.location}`}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No upcoming exams scheduled.</p>
          )}
        </Card>

        <Card title="Course registration">
          {available.length ? (
            <ul className="space-y-3">
              {available.map((course) => (
                <li key={course.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-200">{course.title}</p>
                    <p className="text-xs text-slate-400">
                      {levelLabel[course.level]} · {course.duration_weeks} weeks
                    </p>
                  </div>
                  <Link
                    href={`/apply?course=${encodeURIComponent(course.slug)}`}
                    className="inline-flex shrink-0 items-center gap-1 text-sm text-cyan-400 hover:underline"
                  >
                    Apply <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">You are registered for every available course.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
