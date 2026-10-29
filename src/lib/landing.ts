import "server-only";
import { createClient } from "@/lib/supabase/server";

export type PublicStats = { students: number; graduates: number; placements: number; courses: number };
export type Testimonial = { id: string; tester_name: string; organization: string | null; testimonial: string; rating: number | null };

// Aggregate totals only (see get_public_stats in migration 0002).
export async function getPublicStats(): Promise<PublicStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_stats");
  return error ? null : data;
}

// Only testimonials an admin explicitly marked public (served by get_public_testimonials, safe columns only).
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_testimonials");
  return data ?? [];
}
