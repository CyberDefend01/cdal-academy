"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStudent } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ChangePasswordState = { error?: string };

const schema = z
  .object({
    password: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(72, "Use at most 72 characters.")
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/\d/, "Include a number."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords do not match.", path: ["confirm"] });

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const student = await requireStudent(true);

  const parsed = schema.safeParse({
    password: formData.get("password") ?? "",
    confirm: formData.get("confirm") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { error: "Choose a password different from your current one." };
    if (error.code === "weak_password") return { error: "That password is too weak. Try a longer one." };
    console.error("Password update failed:", error.code);
    return { error: "Could not update your password. Please try again." };
  }

  // Cleared server-side only after the password really changed, so users
  // can't skip this step by clearing the flag themselves.
  const { error: flagError } = await createAdminClient()
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", student.id);
  if (flagError) console.error("Clearing must_change_password failed:", flagError.message);

  redirect("/portal");
}
