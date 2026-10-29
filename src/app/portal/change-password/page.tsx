import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

export default async function ChangePasswordPage() {
  const student = await requireStudent(true);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-20">
      <div className="rounded-2xl border border-white/10 bg-navy-900 p-8">
        <KeyRound className="h-8 w-8 text-cyan-400" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-white">
          {student.mustChangePassword ? "Set your password" : "Change password"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {student.mustChangePassword
            ? "Welcome to Cyber Defend Academy! Replace your temporary password before continuing."
            : "Choose a new password for your account."}
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
        {!student.mustChangePassword && (
          <Link href="/portal/account" className="mt-4 block text-center text-sm text-slate-400 hover:text-white">
            Cancel
          </Link>
        )}
      </div>
    </div>
  );
}
