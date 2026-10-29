-- =============================================================
-- Cyber Defend Academy - initial schema
-- Run in Supabase Dashboard -> SQL Editor (or `supabase db push`).
-- =============================================================

-- ---------- Enums ----------
create type public.user_role as enum ('admin', 'student', 'applicant');
create type public.application_status as enum ('pending', 'accepted', 'rejected');
create type public.course_level as enum ('beginner', 'intermediate', 'advanced');
create type public.enrollment_status as enum ('active', 'completed', 'withdrawn');
create type public.payment_status as enum ('pending', 'confirmed', 'refunded', 'failed');
create type public.job_record_type as enum ('alumni_placement', 'staff_contract', 'partner_contract');

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.user_role not null default 'applicant',
  must_change_password boolean not null default false,
  created_at timestamptz not null default now()
);

-- Every new auth user gets a profile. The role is ALWAYS 'applicant' here;
-- user-supplied metadata is never trusted for the role. Admins promote users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, left(new.raw_user_meta_data ->> 'full_name', 120));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by RLS policies.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- ---------- Courses ----------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text not null,
  summary text not null,
  description text not null,
  level public.course_level not null,
  duration_weeks integer not null check (duration_weeks > 0),
  highlights text[] not null default '{}',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Applications ----------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) <= 30),
  country text not null check (char_length(country) <= 80),
  education_level text not null check (char_length(education_level) <= 80),
  occupation text check (char_length(occupation) <= 120),
  experience_level text not null check (char_length(experience_level) <= 80),
  motivation text not null check (char_length(motivation) between 50 and 2000),
  how_heard text check (char_length(how_heard) <= 120),
  status public.application_status not null default 'pending',
  admin_notes text,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- One open application per email per course.
create unique index applications_one_pending_per_course
  on public.applications (lower(email), course_id)
  where status = 'pending';

create index applications_status_idx on public.applications (status, created_at desc);

-- ---------- Enrollments ----------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id),
  application_id uuid references public.applications (id) on delete set null,
  cohort text,
  status public.enrollment_status not null default 'active',
  progress integer not null default 0 check (progress between 0 and 100),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- ---------- Exam schedules ----------
create table public.exam_schedules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 120,
  location text,
  created_at timestamptz not null default now()
);

-- ---------- Admin impact metrics ----------
-- 1. Customer Testing: testing records, feedback, testimonials
create table public.customer_tests (
  id uuid primary key default gen_random_uuid(),
  tester_name text not null,
  organization text,
  test_type text not null,
  test_date date not null default current_date,
  rating integer check (rating between 1 and 5),
  feedback text,
  testimonial text,
  is_public_testimonial boolean not null default false,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- 2. Revenue & Customers: sales records, payment confirmations
create table public.revenue_records (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text,
  description text not null,
  course_id uuid references public.courses (id),
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'NGN',
  payment_status public.payment_status not null default 'pending',
  payment_reference text,
  paid_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- 3. Active Users: periodic analytics reports (report_url can point to a screenshot)
create table public.active_user_reports (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null check (period_end >= period_start),
  active_users integer not null check (active_users >= 0),
  new_enrollments integer not null default 0 check (new_enrollments >= 0),
  completion_rate numeric(5, 2) check (completion_rate between 0 and 100),
  report_url text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- 4. Jobs Created: alumni placements, staff and partner contracts
create table public.job_placements (
  id uuid primary key default gen_random_uuid(),
  record_type public.job_record_type not null,
  person_name text not null,
  organization text not null,
  role_title text not null,
  start_date date,
  contract_url text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.applications enable row level security;
alter table public.enrollments enable row level security;
alter table public.exam_schedules enable row level security;
alter table public.customer_tests enable row level security;
alter table public.revenue_records enable row level security;
alter table public.active_user_reports enable row level security;
alter table public.job_placements enable row level security;

-- Profiles: users read their own; admins read and manage all.
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Users may only change harmless columns; role and flags are changed
-- server-side by admins (secret key) or via complete_password_change().
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Courses: anyone can read published courses; admins manage.
create policy "courses: public read published" on public.courses
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "courses: admin write" on public.courses
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Applications: anyone can submit a PENDING application, nothing else.
create policy "applications: public submit pending" on public.applications
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and user_id is null
    and admin_notes is null
  );

-- Only these columns may be supplied on insert; status etc. use defaults.
revoke insert, update, delete on public.applications from anon, authenticated;
grant insert (course_id, full_name, email, phone, country, education_level,
              occupation, experience_level, motivation, how_heard)
  on public.applications to anon, authenticated;

create policy "applications: read own or admin" on public.applications
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- (Status changes are done server-side with the secret key after an admin check.)

-- Enrollments: students read their own; admins read all.
create policy "enrollments: read own or admin" on public.enrollments
  for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

revoke insert, update, delete on public.enrollments from anon, authenticated;

-- Exam schedules: visible to admins and students enrolled in that course.
create policy "exams: enrolled or admin" on public.exam_schedules
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.enrollments e
      where e.course_id = exam_schedules.course_id
        and e.student_id = (select auth.uid())
    )
  );

create policy "exams: admin write" on public.exam_schedules
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Metrics: admin only. (Public testimonials are served by
-- get_public_testimonials() in 0002, which exposes only safe columns.)
create policy "customer_tests: admin all" on public.customer_tests
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "revenue: admin all" on public.revenue_records
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "active_users: admin all" on public.active_user_reports
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "jobs: admin all" on public.job_placements
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Metrics tables are never readable by anon at the grant level either.
revoke all on public.customer_tests, public.revenue_records, public.active_user_reports, public.job_placements from anon;

-- =============================================================
-- Seed: official course catalog
-- (Durations/highlights are starting values - edit to match the real syllabus.)
-- =============================================================
insert into public.courses (slug, title, short_title, summary, description, level, duration_weeks, highlights, sort_order)
values
  (
    'fundamentals-of-cybersecurity',
    'Fundamentals of Cybersecurity',
    'Fundamentals',
    'Your entry point into security: core concepts, threats and defensive practices.',
    'An introductory track for beginners covering networking basics, the threat landscape, security principles, operating system hardening, and incident awareness. No prior security experience required.',
    'beginner',
    8,
    array['Networking & OS essentials', 'Threats, vulnerabilities & risk', 'Security controls & hygiene', 'Hands-on beginner labs'],
    1
  ),
  (
    'ethical-hacking',
    'Ethical Hacking',
    'Ethical Hacking',
    'Think like an attacker: penetration testing and offensive security, done legally.',
    'An intermediate track on penetration testing methodology: reconnaissance, scanning, exploitation, web application attacks, privilege escalation and professional reporting, practised in an isolated cyber range.',
    'intermediate',
    12,
    array['Recon & vulnerability scanning', 'Web & network exploitation', 'Privilege escalation', 'Pentest reporting'],
    2
  ),
  (
    'ccsa',
    'Certified Checkpoint Security Administrator (CCSA)',
    'CCSA',
    'Enterprise firewall administration on Check Point security gateways.',
    'An advanced enterprise track preparing learners to deploy, configure and manage Check Point security gateways and management servers, including policy management, NAT, VPN, user access and monitoring.',
    'advanced',
    10,
    array['Gateway & management deployment', 'Security policy & NAT', 'Site-to-site VPN', 'Logging, monitoring & exam prep'],
    3
  );
