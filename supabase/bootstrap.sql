create extension if not exists "pgcrypto";
create extension if not exists "citext";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  role text not null default 'member',
  plan text not null default 'starter',
  seats integer not null default 3,
  max_parallel_runs integer not null default 1,
  max_daily_campaigns integer not null default 3,
  is_founder boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaign_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  campaign_name text not null,
  email_subject text,
  email_template text,
  lead jsonb,
  successful integer not null default 0,
  failed integer not null default 0,
  total_leads integer not null default 0,
  status text not null default 'queued',
  remote_campaign_id text,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_campaign_runs_user_id on public.campaign_runs(user_id);
create index if not exists idx_campaign_runs_created_at on public.campaign_runs(created_at desc);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.is_founder(uid uuid)
returns boolean
language sql
stable
as $$
  select coalesce((select is_founder from public.profiles where id = uid), false);
$$;

alter table public.profiles enable row level security;
alter table public.campaign_runs enable row level security;

drop policy if exists "profiles-self-access" on public.profiles;
create policy "profiles-self-access" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles-founder-admin" on public.profiles;
create policy "profiles-founder-admin" on public.profiles
  for all using (public.is_founder(auth.uid()))
  with check (public.is_founder(auth.uid()));

drop policy if exists "campaign-runs-self" on public.campaign_runs;
create policy "campaign-runs-self" on public.campaign_runs
  for select using (auth.uid() = user_id);

drop policy if exists "campaign-runs-insert" on public.campaign_runs;
create policy "campaign-runs-insert" on public.campaign_runs
  for insert with check (auth.uid() = user_id);

drop policy if exists "campaign-runs-founder" on public.campaign_runs;
create policy "campaign-runs-founder" on public.campaign_runs
  for all using (public.is_founder(auth.uid()))
  with check (public.is_founder(auth.uid()));

create or replace function public.handle_new_user()
returns trigger as $$
declare
  _is_founder boolean := lower(new.email) = lower('enjoywithpandu@gmail.com');
begin
  insert into public.profiles (id, email, role, plan, seats, max_parallel_runs, max_daily_campaigns, is_founder)
  values (
    new.id,
    new.email,
    case when _is_founder then 'founder' else 'member' end,
    case when _is_founder then 'founder' else 'starter' end,
    case when _is_founder then 25 else 3 end,
    case when _is_founder then 10 else 1 end,
    case when _is_founder then 999 else 3 end,
    _is_founder
  )
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    plan = excluded.plan,
    seats = excluded.seats,
    max_parallel_runs = excluded.max_parallel_runs,
    max_daily_campaigns = excluded.max_daily_campaigns,
    is_founder = excluded.is_founder,
    updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
after insert on auth.users
for each row execute function public.handle_new_user();

-- Ensure the founder account keeps unlimited access if profile already exists
update public.profiles
set role = 'founder',
    plan = 'founder',
    seats = 25,
    max_parallel_runs = 10,
    max_daily_campaigns = 999,
    is_founder = true
where lower(email) = lower('enjoywithpandu@gmail.com');
