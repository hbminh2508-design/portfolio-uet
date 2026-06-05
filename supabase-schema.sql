create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id text primary key default 'main',
  full_name text not null default '',
  student_id text not null default '',
  class_name text not null default '',
  course_name text not null default '',
  intro_text text not null default '',
  avatar_url text,
  background_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  week_number smallint primary key check (week_number between 1 and 7),
  title text not null default '',
  description text not null default '',
  pdf_url text,
  updated_at timestamptz not null default now()
);

alter table public.assignments
alter column pdf_url drop not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.assignments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'public read profiles'
  ) then
    create policy "public read profiles"
    on public.profiles
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'public write profiles'
  ) then
    create policy "public write profiles"
    on public.profiles
    for all
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assignments' and policyname = 'public read assignments'
  ) then
    create policy "public read assignments"
    on public.assignments
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assignments' and policyname = 'public write assignments'
  ) then
    create policy "public write assignments"
    on public.assignments
    for all
    using (true)
    with check (true);
  end if;
end $$;

insert into public.profiles (id, full_name, student_id, class_name, course_name, intro_text)
values (
  'main',
  'Hoàng Bình Minh',
  '25024004',
  'UET.A20',
  'Nhập môn Công nghệ số và Trí tuệ nhân tạo',
  'Trang CV cá nhân hiển thị hồ sơ sinh viên, ảnh chân dung, nền tùy chọn và 7 bài tập được quản lý từ trang admin.'
)
on conflict (id) do nothing;

insert into public.assignments (week_number, title, description)
select week_number, 'Bài tập tuần ' || week_number, 'Chưa có nội dung. Hãy tải file PDF từ trang admin.'
from generate_series(1, 7) as week_number
on conflict (week_number) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'public read portfolio assets'
  ) then
    create policy "public read portfolio assets"
    on storage.objects
    for select
    using (bucket_id = 'portfolio-assets');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'public write portfolio assets'
  ) then
    create policy "public write portfolio assets"
    on storage.objects
    for all
    using (bucket_id = 'portfolio-assets')
    with check (bucket_id = 'portfolio-assets');
  end if;
end $$;