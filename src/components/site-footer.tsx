import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

const explore = [
  { href: "/courses", label: "Courses" },
  { href: "/signalsoc", label: "SignalSOC Africa" },
  { href: "/apply", label: "Apply" },
  { href: "/login", label: "Portal Login" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="font-semibold text-white">Cyber Defend Academy</p>
              <p className="text-sm text-slate-400">An initiative of Cyber Defend Africa Ltd</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Training Africa&apos;s next generation of cybersecurity professionals and building
            open tools that make security work easier.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-slate-400 transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0" aria-hidden /> <span className="break-all">{CONTACT_EMAIL}</span>
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 transition hover:text-white"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" /> @{INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Cyber Defend Africa Ltd. All rights reserved.
      </div>
    </footer>
  );
}
