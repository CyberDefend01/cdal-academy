import type { Metadata } from "next";
import { Fragment } from "react";
import {
  ArrowRight,
  Ban,
  BrainCircuit,
  Code,
  FileCheck,
  FileText,
  FlaskConical,
  ListChecks,
  Mail,
  MapPin,
  MessageSquareText,
  Radar,
  ScanSearch,
  SearchCheck,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "SignalSOC Africa",
  description:
    "SignalSOC Africa: an open-source AI assistant that helps security analysts investigate Wazuh alerts. A Cyber Defend Africa Ltd project.",
};

const flow = [
  { icon: ShieldAlert, title: "Security alert", text: "From Wazuh or sample log files" },
  { icon: BrainCircuit, title: "SignalSOC analysis", text: "Explains, gathers evidence, suggests steps" },
  { icon: UserCheck, title: "Analyst decides", text: "A human reviews the report and acts" },
];

const capabilities = [
  { icon: MessageSquareText, title: "Explains alerts in simple English", text: "Turns technical alert data into a clear description of what may be happening." },
  { icon: ScanSearch, title: "Shows the available evidence", text: "Lists the log entries and details that support each explanation." },
  { icon: ListChecks, title: "Suggests safe investigation steps", text: "Recommends careful, non-disruptive next steps for the analyst to follow." },
  { icon: SearchCheck, title: "Identifies missing information", text: "Points out what is still unknown before a conclusion can be reached." },
  { icon: FileText, title: "Prepares reports for analysts", text: "Drafts a structured report that a human analyst can review and finalise." },
];

const testing = [
  "At least 200 sample security alerts, in a controlled laboratory",
  "Measuring the accuracy of its explanations",
  "Checking how well it identifies false alarms",
  "Checking that its reports are useful and supported by evidence",
];

const eyebrow = "text-sm font-medium uppercase tracking-[0.2em] text-glow";

export default function SignalSocPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden className="cyber-grid animate-grid-pan absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.14),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
            <Radar className="h-3.5 w-3.5" aria-hidden /> In development · Open source
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            SignalSOC <span className="text-gradient">Africa</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-glow">AI-Powered SOC Analyst Assistant</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            An open-source AI assistant from Cyber Defend Africa Ltd that helps security analysts
            investigate alerts, so real threats get attention sooner.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
            >
              How it works <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("SignalSOC Africa")}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-glow/50 hover:bg-white/5"
            >
              <Mail className="h-4 w-4" aria-hidden /> Collaborate with us
            </a>
          </div>

          {/* Animated flow */}
          <div className="mt-16 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
            {flow.map(({ icon: Icon, title, text }, i) => (
              <Fragment key={title}>
                <div className="glow-card flex-1 rounded-2xl border border-white/10 bg-navy-900/80 p-5 backdrop-blur">
                  <Icon className={`mx-auto h-7 w-7 ${i === 1 ? "text-glow" : "text-brand-300"}`} aria-hidden />
                  <p className="mt-3 font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-400">{text}</p>
                </div>
                {i < flow.length - 1 && (
                  <div aria-hidden className="relative mx-auto h-8 w-px bg-white/10 md:mx-0 md:h-px md:w-12">
                    <span className="animate-flow absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_8px_2px_rgba(34,211,238,0.6)] md:block" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- The problem ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className={eyebrow}>The problem</p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Too many alerts, too little time</h2>
          </div>
          <div className="space-y-4 text-slate-300">
            <p>
              Cyberattacks can cause serious harm to businesses and important services. Security
              monitoring tools often generate many alerts, and analysts must spend time checking
              which alerts are real threats and which are false alarms.
            </p>
            <p>
              This can delay investigations, especially for small organizations with limited
              cybersecurity resources.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------- What it does ---------- */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-white/10 bg-navy-900/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <p className={eyebrow}>What SignalSOC does</p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">An assistant for every alert</h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              SignalSOC Africa uses alerts from <strong className="text-slate-200">Wazuh</strong>, an
              open-source security monitoring platform, or sample security log files.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="glow-card h-full rounded-xl border border-white/10 bg-navy-900 p-6">
                  <span className="inline-flex rounded-lg bg-glow/10 p-2.5 text-glow">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testing + safety ---------- */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-24 lg:grid-cols-2">
        <Reveal>
          <div className="glow-card h-full rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-8">
            <FlaskConical className="h-8 w-8 text-brand-300" aria-hidden />
            <h2 className="mt-5 text-2xl font-semibold text-white">Tested in the lab</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              {testing.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="glow-card h-full rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-8">
            <UserCheck className="h-8 w-8 text-emerald-300" aria-hidden />
            <h2 className="mt-5 text-2xl font-semibold text-white">Humans stay in charge</h2>
            <p className="mt-5 text-slate-300">
              SignalSOC Africa supports analysts. It does not replace them.
            </p>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li className="flex gap-2.5">
                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden /> It will not make final security decisions
              </li>
              <li className="flex gap-2.5">
                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden /> It will not automatically block systems
              </li>
              <li className="flex gap-2.5">
                <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden /> Every report is reviewed by a human analyst
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ---------- Open source + location ---------- */}
      <section className="border-t border-white/10 bg-navy-900/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 lg:grid-cols-2">
          <Reveal>
            <Code className="h-8 w-8 text-glow" aria-hidden />
            <h2 className="mt-5 text-3xl font-bold text-white">Open source, for everyone</h2>
            <p className="mt-4 text-slate-300">
              We will publish the source code, test examples, and technical instructions so students
              and independent security researchers can learn from and improve the project.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <MapPin className="h-8 w-8 text-brand-300" aria-hidden />
            <h2 className="mt-5 text-3xl font-bold text-white">Built in Gombe State, Nigeria</h2>
            <p className="mt-4 text-slate-300">
              The project is based in Gombe State, Nigeria, and its resources will be available to
              the wider global cybersecurity community.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Goal + CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-glow/20 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 p-8 text-center sm:p-14">
            <div aria-hidden className="cyber-grid absolute inset-0 opacity-60" />
            <div className="relative">
              <p className={eyebrow}>Our goal</p>
              <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-bold text-white sm:text-3xl">
                Make security investigations easier, and show how AI can support cybersecurity safely.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">
                Interested in testing, research or partnership? We&apos;d love to hear from you.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("SignalSOC Africa")}`}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
              >
                <Mail className="h-4 w-4" aria-hidden /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
