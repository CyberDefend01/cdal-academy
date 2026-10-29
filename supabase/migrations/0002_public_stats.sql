-- Aggregate, non-personal numbers for the public landing page.
-- Runs as the owner so it can count rows the public cannot read directly,
-- but it only ever returns totals.
create function public.get_public_stats()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'students', (select count(distinct student_id) from public.enrollments),
    'graduates', (select count(*) from public.enrollments where status = 'completed'),
    'placements', (select count(*) from public.job_placements where record_type = 'alumni_placement'),
    'courses', (select count(*) from public.courses where is_published)
  );
$$;

revoke execute on function public.get_public_stats() from public;
grant execute on function public.get_public_stats() to anon, authenticated;

-- Testimonials an admin marked public. Returns only display-safe columns
-- (never the private feedback field or who created the record).
create function public.get_public_testimonials()
returns table (id uuid, tester_name text, organization text, testimonial text, rating integer)
language sql
stable
security definer
set search_path = ''
as $$
  select id, tester_name, organization, testimonial, rating
  from public.customer_tests
  where is_public_testimonial and testimonial is not null
  order by test_date desc
  limit 6;
$$;

revoke execute on function public.get_public_testimonials() from public;
grant execute on function public.get_public_testimonials() to anon, authenticated;
