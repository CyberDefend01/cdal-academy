import type { Metadata } from "next";
import { requireStudent } from "@/lib/auth";
import { levelLabel } from "@/lib/courses";
import { getMyEnrollments } from "@/lib/portal";
import { Card, PageHeader, ProgressBar } from "../ui";

export const metadata: Metadata = { title: "My Courses" };

const statusLabel = { active: "In progress", completed: "Completed", withdrawn: "Withdrawn" };

export default async function MyCoursesPage() {
  const student = await requireStudent();
  const enrollments = await getMyEnrollments(student.id);

  return (
    <div className="max-w-4xl">
      <PageHeader title="My Courses" description="Courses you are enrolled in and your progress." />
      <div className="grid gap-4">
        {enrollments.map((e) => (
          <Card key={e.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-white">{e.courses.title}</h2>
                <p className="text-sm text-slate-400">
                  {levelLabel[e.courses.level]} · {e.courses.duration_weeks} weeks
                  {e.cohort && ` · ${e.cohort}`} · Enrolled{" "}
                  {new Date(e.enrolled_at).toLocaleDateString("en-GB")}
                </p>
              </div>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-300 ring-1 ring-white/10">
                {statusLabel[e.status]}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={e.progress} />
              <span className="w-12 text-right text-sm text-brand-300">{e.progress}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
