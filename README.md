# Cyber Defend Academy

Website, admissions system and student portal for **Cyber Defend Academy**, an initiative of **Cyber Defend Africa Ltd**.

Built with Next.js 16 (App Router, Server Actions), TypeScript, Tailwind CSS 4, Lucide icons and Supabase (Postgres, Auth, Row Level Security). Deploys to Vercel.

## What's included

| Area | Routes | Who can access |
|---|---|---|
| Public site | `/`, `/courses`, `/apply` | Everyone |
| Login | `/login` | Admitted students and admins |
| Admissions panel | `/admin/applications` | Admins |
| Impact & business dashboard | `/admin/impact` | Admins |
| Student portal | `/portal/*` | Students with an active enrollment |

**Admissions flow:**
1. Someone applies at `/apply`, and the application is saved as `pending`.
2. An admin opens it and clicks **Accept**. This creates the student's account with a random temporary password and enrolls them in the course.
3. The admin sees the login details **once** and sends them to the student (there is a "Copy message" button).
4. The student logs in and must set a new password before using the portal.

## Project structure

```
src/
  proxy.ts                    Refreshes the login session; redirects logged-out users away from /portal and /admin
  lib/
    supabase/server.ts        Supabase client acting as the signed-in user (RLS applies)
    supabase/admin.ts         Secret-key client (bypasses RLS); server-only, used in 2 admin-checked actions
    auth.ts                   getCurrentUser, requireAdmin, requireStudent
    auth-actions.ts           signIn / signOut
    password.ts               Temporary password generator
  app/
    (public)/                 Landing, courses, apply, login
    admin/applications/       Application review + accept/reject actions
    admin/impact/             Testing, Revenue, Active Users, Jobs dashboards
    portal/(dashboard)/       Student portal pages with sidebar
    portal/change-password/   First-login password change
supabase/migrations/          Database schema, security rules and seed data
```

## Setup

### 1. Create a Supabase project
1. Sign up at [supabase.com](https://supabase.com) and create a new project (the free tier is fine).
2. Open **SQL Editor** and run these files in order, pasting in each one's contents:
   - `supabase/migrations/0001_init.sql`: tables, security rules and the three courses
   - `supabase/migrations/0002_public_stats.sql`: public statistics and testimonials functions
   - `supabase/migrations/0003_course_durations.sql`: sets all courses to 4 weeks
3. Go to **Authentication → Sign In / Providers** and **turn off "Allow new users to sign up"**. Accounts are created only by admins when they accept an application.

### 2. Create the first admin
1. In Supabase, go to **Authentication → Users → Add user → Create new user**. Enter your email and a strong password, and tick "Auto Confirm User".
2. In **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

### 3. Run locally
```bash
cp .env.example .env.local    # then fill in the values (see below)
npm install
npm run dev                   # http://localhost:3000
```

### Environment variables

Find these in Supabase under **Project Settings → API Keys**.

| Variable | Where it's used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Your project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Publishable key (`sb_publishable_...`), which is safe to expose |
| `SUPABASE_SECRET_KEY` | **Server only** | Secret key (`sb_secret_...`). **Never** give it a `NEXT_PUBLIC_` prefix and never commit it |

## Deploy to Vercel
1. Push the project to a GitHub repository. `.env.local` is git-ignored and won't be pushed.
2. In Vercel, click **Add New → Project** and import the repository.
3. Under **Environment Variables**, add the three variables above.
4. Deploy.
5. In Supabase, go to **Authentication → URL Configuration** and set **Site URL** to your Vercel domain.

## Managing content
- **Courses:** edit the `courses` table in the Supabase Table Editor. The durations and highlights in the seed data are starting values, so update them to match the real syllabus.
- **Exams, cohorts, progress:** edit `exam_schedules` and `enrollments` (the `cohort` and `progress` columns) in the Table Editor.
- **Impact data:** add records in `/admin/impact`. Landing page statistics appear automatically once the numbers are above zero. Testimonials appear only when "Show testimonial on the public website" is ticked.

## Security model
- **Row Level Security** is enabled on every table. The public can only read published courses and submit `pending` applications. Students can read only their own data. Metrics and applications are admin-only.
- **Permissions are checked at several layers:** the proxy redirects logged-out users, each admin and portal layout and page checks the role on the server, every server action checks again, and the database rules apply underneath.
- **The secret key** is used only in server code marked `server-only`. The build fails if any browser code imports it.
- **Temporary passwords** are generated with `crypto.randomInt`, shown once, and never stored or logged. Students must replace them before using the portal.
- **Security headers:** HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` and `Permissions-Policy`.
- **Input validation:** all forms are validated on the server with zod, and admin-entered links must be `http(s)`.

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (also runs the type check) |
| `npm run lint` | ESLint |
