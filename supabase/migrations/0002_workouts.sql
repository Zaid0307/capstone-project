-- GetFit, test phase: the training diary.
-- Run after 0001_accounts_and_plans.sql. Same rules: a user only reaches their
-- own rows (row level security); deleting the account deletes the diary.
--
-- A workout is stored as one document in the app's diary model (data), the same
-- shape the app keeps in localStorage. Date and status are copied into columns
-- so the calendar and the analyses can query by period later.

create table public.workouts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  schema_version integer not null check (schema_version >= 1),
  date date not null,
  status text not null check (status in ('done', 'skipped')),
  plan_id text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index workouts_user_date on public.workouts (user_id, date desc);

create trigger workouts_set_updated_at
  before update on public.workouts
  for each row execute function public.set_updated_at();

alter table public.workouts enable row level security;

create policy "Users read their own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users create their own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users update their own workouts"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);
