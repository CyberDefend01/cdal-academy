import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Quote,
  ShieldCheck,
  Star,
  Terminal,
  Users,
} from "lucide-react";
import { getPublishedCourses, levelLabel } from "@/lib/courses";
import { getPublicStats, getPublicTestimonials } from "@/lib/landing";

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
  "inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-navy-950 transition hover:bg-cyan-400";
const buttonSecondary =
  "inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5";

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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.15),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
              An initiative of Cyber Defend Africa Ltd
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Train to defend Africa&apos;s digital future.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Cyber Defend Academy turns curious beginners and IT professionals into job-ready
              cybersecurity practitioners through structured, hands-on training.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className={buttonPrimary}>
                Apply now <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/courses" className={buttonSecondary}>
                Explore courses
              </Link>
            </div>
          </div>

          {/* Decorative terminal */}
          <div aria-hidden className="hidden rounded-2xl border border-white/10 bg-navy-900/80 shadow-2xl shadow-cyan-500/5 lg:block">
            <div className="flex gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-400/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            </div>
            <pre className="overflow-hidden p-5 font-mono text-sm leading-7 text-slate-300">
              <span className="text-cyan-400">student@cda</span>:~$ nmap -sV lab.range.local{"\n"}
              <span className="text-slate-500">PORT    STATE  SERVICE</span>{"\n"}
              22/tcp  open   ssh{"\n"}
              443/tcp open   https{"\n"}
              <span className="text-cyan-400">student@cda</span>:~$ ./harden --apply{"\n"}
              <span className="text-emerald-400">[OK]</span> Firewall policy installed{"\n"}
              <span className="text-emerald-400">[OK]</span> Threat neutralised{"\n"}
              <span className="text-cyan-400">student@cda</span>:~$ <span className="animate-pulse">_</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Impact metrics (only shown once there is real data) */}
      {metrics.length > 0 && (
        <section className="border-b border-white/10 bg-navy-900">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto h-6 w-6 text-cyan-400" aria-hidden />
                <p className="mt-2 text-3xl font-bold text-white">{value.toLocaleString("en")}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Who we are</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Building Africa&apos;s cyber workforce</h2>
          </div>
          <p className="text-slate-300">
            Cyber Defend Africa Ltd works to strengthen the security of organisations across the
            continent. Cyber Defend Academy is its training initiative: a structured academy that
            prepares the next generation of defenders with practical skills, recognised
            certifications and a path into the industry.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-white/10 bg-navy-900 p-5">
              <Icon className="h-6 w-6 text-cyan-400" aria-hidden />
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      {courses && courses.length > 0 && (
        <section className="border-y border-white/10 bg-navy-900">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Programs</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Choose your track</h2>
              </div>
              <Link href="/courses" className="inline-flex items-center gap-1 text-cyan-400 hover:underline">
                Full catalog <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {courses.map((course, i) => (
                <Link
                  key={course.id}
                  href={`/apply?course=${encodeURIComponent(course.slug)}`}
                  className="group rounded-xl border border-white/10 bg-navy-950 p-6 transition hover:border-cyan-400/50"
                >
                  <p className="font-mono text-sm text-slate-500">0{i + 1} · {levelLabel[course.level]}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{course.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{course.summary}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-400">
                    Apply <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (only those marked public by an admin) */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold text-white">What our learners and partners say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-xl border border-white/10 bg-navy-900 p-6">
                <Quote className="h-6 w-6 text-cyan-400/60" aria-hidden />
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
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-navy-700 to-navy-900 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Ready to start your cybersecurity career?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Applications are open. Pick a track, tell us about yourself, and our admissions team
            will be in touch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/apply" className={buttonPrimary}>
              Apply now <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="mailto:info@cyberdefendafrica.org" className={buttonSecondary}>
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
