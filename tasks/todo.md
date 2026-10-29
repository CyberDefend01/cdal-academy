# Cyber Defend Academy — Build Plan

Stack: Next.js (App Router, Server Actions) + TypeScript + Tailwind CSS + Lucide React + Supabase (`@supabase/ssr`), deployed on Vercel.

## Key design decisions (please confirm)
- **Application statuses:** `pending` → `accepted` | `rejected`. In the UI, "accepted" is shown as "Admitted".
- **Temporary credentials:** When an admin accepts an application, a server action:
  1. creates the Supabase Auth user with the **service-role key**, which is used only on the server;
  2. generates a random temporary password with `crypto.randomBytes`;
  3. sets the profile to `role = student`, `must_change_password = true` and creates the enrollment.

  The password appears **once** in a modal for the admin to pass on. It is never stored in the database.
- **First login:** a student who still has `must_change_password = true` is sent to `/portal/change-password` before they can use the portal.
- **Access guard:** `/portal/*` needs a logged-in user with `role = student` and an `accepted` application. `/admin/*` needs `role = admin`. Both are checked on the server, and RLS enforces them again in the database.
- **Public apply form:** submitted through a server action with server-side validation (zod) and a honeypot field. The RLS insert policy only allows `status = 'pending'`, so a submission cannot set its own status.
- **First admin account:** created by hand (sign up, then a one-line SQL `update profiles set role='admin'`). This is documented in the README.

