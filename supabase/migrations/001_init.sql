-- Getillustra schema for Supabase
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL → New query)

-- =========================
-- Saves table
-- =========================
create table if not exists public.saves (
  user_id           uuid not null references auth.users(id) on delete cascade,
  illustration_slug text not null,
  created_at        timestamptz not null default now(),
  primary key (user_id, illustration_slug)
);

create index if not exists saves_user_id_created_at_idx
  on public.saves (user_id, created_at desc);

alter table public.saves enable row level security;

drop policy if exists "saves_select_own" on public.saves;
create policy "saves_select_own"
  on public.saves for select
  using (auth.uid() = user_id);

drop policy if exists "saves_insert_own" on public.saves;
create policy "saves_insert_own"
  on public.saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "saves_delete_own" on public.saves;
create policy "saves_delete_own"
  on public.saves for delete
  using (auth.uid() = user_id);

-- =========================
-- Newsletter subscribers
-- =========================
create table if not exists public.newsletter_subscribers (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone (including anon) can subscribe
drop policy if exists "newsletter_insert_anyone" on public.newsletter_subscribers;
create policy "newsletter_insert_anyone"
  on public.newsletter_subscribers for insert
  with check (true);
