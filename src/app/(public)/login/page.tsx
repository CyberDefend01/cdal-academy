import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { getCurrentUser, homeFor } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Portal Login" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user && user.role !== "applicant") redirect(homeFor(user));

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border border-white/10 bg-navy-900 p-8">
        <Logo size={56} alt="Cyber Defend Academy" />
        <h1 className="mt-4 text-2xl font-bold text-white">Portal login</h1>
        <p className="mt-2 text-sm text-slate-400">
          For admitted students and staff. Use the temporary credentials sent to you after
          admission; you&apos;ll be asked to set a new password on first login.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
