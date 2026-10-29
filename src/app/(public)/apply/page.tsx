import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/courses";
import { ApplyForm } from "./apply-form";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to a Cyber Defend Academy course.",
};

export default async function ApplyPage({ searchParams }: PageProps<"/apply">) {
  const { course: courseSlug } = await searchParams;
  const courses = await getPublishedCourses();
  const defaultCourseId = courses?.find((c) => c.slug === courseSlug)?.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Admissions</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Apply to the Academy</h1>
        <p className="mt-4 text-slate-400">
          Choose a course and tell us about yourself. Applications are reviewed by our admissions
          team; successful applicants receive login details for the student portal.
        </p>
      </header>

      <div className="mt-10 rounded-2xl border border-white/10 bg-navy-900 p-6 sm:p-8">
        {courses && courses.length > 0 ? (
          <ApplyForm
            courses={courses.map(({ id, title, summary, level }) => ({ id, title, summary, level }))}
            defaultCourseId={defaultCourseId}
          />
        ) : (
          <p className="text-slate-300">
            Applications are temporarily unavailable. Please try again shortly.
          </p>
        )}
      </div>
    </div>
  );
}