## Phase 1 — Project setup + database + application workflow (this round)
- [x] Scaffold Next.js app (Next 16.4, TypeScript, Tailwind 4, App Router, `src/` dir) and install `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `zod`
- [x] Add `.env.example` with the required variables (no real secrets); make sure `.gitignore` covers `.env.local`
- [x] Supabase clients: server client (cookies) and admin client (secret key, `server-only`). The browser client was dropped because nothing uses it.
- [x] `src/proxy.ts` (Next 16's name for middleware): refreshes the session cookie and redirects logged-out users away from `/portal` and `/admin`
- [x] SQL migration `supabase/migrations/0001_init.sql`:
  - [x] enums: `user_role`, `application_status`, `course_level` (+ enrollment, payment and job record types)
  - [x] `profiles` (linked to `auth.users`, plus a trigger that creates a profile on signup)
  - [x] `courses` (seeded with Fundamentals, Ethical Hacking, CCSA), `enrollments`, `exam_schedules`
  - [x] `applications`
  - [x] metrics tables: `customer_tests`, `revenue_records`, `active_user_reports`, `job_placements`
  - [x] `is_admin()` helper function and RLS policies on every table
  - [x] Tested against real Postgres (PGlite): 16 RLS/constraint checks pass
- [x] Shared dark navy theme + public navbar/footer
- [x] `/courses` page (reads courses from the DB)
- [x] `/apply` page + `submitApplication` server action + success state
- [x] `npm run build` and lint pass; smoke test of `/`, `/courses`, `/apply` and the `/portal` redirect

Note: Next 16 turned Cache Components on by default. I switched it off in `next.config.ts` to keep auth pages simple.

## Phase 2 — Admin admissions
- [x] `/login` page (email + password, generic error, redirect by role) + sign-out
- [x] Admin guard (`requireAdmin`) in the layout, in each page, and inside each server action + admin layout with sidebar
- [x] `/admin/applications` list (Pending / Admitted / Rejected / All) + detail view
- [x] `acceptApplication` / `rejectApplication` server actions: atomic "only if still pending" claim, temporary password from `crypto.randomInt`, account creation, enrollment; rolls back if account creation fails
- [x] One-time credentials modal with "Copy message" (the admin sends it to the student; there's no automatic email yet)
- [x] Build + lint pass; the browser bundle has no secret or admin code; `/admin/*` redirects to `/login` when logged out
- Not yet tested against a live Supabase project (none connected yet)

## Phase 3 — Student portal
- [x] `requireStudent()` guard: logged in + role `student` + active/completed enrollment; temporary-password users are sent to `/portal/change-password`
- [x] Forced password change page + server action (12+ characters, mixed case and a number; clears the flag through `complete_password_change()`)
- [x] Portal layout with sidebar (Overview, My Courses, Practical Labs / Cyber Range, Academic Records, Finance & Funding, Community, Account & Help)
- [x] Overview: welcome banner with course and cohort progress, 4 stat cards, exam schedule, course registration (links to `/apply` for courses not yet taken)
- [x] My Courses page with progress; Account & Help page
- [x] "Coming soon" pages for Labs, Records, Finance and Community
- [x] Build + lint pass; all `/portal/*` routes redirect to `/login` when logged out

## Phase 4 — Admin impact dashboard + landing page
- [x] `/admin/impact` with 4 tabs: Customer Testing, Revenue & Customers, Active Users, Jobs Created. Each has summary cards, an "Add record" form and a records table. Active Users also shows live enrollment and student counts.
- [x] `addMetricRecord` server action: admin check, strict zod validation per section, only http(s) links allowed (so a link can't run script), inserts through RLS
- [x] Migration `0002_public_stats.sql`: `get_public_stats()` returns totals only, for the public site (tested in PGlite)
- [x] Landing page: hero, impact metrics (real data only, hidden while zero), about + features, programs, testimonials (only admin-approved ones), final CTA
- [x] Support email `info@cyberdefendafrica.org` added to Account & Help and the footer
- [x] Build + lint pass; smoke tests pass

## Phase 5 — Wrap-up
- [x] README: Supabase setup, running the migrations, creating the first admin, Vercel env vars, security model
- [x] `npm run build` + lint pass
- [x] Security review (no secrets in client bundles, RLS checked, server-side auth checks); 2 issues found and fixed (see below)
- [x] Review section below

## Phase 6: Modern animated redesign, SignalSOC Africa, contact details

### Decisions (please confirm)
- **Animations use plain CSS plus one small helper component.** No new animation library, which keeps the site fast. Everything animated respects the visitor's "reduce motion" setting.
- **Brand colour:** switch the cyan accent to the royal blue from the logo, with a cyan highlight for glows.
- **Services:** I'll describe only what you've told me about: **Cyber Defend Academy** (training) and **SignalSOC Africa**. I won't invent other services.
- **SignalSOC wording:** your text says the organisation *proposes* to build SignalSOC Africa, so the site will label it **"In development · Open source"** rather than present it as a finished product.

### Tasks
- [x] Brand colours: logo blue as the main accent, cyan for glows (one place in `globals.css`)
- [x] Animation building blocks in CSS: moving grid, scan line, glow pulse, typing cursor, fade-up on scroll; turned off for visitors who prefer reduced motion
- [x] Small `Reveal` component that fades sections in as you scroll
- [x] Hero: animated cyber grid background, logo with a pulsing glow, terminal that types out lines, number counters that count up
- [x] Cards: glowing border on hover, slight lift (courses, features, services)
- [x] **Services section** on the landing page: Academy + SignalSOC Africa cards
- [x] **`/signalsoc` page:** the problem, what the tool does, how it will be tested (200+ alerts), "human analysts stay in charge", open source, based in Gombe State, Nigeria
- [x] Add "SignalSOC" to the top navigation
- [x] Contact: replace the email with `info@cyberdefendafricaltd.org` everywhere (3 places), add an Instagram link (@cyberdefendafrica) in the footer and contact section
- [x] Footer redesign: logo, short description, links, contact, Instagram
- [x] Build, lint, screenshots (desktop and phone), security check (external links use `rel="noopener noreferrer"`)
- [x] Commit and push (the logo changes from the previous step are included)
- [x] Extra: impact strip only shows once students, graduates or placements are above zero; scan line hidden when motion is reduced; header and footer include a phone menu and Instagram

## Review

### What was built
- **Public site:** a landing page (hero, impact metrics from real data, about, programs, testimonials, CTA), the `/courses` catalog, and `/apply` with server-side validation and a spam honeypot.
- **Admissions:** `/login`, plus `/admin/applications` with a status filter, detail view and Accept/Reject. Accepting creates the student account with a temporary password (shown once), enrolls the student, and rolls back if account creation fails.
- **Student portal:** a guard (student role + active enrollment), forced password change on first login, a 7-section sidebar, an Overview dashboard (welcome banner, progress, stats, exam schedule, course registration), My Courses, and Account & Help.
- **Impact dashboard:** 4 tabs (Customer Testing, Revenue & Customers, Active Users, Jobs Created), each with summary cards, an add-record form and a records table.
- **Database:** 2 migrations covering 9 tables, RLS on all of them, column-level grants, and 3 security-definer functions (`is_admin`, `get_public_stats`, `get_public_testimonials`).

### Security review
**Fixed during review:**
1. **Students could skip the forced password change.** The old `complete_password_change()` RPC was callable by any signed-in user, so a student could clear the flag without changing the temporary password. The function was removed; the flag is now cleared on the server, and only after `updateUser` succeeds.
2. **Private feedback was publicly readable.** The public testimonials RLS policy exposed every column of public rows, including private `feedback`, through the Supabase API. The policy was replaced with `get_public_testimonials()`, which returns only safe columns, and all anon access to `customer_tests` was revoked.
3. **Hardening:** added an HSTS header and removed an unused env var.

**Verified:**
- 20/20 database checks pass in PGlite (real Postgres).
- The browser bundle has no secret key or admin code; there are no hard-coded keys; `npm audit` reports 0 vulnerabilities.
- Every `/admin/*` and `/portal/*` route redirects to `/login` when logged out; the admin role is re-checked inside every server action.
- Login errors are generic, so they don't reveal which accounts exist; redirects are role-based, so there is no open-redirect risk.
- Admin-entered links are restricted to http(s), which prevents `javascript:` links.

**Recommendations (not done, need decisions or a live project):**
- Turn off public sign-ups in Supabase Auth (documented in the README).
- Add rate limiting to `/apply`, for example with the Vercel Firewall. Supabase already rate-limits logins.
- Consider sending admission emails automatically (for example with Resend) instead of copying the message by hand.
- Consider a Content-Security-Policy header once the set of third-party scripts is final.

### Live end-to-end test (Supabase project `aasqcutsgaejayauqybk`)
- Both migrations were applied with `supabase db push`, and the admin account was created.
- A browser test in headless Chrome passed 16 checks: apply → admin accepts → temporary password shown → student is forced to change it → portal → student is blocked from `/admin` → login with the new password. It also covered adding an impact record and rejecting a `javascript:` link.
- **Bug found and fixed:** after a validation error, the apply and impact forms cleared what the user had typed (React resets forms after an action, and `<select>` inputs didn't refill). Both forms now keep everything the user entered.
- All test users, applications and records were deleted afterwards.
