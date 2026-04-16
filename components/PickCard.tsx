import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { PickTeaser } from "./PickTeaser";

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type Props = {
  pick: PickRow;
};

export function PickCard({ pick }: Props) {
  const locked = pick.is_free === false;
  const href = `/picks/${pick.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-navy-700/50 bg-navy-900/40 p-4 transition hover:border-edge/40 hover:bg-navy-900/60 md:p-5 lg:p-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-2">
        <div className="flex flex-wrap items-center gap-2 lg:contents">
          <span className="inline-flex w-fit shrink-0 rounded-md bg-navy-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-edge lg:order-none">
            {pick.competition}
          </span>
          <span className="min-w-0 flex-1 font-heading text-base font-semibold text-white group-hover:text-edge lg:flex-none lg:max-w-[min(100%,22rem)] lg:truncate">
            {pick.match_name}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)] lg:ml-auto lg:flex-nowrap lg:gap-x-4">
          <span className="font-medium text-white lg:whitespace-nowrap">{pick.bet_type}</span>
          <span className="text-edge lg:whitespace-nowrap">{pick.odds_display}</span>
          <span className="text-xs lg:whitespace-nowrap lg:text-sm">{formatKickoff(pick.kickoff_at)}</span>
          {locked ? (
            <span className="rounded-md bg-navy-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400 lg:whitespace-nowrap">
              Edge
            </span>
          ) : (
            <span className="rounded-md bg-edge/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-edge lg:whitespace-nowrap">
              Free
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 border-t border-navy-700/30 pt-3 lg:mt-4 lg:pt-4">
        <PickTeaser pick={pick} locked={locked} />
      </div>
    </Link>
  );
}
