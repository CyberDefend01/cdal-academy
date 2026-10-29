import type { LucideIcon } from "lucide-react";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
    </header>
  );
}

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-navy-900 p-5">
      {title && <h2 className="mb-4 font-semibold text-white">{title}</h2>}
      {children}
    </section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-white/10"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-brand-400" style={{ width: `${value}%` }} />
    </div>
  );
}

export function ComingSoon({ icon: Icon, title, description, items }: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="max-w-3xl">
      <PageHeader title={title} description={description} />
      <Card>
        <Icon className="h-8 w-8 text-brand-400" aria-hidden />
        <p className="mt-3 text-slate-300">This section is being prepared. It will include:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
