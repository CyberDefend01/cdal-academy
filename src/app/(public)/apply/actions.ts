"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS } from "./options";

export type ApplyState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
  at?: number; // timestamp of the last attempt; remounts the form so selects refill
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const applicationSchema = z.object({
  course_id: z.uuid("Please choose a course."),
  full_name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.").max(254)),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,30}$/, "Enter a valid phone number."),
  country: z.string().trim().min(2, "Enter your country.").max(80),
  education_level: z.enum(EDUCATION_LEVELS, "Choose your education level."),
  occupation: optionalText(120),
  experience_level: z.enum(EXPERIENCE_LEVELS, "Choose your experience level."),
  motivation: z
    .string()
    .trim()
    .min(50, "Tell us a bit more (at least 50 characters).")
    .max(2000, "Please keep this under 2000 characters."),
  how_heard: optionalText(120),
});

const FIELDS = Object.keys(applicationSchema.shape);

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  // Honeypot: real users never see or fill this field.
  if (formData.get("company_website")) {
    return { status: "success" };
  }

  const raw = Object.fromEntries(FIELDS.map((key) => [key, String(formData.get(key) ?? "")]));
  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
      at: Date.now(),
    };
  }

  const supabase = await createClient();

  // Make sure the course exists and is open (RLS only returns published courses).
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("id", parsed.data.course_id)
    .maybeSingle();

  if (!course) {
    return {
      status: "error",
      message: "That course is not open for applications.",
      fieldErrors: { course_id: ["Please choose a course."] },
      values: raw,
      at: Date.now(),
    };
  }

  // Status is not sent: the database defaults it to 'pending' and RLS
  // refuses anything else.
  const { error } = await supabase.from("applications").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "You already have a pending application for this course. We'll be in touch soon.",
        values: raw,
        at: Date.now(),
      };
    }
    console.error("Application insert failed:", error.code, error.message);
    return {
      status: "error",
      message: "Something went wrong submitting your application. Please try again.",
      values: raw,
      at: Date.now(),
    };
  }

  return { status: "success" };
}
