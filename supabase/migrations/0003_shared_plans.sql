-- GetFit, test phase: sharing workout plans with friends.
-- Run after 0002_workouts.sql. Not yet run against the database; the app lead
-- runs it (see supabase/README.md).
--
-- Sharing copies a plan into shared_plans under a short random code. Anyone with
-- an account and the code can read that one plan through get_shared_plan(code),
-- until it expires; there is no open select on the table, so codes cannot be
-- listed or guessed in bulk. Owners create, see and delete only their own rows.
-- The copy holds no weights, dates or archive state (the app strips them).

-- An 8-character code without look-alike characters (no 0/O, 1/I/L).
create or replace function public.new_share_code()
returns text
language sql
volatile
set search_path = ''
as $$
  select string_agg(
    substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1),
    ''
  )
  from generate_series(1, 8);
$$;

create table public.shared_plans (
  code text primary key default public.new_share_code()
    check (code ~ '^[A-HJKMNP-Z2-9]{8}$'),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan jsonb not null check (pg_column_size(plan) <= 200000),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
    check (expires_at <= created_at + interval '90 days')
);

create index shared_plans_owner on public.shared_plans (owner, created_at desc);

alter table public.shared_plans enable row level security;

create policy "Users see their own shared plans"
  on public.shared_plans for select
  using (auth.uid() = owner);

create policy "Users share their own plans"
  on public.shared_plans for insert
  with check (auth.uid() = owner);

create policy "Users delete their own shared plans"
  on public.shared_plans for delete
  using (auth.uid() = owner);

-- Reads one shared plan by its code, for signed-in users only. Returns no row
-- for unknown or expired codes. Runs with the table owner's rights, so the
-- table itself needs no select policy for other users.
create or replace function public.get_shared_plan(share_code text)
returns table (plan jsonb, expires_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select shared.plan, shared.expires_at
  from public.shared_plans as shared
  where auth.uid() is not null
    and shared.code = upper(trim(share_code))
    and shared.expires_at > now();
$$;

revoke all on function public.get_shared_plan(text) from public, anon;
grant execute on function public.get_shared_plan(text) to authenticated;
