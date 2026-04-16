import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { confidenceStars } from "@/lib/pickResultStyles";
import { KickoffCountdown } from "./KickoffCountdown";
import { KickoffLocal } from "./KickoffLocal";
import { LiveScoreWidget } from "./LiveScoreWidget";
import { PickDetailTabs } from "./PickDetailTabs";

type Props = {
  pick: PickRow;
  locked: boolean;
};

function ResultBanner({ pick }: { pick: PickRow }) {
  const r = (pick.result || "pending").toLowerCase();
  if (r === "pending") return null;
  const score = pick.final_score ? ` · ${pick.final_score}` : "";
  if (r === "win") {
    return (
      <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-400">
        ✅ WIN{score}
      </div>
    );
  }
  if (r === "loss") {
    return (
      <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
        ❌ LOSS{score}
      </div>
    );
  }
  if (r === "push") {
    return (
      <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-800 dark:text-yellow-300">
        PUSH{score}
      </div>
    );
  }
  return null;
}

export function PickDetail({ pick, locked }: Props) {
  const stars = confidenceStars(pick.confidence);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-6 md:pt-10">
      <Link
        href="/#picks"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-edge"
      >
        <span aria-hidden>←</span> Back to Picks
      </Link>

      <LiveScoreWidget pick={pick} />

      <header className="mt-8 border-b border-[var(--border)] pb-8">
        <ResultBanner pick={pick} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex rounded-full border border-edge/35 bg-edge/10 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-edge">
            {pick.competition || "Competition"}
          </span>
          <span className="text-lg text-amber-400" aria-label={`Confidence ${stars} of 3`}>
            {"⭐".repeat(stars)}
          </span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-[var(--fg)] md:text-4xl">
          {pick.match_name}
        </h1>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Kickoff</dt>
            <dd className="mt-1 flex flex-col gap-1 font-medium text-[var(--fg)]">
              <KickoffLocal iso={pick.kickoff_at} className="text-[var(--fg)]" />
              <KickoffCountdown kickoffIso={pick.kickoff_at} result={pick.result} />
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Sportsbook</dt>
            <dd className="mt-1 font-medium text-[var(--fg)]">{pick.sportsbook || "—"}</dd>
          </div>
        </dl>
      </header>

      <PickDetailTabs pick={pick} locked={locked} />
    </article>
  );
}
