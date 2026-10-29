"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  CURRENCIES,
  FORM_FIELDS,
  JOB_RECORD_TYPES,
  METRIC_KINDS,
  PAYMENT_STATUSES,
  TEST_TYPES,
  type MetricKind,
} from "./fields";

export type MetricFormState = {
  ok?: boolean;
  error?: string;
  at?: number; // timestamp of the last attempt; remounts the form so selects refill
  values?: Record<string, string>;
};

// ---- Field helpers (form values always arrive as strings) ----
const reqText = (max: number) => z.string().trim().min(1, "Required").max(max);
const optText = (max: number) => z.string().trim().max(max).transform((v) => v || null);
const reqDate = z.iso.date("Enter a valid date");
const optDate = z.union([z.literal(""), z.iso.date("Enter a valid date")]).transform((v) => v || null);
const num = (min: number, max: number) =>
  z.string().trim().min(1, "Required").transform(Number).pipe(z.number().min(min).max(max));
const optNum = (min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number().min(min).max(max).nullable());
// Only http(s) links, so stored URLs can't become javascript: links.
const optUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || (/^https?:\/\//i.test(v) && URL.canParse(v)), "Enter a valid http(s) link")
  .transform((v) => v || null);
const checkbox = z.string().transform((v) => v === "on");

const SCHEMAS = {
  testing: {
    table: "customer_tests",
    schema: z.object({
      tester_name: reqText(120),
      organization: optText(120),
      test_type: z.enum(TEST_TYPES),
      test_date: reqDate,
      rating: optNum(1, 5),
      feedback: optText(2000),
      testimonial: optText(600),
      is_public_testimonial: checkbox,
    }),
  },
  revenue: {
    table: "revenue_records",
    schema: z.object({
      customer_name: reqText(120),
      customer_email: z.union([z.literal(""), z.email().max(254)]).transform((v) => v || null),
      description: reqText(200),
      amount: num(0, 1_000_000_000),
      currency: z.enum(CURRENCIES),
      payment_status: z.enum(PAYMENT_STATUSES),
      payment_reference: optText(120),
      paid_at: optDate,
    }),
  },
  users: {
    table: "active_user_reports",
    schema: z
      .object({
        period_start: reqDate,
        period_end: reqDate,
        active_users: num(0, 100_000_000),
        new_enrollments: optNum(0, 100_000_000).transform((v) => v ?? 0),
        completion_rate: optNum(0, 100),
        report_url: optUrl,
        notes: optText(2000),
      })
      .refine((v) => v.period_end >= v.period_start, "Period end must be after period start"),
  },
  jobs: {
    table: "job_placements",
    schema: z.object({
      record_type: z.enum(JOB_RECORD_TYPES),
      person_name: reqText(120),
      organization: reqText(120),
      role_title: reqText(120),
      start_date: optDate,
      contract_url: optUrl,
      notes: optText(2000),
    }),
  },
} satisfies Record<MetricKind, { table: string; schema: z.ZodType }>;

export async function addMetricRecord(
  kind: MetricKind,
  _prev: MetricFormState,
  formData: FormData,
): Promise<MetricFormState> {
  const admin = await requireAdmin();
  if (!METRIC_KINDS.includes(kind)) return { error: "Unknown record type." };

  const { table, schema } = SCHEMAS[kind];
  const raw = Object.fromEntries(
    FORM_FIELDS[kind].map((f) => [f.name, String(formData.get(f.name) ?? "")]),
  );
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = FORM_FIELDS[kind].find((f) => f.name === issue.path[0]);
    return { error: field ? `${field.label}: ${issue.message}` : issue.message, values: raw, at: Date.now() };
  }

  // Session client: RLS also requires the caller to be an admin.
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert({ ...parsed.data, created_by: admin.id });
  if (error) {
    console.error(`Insert into ${table} failed:`, error.message);
    return { error: "Could not save the record. Please try again.", values: raw, at: Date.now() };
  }

  revalidatePath("/admin/impact");
  return { ok: true, at: Date.now() };
}
