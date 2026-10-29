import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ChartColumn, ClipboardCheck, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { METRIC_KINDS, type MetricKind } from "./fields";
import { JobsSection, RevenueSection, TestingSection, UsersSection } from "./sections";

export const metadata: Metadata = { title: "Impact Dashboard" };

const TABS: Record<MetricKind, { label: string; description: string; icon: typeof Wallet; Section: () => Promise<React.ReactNode> }> = {
  testing: {
    label: "Customer Testing",
    description: "Testing records, customer feedback and testimonials.",
    icon: ClipboardCheck,
    Section: TestingSection,
  },
  revenue: {
    label: "Revenue & Customers",
    description: "Sales records, payment confirmations and revenue.",
    icon: Wallet,
    Section: RevenueSection,
  },
  users: {
    label: "Active Users",
    description: "Live enrollment metrics and periodic analytics reports.",
    icon: ChartColumn,
    Section: UsersSection,
  },
  jobs: {
    label: "Jobs Created",
    description: "Alumni placements, staff and partner contracts.",
    icon: Briefcase,
    Section: JobsSection,
  },
};

export default async function ImpactPage({ searchParams }: PageProps<"/admin/impact">) {
  await requireAdmin();
  const { tab } = await searchParams;
  const active: MetricKind = METRIC_KINDS.includes(tab as MetricKind) ? (tab as MetricKind) : "testing";
  const { Section, description } = TABS[active];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-white">Impact & Business Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">{description}</p>

      <nav className="mt-6 flex gap-2 overflow-x-auto border-b border-white/10">
        {METRIC_KINDS.map((kind) => {
          const { label, icon: Icon } = TABS[kind];
          return (
            <Link
              key={kind}
              href={`/admin/impact?tab=${kind}`}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm whitespace-nowrap transition ${
                kind === active
                  ? "border-brand-400 text-brand-300"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <Section />
      </div>
    </div>
  );
}
