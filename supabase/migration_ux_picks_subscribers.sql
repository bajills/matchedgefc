-- Run in Supabase SQL Editor (adds picks columns + subscribers table).

alter table public.picks add column if not exists opening_odds text;
alter table public.picks add column if not exists final_score text;
alter table public.picks add column if not exists confidence integer;

comment on column public.picks.opening_odds is 'American odds at publish time; compare to odds for line movement.';
comment on column public.picks.final_score is 'Optional e.g. 2-1 after grading.';
comment on column public.picks.confidence is '1=value, 2=solid, 3=highest conviction.';

do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'picks' and c.conname = 'picks_confidence_range'
  ) then
    alter table public.picks add constraint picks_confidence_range
      check (confidence is null or (confidence >= 1 and confidence <= 3));
  end if;
end $$;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  is_paid boolean not null default false
);

alter table public.subscribers enable row level security;

drop policy if exists "subscribers_insert_anon" on public.subscribers;
create policy "subscribers_insert_anon"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (true);
