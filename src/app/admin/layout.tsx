import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "@/lib/auth-actions";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | Cyber Defend Academy" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-white/10 bg-navy-900 md:w-64 md:border-r md:border-b-0">
        <Link href="/admin/applications" className="flex items-center gap-2 px-5 py-4 font-semibold text-white">
          <Logo size={32} />
          CDA Admin
        </Link>
        <AdminNav />
        <div className="mt-auto border-t border-white/10 p-4 text-sm">
          <p className="truncate text-slate-400">{admin.email}</p>
          <form action={signOut}>
            <button className="mt-2 flex items-center gap-2 text-slate-300 hover:text-white">
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
