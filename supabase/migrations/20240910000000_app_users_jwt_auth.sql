-- App-owned users for JWT auth (Supabase Auth is NOT used)
-- Run in Supabase SQL editor after existing migrations.

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  company_name text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_app_users_email on public.app_users (email);

alter table public.app_users enable row level security;

-- No anon/authenticated policies: Nest uses service role (bypasses RLS).
-- Block direct client access by default.
create policy "Service role only via bypass"
  on public.app_users
  for all
  using (false)
  with check (false);

comment on table public.app_users is 'Ledgerly application users — JWT auth, not Supabase Auth';
