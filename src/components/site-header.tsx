import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/signalsoc", label: "SignalSOC" },
  { href: "/apply", label: "Apply" },
];

const loginClass =
  "rounded-lg border border-brand-400/40 px-3 py-1.5 text-brand-200 transition hover:border-brand-400 hover:bg-brand-500/10";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <Logo size={38} />
          <span className="leading-tight">
            Cyber Defend <span className="text-brand-400">Academy</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className={loginClass}>
            Portal Login
          </Link>
        </nav>

        {/* Mobile: no-JS dropdown */}
        <details className="relative md:hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="cursor-pointer list-none rounded-lg p-2 text-slate-200 hover:bg-white/5" aria-label="Menu">
            <Menu className="h-6 w-6" aria-hidden />
          </summary>
          <nav className="absolute right-0 mt-2 flex w-48 flex-col gap-1 rounded-xl border border-white/10 bg-navy-900 p-2 text-sm shadow-2xl">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className={`${loginClass} mt-1 text-center`}>
              Portal Login
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
