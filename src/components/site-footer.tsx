export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:justify-between">
        <p>
          <span className="font-medium text-slate-200">Cyber Defend Academy</span> - an initiative of
          Cyber Defend Africa Ltd.
        </p>
        <p>
          <a href="mailto:info@cyberdefendafrica.org" className="hover:text-white">
            info@cyberdefendafrica.org
          </a>{" "}
          &middot; &copy; {new Date().getFullYear()} Cyber Defend Africa Ltd
        </p>
      </div>
    </footer>
  );
}
