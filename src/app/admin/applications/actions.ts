"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { generateTemporaryPassword } from "@/lib/password";
import { createAdminClient } from "@/lib/supabase/admin";

export type AcceptResult =
  | { ok: true; email: string; fullName: string; temporaryPassword: string | null }
  | { ok: false; error: string };

export type RejectResult = { ok: true } | { ok: false; error: string };

const idSchema = z.uuid();

export async function acceptApplication(applicationId: string): Promise<AcceptResult> {
  // Always re-check: server actions are public HTTP endpoints.
  const admin = await requireAdmin();
  const parsedId = idSchema.safeParse(applicationId);
  if (!parsedId.success) return { ok: false, error: "Invalid application." };

  const db = createAdminClient();

  // 1. Claim the application atomically (only if still pending), so two
  //    admins clicking at once can't both admit the same applicant.
  const { data: app, error: claimError } = await db
    .from("applications")
    .update({ status: "accepted", reviewed_by: admin.id, reviewed_at: new Date().toISOString() })
    .eq("id", parsedId.data)
    .eq("status", "pending")
    .select("id, course_id, full_name, email, phone")
    .maybeSingle();

  if (claimError || !app) {
    return { ok: false, error: "This application is no longer pending." };
  }

  const revert = () =>
    db
      .from("applications")
      .update({ status: "pending", reviewed_by: null, reviewed_at: null })
      .eq("id", app.id);

  // 2. Reuse an existing account for this email, or create one with a temporary password.
  const { data: existing } = await db
    .from("profiles")
    .select("id, role")
    .eq("email", app.email)
    .maybeSingle();

  let userId: string;
  let temporaryPassword: string | null = null;

  if (existing) {
    userId = existing.id;
    if (existing.role === "applicant") {
      await db.from("profiles").update({ role: "student" }).eq("id", userId);
    }
  } else {
    temporaryPassword = generateTemporaryPassword();
    const { data: created, error: createError } = await db.auth.admin.createUser({
      email: app.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: app.full_name },
    });

    if (createError || !created.user) {
      console.error("createUser failed:", createError?.message);
      await revert();
      return { ok: false, error: "Could not create the student account. Please try again." };
    }

    userId = created.user.id;
    // The signup trigger created the profile as 'applicant'; promote it.
    const { error: profileError } = await db
      .from("profiles")
      .update({ role: "student", must_change_password: true, full_name: app.full_name, phone: app.phone })
      .eq("id", userId);
    if (profileError) console.error("Profile update failed:", profileError.message);
  }

  // 3. Enroll the student and link the account to the application.
  const { error: enrollError } = await db
    .from("enrollments")
    .upsert(
      { student_id: userId, course_id: app.course_id, application_id: app.id },
      { onConflict: "student_id,course_id", ignoreDuplicates: true },
    );
  if (enrollError) console.error("Enrollment failed:", enrollError.message);

  await db.from("applications").update({ user_id: userId }).eq("id", app.id);

  revalidatePath("/admin/applications");

  // The temporary password is returned to the admin once and never stored or logged.
  return { ok: true, email: app.email, fullName: app.full_name, temporaryPassword };
}

export async function rejectApplication(applicationId: string): Promise<RejectResult> {
  const admin = await requireAdmin();
  const parsedId = idSchema.safeParse(applicationId);
  if (!parsedId.success) return { ok: false, error: "Invalid application." };

  const { data, error } = await createAdminClient()
    .from("applications")
    .update({ status: "rejected", reviewed_by: admin.id, reviewed_at: new Date().toISOString() })
    .eq("id", parsedId.data)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error || !data) return { ok: false, error: "This application is no longer pending." };

  revalidatePath("/admin/applications");
  return { ok: true };
}
