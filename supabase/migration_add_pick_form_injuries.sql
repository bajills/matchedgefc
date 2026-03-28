-- Run in Supabase SQL Editor if `picks` exists without these columns.
-- Summaries synced from mathedge.py (API-Football enrichment).

alter table public.picks add column if not exists home_form text;
alter table public.picks add column if not exists away_form text;
alter table public.picks add column if not exists key_injuries text;

comment on column public.picks.home_form is 'Last ~5 W/L/D results for home side, e.g. W W D L W';
comment on column public.picks.away_form is 'Last ~5 W/L/D results for away side';
comment on column public.picks.key_injuries is 'Comma-separated key absences from API-Football injuries';
