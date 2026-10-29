import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  CircleCheck,
  GraduationCap,
  Mail,
  Quote,
  Radar,
  ShieldCheck,
  Star,
  Terminal,
  Users,
} from "lucide-react";
import { CountUp } from "@/components/count-up";
import { InstagramIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TypingTerminal } from "@/components/typing-terminal";
import { getPublishedCourses, levelLabel } from "@/lib/courses";
import { getPublicStats, getPublicTestimonials } from "@/lib/landing";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

const features = [
  {
    icon: Terminal,
    title: "Hands-on cyber range",
    text: "Practise real attack and defence techniques in isolated lab environments, not just slides.",
  },
  {
    icon: ShieldCheck,
    title: "Industry-aligned tracks",
    text: "A clear path from fundamentals to ethical hacking and enterprise Check Point administration.",
  },
  {
    icon: Users,
    title: "Mentorship & community",
    text: "Learn alongside a cohort, guided by practitioners from Cyber Defend Africa.",
  },
  {
    icon: Briefcase,
    title: "Career support",
    text: "We connect graduates with employers and partners building Africa's security workforce.",
  },
];

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 hover:shadow-brand-500/50";
const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-brand-400/60 hover:bg-white/5";
const eyebrow = "text-sm font-medium uppercase tracking-[0.2em] text-brand-400";

