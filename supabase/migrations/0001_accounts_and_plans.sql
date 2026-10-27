-- GetFit, Phase 1: accounts and workout plans.
-- Run once in the Supabase SQL editor of a new project (region: EU, Frankfurt).
-- Not yet run against a real database; see supabase/README.md.
--
-- Rule for every table: a user can only read and change their own rows
-- (row level security). Deleting an account deletes all of its data.

-- Keeps updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profile -------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  language text not null default 'de' check (language in ('de', 'en')),
  -- Which figure the app shows (male or female view); null = not chosen yet.
  figure text check (figure in ('male', 'female')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Creates the profile when someone signs up (e-mail or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Consents --------------------------------------------------------------------
-- Every given or withdrawn consent is a new row, so the history stays traceable.

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('privacy_policy', 'health_data')),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);

create index consents_user_kind on public.consents (user_id, kind, created_at desc);

alter table public.consents enable row level security;

create policy "Users read their own consents"
  on public.consents for select
  using (auth.uid() = user_id);

create policy "Users record their own consents"
  on public.consents for insert
  with check (auth.uid() = user_id);

-- Workout plans -----------------------------------------------------------------
-- A plan is stored as one document in the app's plan model (data), the same
-- shape the app keeps in localStorage. The id is created by the app.

create table public.plans (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  schema_version integer not null check (schema_version >= 1),
  template_id text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create trigger plans_set_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

alter table public.plans enable row level security;

create policy "Users read their own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users create their own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users update their own plans"
  on public.plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete their own plans"
  on public.plans for delete
  using (auth.uid() = user_id);

-- Account deletion ---------------------------------------------------------------
-- Lets a signed-in user delete their own account. All rows above are removed
-- through "on delete cascade".

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
