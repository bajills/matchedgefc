-- Run in Supabase SQL Editor if `picks` already existed without these columns.

alter table public.picks add column if not exists reasoning text;
alter table public.picks add column if not exists result text not null default 'pending';
alter table public.picks add column if not exists is_free boolean not null default true;
