import { createClient } from "@/lib/supabase/server";
import { jobTypeLabel, JOB_RECORD_TYPES } from "./fields";
import { RecordForm } from "./record-form";

// ---------- Shared building blocks ----------

function StatCards({ stats }: { stats: { label: string; value: string | number }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-white/10 bg-navy-900 p-4">
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="text-xs text-slate-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function RecordsTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) {
    return <p className="rounded-xl border border-white/10 bg-navy-900 p-6 text-sm text-slate-400">No records yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-300">
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((c, j) => (
                <td key={j} className="max-w-xs px-4 py-3 align-top">{c ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExternalLink({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
      Open
    </a>
  );
}

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-GB") : null);
const LIMIT = 100;

// ---------- 1. Customer Testing ----------

export async function TestingSection() {
  const supabase = await createClient();
  const { data = [] } = await supabase
    .from("customer_tests")
    .select("id, tester_name, organization, test_type, test_date, rating, feedback, testimonial, is_public_testimonial")
    .order("test_date", { ascending: false })
    .limit(LIMIT);
  const rows = data ?? [];
  const rated = rows.filter((r) => r.rating != null);
  const avg = rated.length ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1) : "-";

  return (
    <div className="space-y-6">
      <StatCards
        stats={[
          { label: "Testing records", value: rows.length },
          { label: "Average rating", value: avg === "-" ? avg : `${avg} / 5` },
          { label: "Testimonials", value: rows.filter((r) => r.testimonial).length },
          { label: "Shown publicly", value: rows.filter((r) => r.is_public_testimonial).length },
        ]}
      />
      <RecordForm kind="testing" />
      <RecordsTable
        headers={["Date", "Tester", "Type", "Rating", "Feedback / testimonial", "Public"]}
        rows={rows.map((r) => [
          fmtDate(r.test_date),
          <>
            <div className="text-white">{r.tester_name}</div>
            <div className="text-xs text-slate-400">{r.organization}</div>
          </>,
          r.test_type,
          r.rating ? `${r.rating}/5` : null,
          <>
            {r.feedback && <p className="line-clamp-3">{r.feedback}</p>}
            {r.testimonial && <p className="mt-1 line-clamp-3 italic text-slate-400">&ldquo;{r.testimonial}&rdquo;</p>}
          </>,
          r.is_public_testimonial ? "Yes" : "No",
        ])}
      />
    </div>
  );
}

// ---------- 2. Revenue & Customers ----------

export async function RevenueSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("revenue_records")
    .select("id, customer_name, customer_email, description, amount, currency, payment_status, payment_reference, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMIT);
  const rows = data ?? [];

  const confirmed = rows.filter((r) => r.payment_status === "confirmed");
  const totals = new Map<string, number>();
  confirmed.forEach((r) => totals.set(r.currency, (totals.get(r.currency) ?? 0) + Number(r.amount)));
  const totalText =
    [...totals].map(([cur, sum]) => new Intl.NumberFormat("en", { style: "currency", currency: cur }).format(sum)).join(" + ") || "-";

  return (
    <div className="space-y-6">
      <StatCards
        stats={[
          { label: "Confirmed revenue", value: totalText },
          { label: "Confirmed payments", value: confirmed.length },
          { label: "Pending payments", value: rows.filter((r) => r.payment_status === "pending").length },
          { label: "Unique customers", value: new Set(rows.map((r) => r.customer_email ?? r.customer_name)).size },
        ]}
      />
      <RecordForm kind="revenue" />
      <RecordsTable
        headers={["Date", "Customer", "Description", "Amount", "Status", "Reference"]}
        rows={rows.map((r) => [
          fmtDate(r.paid_at ?? r.created_at),
          <>
            <div className="text-white">{r.customer_name}</div>
            <div className="text-xs text-slate-400">{r.customer_email}</div>
          </>,
          r.description,
          new Intl.NumberFormat("en", { style: "currency", currency: r.currency }).format(Number(r.amount)),
          <span key="status" className="capitalize">{r.payment_status}</span>,
          r.payment_reference,
        ])}
      />
    </div>
  );
}

// ---------- 3. Active Users ----------

export async function UsersSection() {
  const supabase = await createClient();
  const [{ data }, { count: activeEnrollments }, { count: students }] = await Promise.all([
    supabase
      .from("active_user_reports")
      .select("id, period_start, period_end, active_users, new_enrollments, completion_rate, report_url, notes")
      .order("period_end", { ascending: false })
      .limit(LIMIT),
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
  ]);
  const rows = data ?? [];
  const latest = rows[0];

  return (
    <div className="space-y-6">
      <StatCards
        stats={[
          { label: "Active enrollments (live)", value: activeEnrollments ?? 0 },
          { label: "Student accounts (live)", value: students ?? 0 },
          { label: "Active users (latest report)", value: latest?.active_users ?? "-" },
          { label: "Completion rate (latest report)", value: latest?.completion_rate != null ? `${latest.completion_rate}%` : "-" },
        ]}
      />
      <RecordForm kind="users" />
      <RecordsTable
        headers={["Period", "Active users", "New enrollments", "Completion", "Report", "Notes"]}
        rows={rows.map((r) => [
          `${fmtDate(r.period_start)} - ${fmtDate(r.period_end)}`,
          r.active_users,
          r.new_enrollments,
          r.completion_rate != null ? `${r.completion_rate}%` : null,
          <ExternalLink key="report_url" href={r.report_url} />,
          r.notes && <p className="line-clamp-3">{r.notes}</p>,
        ])}
      />
    </div>
  );
}

// ---------- 4. Jobs Created ----------

export async function JobsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_placements")
    .select("id, record_type, person_name, organization, role_title, start_date, contract_url, notes")
    .order("created_at", { ascending: false })
    .limit(LIMIT);
  const rows = data ?? [];
  const countOf = (t: (typeof JOB_RECORD_TYPES)[number]) => rows.filter((r) => r.record_type === t).length;

  return (
    <div className="space-y-6">
      <StatCards
        stats={[
          { label: "Total jobs created", value: rows.length },
          { label: "Alumni placements", value: countOf("alumni_placement") },
          { label: "Staff contracts", value: countOf("staff_contract") },
          { label: "Partner contracts", value: countOf("partner_contract") },
        ]}
      />
      <RecordForm kind="jobs" />
      <RecordsTable
        headers={["Type", "Person", "Organization", "Role", "Start date", "Contract"]}
        rows={rows.map((r) => [
          jobTypeLabel[r.record_type as (typeof JOB_RECORD_TYPES)[number]],
          <span key="person" className="text-white">{r.person_name}</span>,
          r.organization,
          r.role_title,
          fmtDate(r.start_date),
          <ExternalLink key="contract_url" href={r.contract_url} />,
        ])}
      />
    </div>
  );
}
