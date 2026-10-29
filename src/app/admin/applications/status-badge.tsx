export type ApplicationStatus = "pending" | "accepted" | "rejected";

const styles: Record<ApplicationStatus, string> = {
  pending: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  accepted: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  rejected: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
};

const labels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  accepted: "Admitted",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
