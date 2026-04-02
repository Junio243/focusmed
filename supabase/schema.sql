create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'student' check (role in ('student', 'admin', 'institution_manager')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  full_name text not null,
  track text,
  neuro_profile text,
  updated_at timestamptz not null default now()
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.plans_catalog (
  id text primary key,
  name text not null,
  description text not null,
  price_monthly_usd numeric(10,2),
  price_yearly_usd numeric(10,2),
  created_at timestamptz not null default now()
);

insert into public.plans_catalog (id, name, description, price_monthly_usd, price_yearly_usd)
values
  ('starter', 'Starter', 'Core focus workflow', 9.90, 99.00),
  ('pro', 'Pro', 'Advanced adaptive recommendations', 19.90, 199.00),
  ('b2b_pilot', 'Institutional Pilot', 'One cohort analytics dashboard', 299.00, null)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price_monthly_usd = excluded.price_monthly_usd,
  price_yearly_usd = excluded.price_yearly_usd;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id text not null references public.plans_catalog(id),
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  amount_usd numeric(10,2) not null,
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled')),
  trial_ends_at timestamptz,
  paid_until timestamptz,
  external_reference text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  started_at timestamptz not null,
  duration_min integer not null check (duration_min > 0 and duration_min <= 240),
  focus_score numeric(4,2) not null check (focus_score >= 0 and focus_score <= 10),
  topic text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid references public.users(id),
  status text not null default 'pilot' check (status in ('pilot', 'active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.cohort_members (
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (cohort_id, user_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_study_sessions_user_started_at on public.study_sessions(user_id, started_at desc);
create index if not exists idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index if not exists idx_events_user_created_at on public.events(user_id, created_at desc);
create index if not exists idx_events_name_created_at on public.events(event_name, created_at desc);