export default async function HomePage() {
  const [stats, testimonials, courses] = await Promise.all([
    getPublicStats(),
    getPublicTestimonials(),
    getPublishedCourses(),
  ]);

  const metrics = stats
    ? [
        { label: "Students trained", value: stats.students, icon: Users },
        { label: "Graduates", value: stats.graduates, icon: GraduationCap },
        { label: "Alumni placed in jobs", value: stats.placements, icon: Briefcase },
        { label: "Specialist tracks", value: stats.courses, icon: ShieldCheck },
      ].filter((m) => m.value > 0)
    : [];
  // Only show the strip once there is real impact (not just the course count).
  const hasImpact = !!stats && stats.students + stats.graduates + stats.placements > 0;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div aria-hidden className="cyber-grid animate-grid-pan absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(29,108,212,0.25),transparent_55%)]" />
        <div aria-hidden className="animate-scan pointer-events-none motion-reduce:hidden absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-transparent via-glow/10 to-transparent" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-glow opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-glow" />
              </span>
              An initiative of Cyber Defend Africa Ltd
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Train to defend <span className="text-gradient">Africa&apos;s digital future.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Cyber Defend Academy turns curious beginners and IT professionals into job-ready
              cybersecurity practitioners through structured, hands-on training.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/apply" className={buttonPrimary}>
                Apply now <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/courses" className={buttonSecondary}>
                Explore courses
              </Link>
            </div>
          </div>

          {/* Emblem with orbiting rings + live terminal */}
          <div className="relative">
            <div aria-hidden className="relative mx-auto -mb-10 hidden h-64 w-64 items-center justify-center sm:flex">
              <svg viewBox="0 0 200 200" className="animate-spin-slow absolute inset-0 text-brand-400/40">
                <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 10" />
              </svg>
              <svg viewBox="0 0 200 200" className="animate-spin-slower absolute inset-6 text-glow/30">
                <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="60 40 10 40" />
              </svg>
              <div className="animate-float">
                <Logo size={150} className="animate-glow-pulse drop-shadow-none" />
              </div>
            </div>
            <div className="relative">
              <TypingTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Impact metrics (only once there is real data) ---------- */}
      {hasImpact && (
        <section className="border-b border-white/10 bg-navy-900/60">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-16 gap-y-8 px-4 py-12">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto h-6 w-6 text-brand-400" aria-hidden />
                <p className="mt-2 text-4xl font-bold text-white">
                  <CountUp value={value} />
                </p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Services ---------- */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
        <Reveal>
          <p className={eyebrow}>Our services</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Training people. Building tools.</h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            Cyber Defend Africa Ltd strengthens the continent&apos;s security on two fronts: developing
            skilled defenders, and creating open technology that helps them work faster.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="glow-card flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-8">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-brand-500/15 p-3 text-brand-300">
                  <GraduationCap className="h-6 w-6" aria-hidden />
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  Admissions open
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">Cyber Defend Academy</h3>
              <p className="mt-3 text-slate-400">
                Structured, hands-on cybersecurity training for beginners and IT professionals,
                from core fundamentals to offensive security and enterprise firewall administration.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                {["Three specialist tracks: Fundamentals, Ethical Hacking, CCSA", "Practical labs in an isolated cyber range", "Mentorship and career support"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="mt-auto inline-flex items-center gap-1.5 pt-8 font-medium text-brand-300 hover:text-white">
                Explore courses <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="glow-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-8">
              <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-glow/10 blur-3xl" />
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-glow/10 p-3 text-glow">
                  <Radar className="h-6 w-6" aria-hidden />
                </span>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                  In development · Open source
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">SignalSOC Africa</h3>
              <p className="text-sm font-medium text-glow">AI-Powered SOC Analyst Assistant</p>
              <p className="mt-3 text-slate-400">
                An open-source AI assistant that helps security analysts investigate alerts from
                Wazuh, cutting through alert overload so real threats get attention sooner.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                {["Explains alerts in simple English, with the evidence", "Suggests safe investigation steps and flags missing information", "Prepares reports, while human analysts make the decisions"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-glow" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/signalsoc" className="mt-auto inline-flex items-center gap-1.5 pt-8 font-medium text-glow hover:text-white">
                Learn about SignalSOC <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ---------- Why the Academy ---------- */}
      <section className="border-y border-white/10 bg-navy-900/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className={eyebrow}>Who we are</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Building Africa&apos;s cyber workforce</h2>
            </div>
            <p className="text-slate-300 lg:pt-8">
              Cyber Defend Academy is the training initiative of Cyber Defend Africa Ltd: a
              structured academy that prepares the next generation of defenders with practical
              skills, recognised certifications and a path into the industry.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="glow-card h-full rounded-xl border border-white/10 bg-navy-900 p-6">
                  <span className="inline-flex rounded-lg bg-brand-500/15 p-2.5 text-brand-300">
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

      {/* ---------- Programs ---------- */}
      {courses && courses.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={eyebrow}>Programs</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Choose your track</h2>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-1 text-brand-300 hover:text-white">
              Full catalog <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={i * 100}>
                <Link
                  href={`/apply?course=${encodeURIComponent(course.slug)}`}
                  className="glow-card group flex h-full flex-col rounded-xl border border-white/10 bg-navy-900 p-6"
                >
                  <p className="font-mono text-sm text-slate-500">
                    0{i + 1} · {levelLabel[course.level]} · {course.duration_weeks} weeks
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{course.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{course.summary}</p>
                  <p className="mt-auto inline-flex items-center gap-1 pt-5 text-sm text-brand-300">
                    Apply <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Testimonials (only those marked public by an admin) ---------- */}
      {testimonials.length > 0 && (
        <section className="border-t border-white/10 bg-navy-900/50">
          <div className="mx-auto max-w-6xl px-4 py-24">
            <Reveal>
              <p className={eyebrow}>Testimonials</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">What our learners and partners say</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 100}>
                  <figure className="glow-card h-full rounded-xl border border-white/10 bg-navy-900 p-6">
                    <Quote className="h-6 w-6 text-brand-400/60" aria-hidden />
                    <blockquote className="mt-3 text-slate-200">{t.testimonial}</blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-medium text-white">{t.tester_name}</span>
                      {t.organization && <span className="text-slate-400"> · {t.organization}</span>}
                      {t.rating && (
                        <span className="mt-1 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                          {Array.from({ length: t.rating }, (_, k) => (
                            <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                          ))}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Final CTA + contact ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 p-8 text-center sm:p-14">
            <div aria-hidden className="cyber-grid absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to start your cybersecurity career?</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">
                Applications are open. Pick a track, tell us about yourself, and our admissions
                team will be in touch.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/apply" className={buttonPrimary}>
                  Apply now <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className={buttonSecondary}>
                  <Mail className="h-4 w-4" aria-hidden /> Email us
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                  <InstagramIcon className="h-4 w-4" /> @{INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
