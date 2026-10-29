import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, type ApplicationStatus } from "../status-badge";
import { ReviewActions } from "./review-actions";

export const metadata: Metadata = { title: "Review application" };

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  education_level: string;
  occupation: string | null;
  experience_level: string;
  motivation: string;
  how_heard: string | null;
  status: ApplicationStatus;
  created_at: string;
  reviewed_at: string | null;
  courses: { title: string } | null;
};

export default async function ApplicationDetailPage({ params }: PageProps<"/admin/applications/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data: app } = await supabase
    .from("applications")
    .select(
      "id, full_name, email, phone, country, education_level, occupation, experience_level, motivation, how_heard, status, created_at, reviewed_at, courses(title)",
    )
    .eq("id", id)
    .maybeSingle()
    .overrideTypes<Application, { merge: false }>();

  if (!app) notFound();

  const details: [string, string | null][] = [
    ["Email", app.email],
    ["Phone", app.phone],
    ["Country", app.country],
    ["Highest education", app.education_level],
    ["Experience", app.experience_level],
    ["Occupation", app.occupation],
    ["Heard about us", app.how_heard],
    ["Submitted", new Date(app.created_at).toLocaleString("en-GB")],
    ["Reviewed", app.reviewed_at ? new Date(app.reviewed_at).toLocaleString("en-GB") : null],
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/applications" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All applications
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-white">{app.full_name}</h1>
        <StatusBadge status={app.status} />
      </div>
      <p className="mt-1 text-cyan-300">{app.courses?.title}</p>

      <dl className="mt-6 grid gap-x-6 gap-y-4 rounded-xl border border-white/10 bg-navy-900 p-6 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-1 break-words text-slate-200">{value || "-"}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-6 rounded-xl border border-white/10 bg-navy-900 p-6">
        <h2 className="text-xs uppercase tracking-wide text-slate-400">Motivation</h2>
        <p className="mt-2 whitespace-pre-wrap text-slate-200">{app.motivation}</p>
      </section>

      {app.status === "pending" && <ReviewActions applicationId={app.id} />}
    </div>
  );
}
