-- MatchEdge FC — Supabase schema (run in SQL Editor)
-- Enable UUID if needed: create extension if not exists "pgcrypto";

create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  competition text not null,
  match_name text not null,
  bet_type text not null,
  odds_display text not null,
  sportsbook text not null,
  kickoff_at timestamptz not null,
  sport text not null default 'soccer',
  sort_order int not null default 0,
  reasoning text,
  result text not null default 'pending',
  is_free boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sport_records (
  id uuid primary key default gen_random_uuid(),
  sport_key text not null unique,
  label text not null,
  wins int not null default 0,
  losses int not null default 0,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.picks enable row level security;
alter table public.sport_records enable row level security;

drop policy if exists "Allow public read picks" on public.picks;
create policy "Allow public read picks" on public.picks for select using (true);

-- Inserts from backend scripts (service role key) bypass RLS. Do not expose service_role in browsers.

drop policy if exists "Allow public read sport_records" on public.sport_records;
create policy "Allow public read sport_records" on public.sport_records for select using (true);

-- Service role or authenticated admin should insert/update via dashboard or server with service key.
-- For MVP, insert rows manually in Supabase Table Editor.
