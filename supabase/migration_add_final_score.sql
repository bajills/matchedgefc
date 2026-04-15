-- Final score string for graded picks (e.g. "2-1") — used by live score + pick cards.

alter table public.picks add column if not exists final_score text;

comment on column public.picks.final_score is 'Final result scoreline when graded (e.g. 2-1)';
