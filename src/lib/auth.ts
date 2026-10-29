import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "student" | "applicant";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  mustChangePassword: boolean;
};

// Verifies the session JWT (getClaims) and loads the user's profile.
// Cached per request so layouts, pages and actions can all call it.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role, must_change_password")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return null;

  return {
    id: userId,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role,
    mustChangePassword: profile.must_change_password,
  };
});

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");
  return user;
}

// Student portal guard: signed in, role 'student' AND a verified admission
// (an active or completed enrollment). Students still on a temporary
// password are sent to change it first.
export const requireStudent = cache(
  async (allowTemporaryPassword = false): Promise<CurrentUser> => {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    if (user.role !== "student") redirect(user.role === "admin" ? "/admin" : "/");
    if (user.mustChangePassword && !allowTemporaryPassword) redirect("/portal/change-password");

    const supabase = await createClient();
    const { count } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("student_id", user.id)
      .in("status", ["active", "completed"]);
    if (!count) redirect("/");

    return user;
  },
);

// Where a user should land after signing in.
export function homeFor(user: Pick<CurrentUser, "role" | "mustChangePassword">): string {
  if (user.role === "admin") return "/admin/applications";
  if (user.role === "student") {
    return user.mustChangePassword ? "/portal/change-password" : "/portal";
  }
  return "/";
}
