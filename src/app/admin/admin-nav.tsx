"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartColumn, Inbox } from "lucide-react";

const items = [
  { href: "/admin/applications", label: "Applications", icon: Inbox },
  { href: "/admin/impact", label: "Impact Dashboard", icon: ChartColumn },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
              active ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
