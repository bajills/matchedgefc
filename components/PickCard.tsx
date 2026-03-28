import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { KickoffLocal } from "./KickoffLocal";

type Props = {
  pick: PickRow;
  locked?: boolean;
  /** Larger card for the top free picks section */
  prominent?: boolean;
};

export function PickCard({ pick, locked, prominent }: Props) {
  const isLocked = Boolean(locked);
  const isProm = Boolean(prominent) && !isLocked;

  return (
    <Link
      href={`/picks/${pick.id}`}
      className={`group relative block w-full overflow-hidden rounded-xl border outline-none transition focus-visible:ring-2 focus-visible:ring-edge/50 ${
        isProm ? "border-edge/35 bg-white p-6 shadow-lg shadow-edge/10 ring-1 ring-edge/20 md:p-8 dark:bg-[var(--card)]" : "p-5"
      } ${
        isLocked
          ? "border-navy-600/50 bg-navy-800/35 dark:border-navy-500/40 dark:bg-navy-900/55"
          : !isProm
            ? "border-[var(--border)] bg-white shadow-sm dark:bg-[var(--card)]"
            : ""
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
        <span
          className={`inline-flex max-w-full rounded-full bg-edge/15 font-semibold uppercase tracking-wide text-edge ${
            isProm ? "px-3 py-1.5 text-sm" : "px-3 py-1 text-xs"
          }`}
        >
          {pick.competition}
        </span>
        <h3
          className={`font-heading font-bold leading-snug text-[var(--fg)] ${
            isProm ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {pick.match_name}
        </h3>
        <p className={`text-[var(--muted)] ${isProm ? "text-base" : "text-sm"}`}>{pick.bet_type}</p>
        <div
          className={`flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-2 ${
            isProm ? "pt-5" : ""
          }`}
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span
              className={`font-heading font-bold text-edge ${isProm ? "text-2xl md:text-3xl" : "text-xl"}`}
            >
              {pick.odds_display}
            </span>
            <span className={`font-medium text-[var(--fg)] ${isProm ? "text-base" : "text-sm"}`}>
              {pick.sportsbook}
            </span>
          </div>
          <KickoffLocal
            iso={pick.kickoff_at}
            className={`tabular-nums text-[var(--muted)] ${isProm ? "text-base" : "text-sm"}`}
          />
        </div>
      </div>
    </Link>
  );
}
