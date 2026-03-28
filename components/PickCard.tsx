import Link from "next/link";
import type { PickRow } from "@/lib/types";

export function formatPickKickoff(iso: string) {
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
  const isLocked = Boolean(locked);

  return (
    <Link
      href={`/picks/${pick.id}`}
      className={`group relative block w-full overflow-hidden rounded-xl border p-5 outline-none transition focus-visible:ring-2 focus-visible:ring-edge/50 ${
        isLocked
          ? "border-navy-600/50 bg-navy-800/35 dark:border-navy-500/40 dark:bg-navy-900/55"
          : "border-[var(--border)] bg-white shadow-sm dark:bg-[var(--card)]"
      } ${isLocked ? "select-none" : "hover:border-edge/40 hover:shadow-md"}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-navy-900/70 backdrop-blur-[3px] dark:bg-navy-950/80">
          <span className="text-3xl" aria-hidden>
            🔒
          </span>
          <span className="mt-2 font-heading text-sm font-semibold uppercase tracking-wide text-edge">
            Edge Members Only
          </span>
        </div>
      )}
      <div className={`space-y-3 ${isLocked ? "blur-[3px]" : ""}`}>
        <span className="inline-flex max-w-full rounded-full bg-edge/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-edge">
          {pick.competition}
        </span>
        <h3 className="font-heading text-lg font-bold leading-snug text-[var(--fg)]">{pick.match_name}</h3>
        <p className="text-sm text-[var(--muted)]">{pick.bet_type}</p>
        <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-2">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="font-heading text-xl font-bold text-edge">{pick.odds_display}</span>
            <span className="text-sm font-medium text-[var(--fg)]">{pick.sportsbook}</span>
          </div>
          <p className="text-sm tabular-nums text-[var(--muted)]">{formatPickKickoff(pick.kickoff_at)}</p>
        </div>
      </div>
    </Link>
  );
}
