import Link from "next/link";
import type { PickRow } from "@/lib/types";

function formatKickoff(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

type Props = {
  pick: PickRow;
  locked?: boolean;
};

export function PickCard({ pick, locked }: Props) {
  return (
    <Link
      href={`/picks/${pick.id}`}
      className={`group relative block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 outline-none transition hover:border-edge/45 hover:shadow-md focus-visible:ring-2 focus-visible:ring-edge/50 ${
        locked ? "select-none" : ""
      }`}
    >
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-navy-900/75 backdrop-blur-[2px]">
          <span className="text-3xl" aria-hidden>
            🔒
          </span>
          <span className="mt-2 font-heading text-sm font-semibold uppercase tracking-wide text-edge">
            Edge Members Only
          </span>
        </div>
      )}
      <div className={locked ? "blur-sm" : ""}>
        <p className="text-xs font-semibold uppercase tracking-wider text-edge">{pick.competition}</p>
        <p className="mt-1 font-heading text-lg font-semibold text-[var(--fg)]">{pick.match_name}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{pick.bet_type}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-[var(--border)] pt-4">
          <div>
            <span className="text-xs text-[var(--muted)]">Odds</span>
            <p className="font-heading text-xl font-bold text-[var(--fg)]">{pick.odds_display}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[var(--muted)]">Book</span>
            <p className="text-sm font-medium text-[var(--fg)]">{pick.sportsbook}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">Kickoff · {formatKickoff(pick.kickoff_at)}</p>
        {pick.reasoning && !locked && (
          <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--muted)]">
            {pick.reasoning}
          </p>
        )}
      </div>
    </Link>
  );
}
