import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { Card, PageHeader } from "../ui";

export const metadata: Metadata = { title: "Account & Help" };

export default async function AccountPage() {
  const student = await requireStudent();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Account & Help" description="Your profile, security settings and support." />

      <Card title="Profile">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Name</dt>
            <dd className="mt-1 text-slate-200">{student.fullName ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Email</dt>
            <dd className="mt-1 break-words text-slate-200">{student.email}</dd>
          </div>
        </dl>
      </Card>

      <Card title="Security">
        <Link
          href="/portal/change-password"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          <KeyRound className="h-4 w-4" aria-hidden /> Change password
        </Link>
      </Card>

      <Card title="Need help?">
        <p className="text-sm text-slate-400">
          For questions about your admission, courses or account, email us at{" "}
          <a href="mailto:info@cyberdefendafrica.org" className="text-cyan-400 hover:underline">
            info@cyberdefendafrica.org
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
