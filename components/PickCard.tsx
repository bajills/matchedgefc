import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { confidenceStars, pickResultBorderClass } from "@/lib/pickResultStyles";
import { KickoffCountdown } from "./KickoffCountdown";
import { KickoffLocal } from "./KickoffLocal";
import { OddsWithMovement } from "./OddsWithMovement";
import { PickTeaser } from "./PickTeaser";

type Props = {
  pick: PickRow;
  locked?: boolean;
  prominent?: boolean;
};

function ResultBadge({ pick }: { pick: PickRow }) {
  const r = (pick.result || "pending").toLowerCase();
  if (r === "pending") return null;
  if (r === "win") {
    return (
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 font-heading text-xs font-bold uppercase tracking-wide text-green-600 dark:text-green-400">
          ✅ WIN
        </span>
        {pick.final_score ? (
          <span className="text-xs text-[var(--muted)]">Final · {pick.final_score}</span>
        ) : null}
      </div>
    );
  }
  if (r === "loss") {
    return (
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 font-heading text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          ❌ LOSS
        </span>
        {pick.final_score ? (
          <span className="text-xs text-[var(--muted)]">Final · {pick.final_score}</span>
        ) : null}
      </div>
    );
  }
  if (r === "push") {
    return (
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 font-heading text-xs font-bold uppercase tracking-wide text-yellow-700 dark:text-yellow-400">
          PUSH
        </span>
        {pick.final_score ? (
          <span className="text-xs text-[var(--muted)]">Final · {pick.final_score}</span>
        ) : null}
      </div>
    );
  }
  return null;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 drop-shadow-sm" aria-label={`Confidence ${n} of 3`}>
      {"⭐".repeat(n)}
    </span>
  );
}

export function PickCard({ pick, locked, prominent }: Props) {
  const isLocked = Boolean(locked);
  const isProm = Boolean(prominent) && !isLocked;
  const resBorder = pickResultBorderClass(pick);
  const stars = confidenceStars(pick.confidence);

  const baseBorder = isLocked
    ? "border-navy-600/50 bg-navy-800/35 dark:border-navy-500/40 dark:bg-navy-900/55"
    : !isProm
      ? "border-[var(--border)] bg-white shadow-sm dark:bg-[var(--card)]"
      : "";

  return (
    <Link
      href={`/picks/${pick.id}`}
      className={`group relative block w-full overflow-hidden rounded-xl border outline-none transition focus-visible:ring-2 focus-visible:ring-edge/50 ${
        isProm ? "border-edge/35 bg-white p-6 shadow-lg shadow-edge/10 ring-1 ring-edge/20 md:p-8 dark:bg-[var(--card)]" : "p-5"
      } ${resBorder || baseBorder} ${isLocked ? "select-none" : "hover:border-edge/40 hover:shadow-md"}`}
    >
      <div className="space-y-3">
        <ResultBadge pick={pick} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex max-w-full rounded-full bg-edge/15 font-semibold uppercase tracking-wide text-edge ${
              isProm ? "px-3 py-1.5 text-sm" : "px-3 py-1 text-xs"
            }`}
          >
            {pick.competition}
          </span>
          <Stars n={stars} />
        </div>

        <h3
          className={`font-heading font-bold leading-snug text-[var(--fg)] ${
            isProm ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {pick.match_name}
        </h3>
        <p className={`text-[var(--muted)] ${isProm ? "text-base" : "text-sm"}`}>{pick.bet_type}</p>

        <PickTeaser pick={pick} locked={isLocked} prominent={isProm} />

        <div
          className={`flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-8 sm:gap-y-2 ${
            isProm ? "pt-5" : ""
          }`}
        >
          <div
            className={`flex flex-wrap items-baseline gap-x-6 gap-y-1 ${isLocked ? "blur-[2px]" : ""}`}
          >
            <OddsWithMovement pick={pick} size={isProm ? "large" : "default"} />
            <span className={`font-medium text-[var(--fg)] ${isProm ? "text-base" : "text-sm"}`}>
              {pick.sportsbook}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 sm:items-end">
            <KickoffLocal
              iso={pick.kickoff_at}
              className={`tabular-nums text-[var(--muted)] ${isProm ? "text-base" : "text-sm"}`}
            />
            <KickoffCountdown
              kickoffIso={pick.kickoff_at}
              result={pick.result}
              className={isProm ? "text-xs" : "text-[11px]"}
            />
          </div>
        </div>

        {isLocked && (
          <p className="pt-1 text-center font-heading text-[10px] font-semibold uppercase tracking-wider text-edge/90">
            Edge Members Only · unlock for full analysis
          </p>
        )}
      </div>
    </Link>
  );
}
