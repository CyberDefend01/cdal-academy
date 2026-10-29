"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Terminal,
  Users,
  Wallet,
} from "lucide-react";

const items = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/courses", label: "My Courses", icon: BookOpen },
  { href: "/portal/labs", label: "Practical Labs / Cyber Range", icon: Terminal },
  { href: "/portal/records", label: "Academic Records", icon: FileText },
  { href: "/portal/finance", label: "Finance & Funding", icon: Wallet },
  { href: "/portal/community", label: "Community", icon: Users },
  { href: "/portal/account", label: "Account & Help", icon: CircleHelp },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/portal" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
              active ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
