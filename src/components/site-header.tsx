import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/apply", label: "Apply" },
  { href: "/login", label: "Portal Login" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <ShieldCheck className="h-6 w-6 text-cyan-400" aria-hidden />
          <span>
            Cyber Defend <span className="text-cyan-400">Academy</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
