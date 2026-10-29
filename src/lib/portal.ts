import "server-only";
import type { CourseLevel } from "@/lib/courses";
import { createClient } from "@/lib/supabase/server";

export type Enrollment = {
  id: string;
  cohort: string | null;
  status: "active" | "completed" | "withdrawn";
  progress: number;
  enrolled_at: string;
  courses: {
    id: string;
    slug: string;
    title: string;
    short_title: string;
    level: CourseLevel;
    duration_weeks: number;
  };
};

export type Exam = {
  id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  location: string | null;
  courses: { short_title: string } | null;
};

// RLS limits both queries to the signed-in student's own data.
export async function getMyEnrollments(studentId: string): Promise<Enrollment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id, cohort, status, progress, enrolled_at, courses(id, slug, title, short_title, level, duration_weeks)")
    .eq("student_id", studentId)
    .order("enrolled_at")
    .overrideTypes<Enrollment[], { merge: false }>();
  return data ?? [];
}

export async function getUpcomingExams(): Promise<Exam[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exam_schedules")
    .select("id, title, starts_at, duration_minutes, location, courses(short_title)")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at")
    .limit(10)
    .overrideTypes<Exam[], { merge: false }>();
  return data ?? [];
}
