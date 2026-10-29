import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, type ApplicationStatus } from "./status-badge";

export const metadata: Metadata = { title: "Applications" };

const FILTERS = ["pending", "accepted", "rejected", "all"] as const;
type Filter = (typeof FILTERS)[number];

const filterLabel: Record<Filter, string> = {
  pending: "Pending",
  accepted: "Admitted",
  rejected: "Rejected",
  all: "All",
};

type Row = {
  id: string;
  full_name: string;
  email: string;
  country: string;
  status: ApplicationStatus;
  created_at: string;
  courses: { short_title: string } | null;
};

export default async function ApplicationsPage({ searchParams }: PageProps<"/admin/applications">) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter: Filter = FILTERS.includes(status as Filter) ? (status as Filter) : "pending";

  // Admin is verified in the layout; RLS also restricts this read to admins.
  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select("id, full_name, email, country, status, created_at, courses(short_title)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter !== "all") query = query.eq("status", filter);

  const { data, error } = await query.overrideTypes<Row[], { merge: false }>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Applications</h1>
      <p className="mt-1 text-sm text-slate-400">Review applicants and offer admission.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/applications?status=${f}`}
            className={`rounded-full px-3 py-1 text-sm ring-1 transition ${
              f === filter
                ? "bg-brand-500/10 text-brand-300 ring-brand-500/40"
                : "text-slate-300 ring-white/10 hover:bg-white/5"
            }`}
          >
            {filterLabel[f]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-navy-900">
        {error ? (
          <p className="p-6 text-rose-300">Could not load applications.</p>
        ) : !data?.length ? (
          <p className="p-6 text-slate-400">No {filter === "all" ? "" : filterLabel[filter].toLowerCase()} applications.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{app.full_name}</div>
                    <div className="text-slate-400">{app.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{app.courses?.short_title}</td>
                  <td className="px-4 py-3 text-slate-300">{app.country}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(app.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/applications/${app.id}`} className="text-brand-400 hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
