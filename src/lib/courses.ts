import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Course = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  summary: string;
  description: string;
  level: CourseLevel;
  duration_weeks: number;
  highlights: string[];
};

export const levelLabel: Record<CourseLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// Returns published courses, or null if the database can't be reached.
export async function getPublishedCourses(): Promise<Course[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, short_title, summary, description, level, duration_weeks, highlights")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    console.error("Failed to load courses:", error.message);
    return null;
  }
  return data;
}
