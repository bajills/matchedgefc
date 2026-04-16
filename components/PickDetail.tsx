import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { confidenceStars } from "@/lib/pickResultStyles";
import { KickoffCountdown } from "./KickoffCountdown";
import { KickoffLocal } from "./KickoffLocal";
import { LiveScoreWidget } from "./LiveScoreWidget";
import { PickDetailTabs } from "./PickDetailTabs";
import { RelatedPicks } from "./RelatedPicks";

type Props = {
  pick: PickRow;
  locked: boolean;
  relatedPicks?: PickRow[];
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

function EdgeDetailCta() {
  return (
    <div className="rounded-xl border border-edge/30 bg-gradient-to-br from-edge/10 to-transparent p-5">
      <h3 className="mb-2 font-heading text-lg font-bold text-[var(--fg)]">Unlock every edge</h3>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Full grades, write-ups, and line context for all Edge picks — $9/mo founding rate.
      </p>
      <a
        href="/#pricing"
        className="inline-flex w-full items-center justify-center rounded-full bg-edge px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-[#00e6b8]"
      >
        Get Edge Access
      </a>
    </div>
  );
}

export function PickDetail({ pick, locked, relatedPicks = [] }: Props) {
  const stars = confidenceStars(pick.confidence);

  return (
    <article className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:pt-10">
      <Link
        href="/#picks"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-edge"
      >
        <span aria-hidden>←</span> Back to Picks
      </Link>

      <div className="mt-6 flex flex-col gap-8 lg:grid lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
        <div className="order-2 min-w-0 lg:order-1">
          <header className="border-b border-[var(--border)] pb-8">
            <ResultBanner pick={pick} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex rounded-full border border-edge/35 bg-edge/10 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-edge">
                {pick.competition || "Competition"}
              </span>
              <span className="text-lg text-amber-400" aria-label={`Confidence ${stars} of 3`}>
                {"⭐".repeat(stars)}
              </span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-[var(--fg)] md:text-4xl lg:text-[2.5rem]">
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
        </div>

        <aside className="order-1 space-y-6 lg:sticky lg:order-2 lg:top-24">
          <LiveScoreWidget pick={pick} />
          <div className="hidden space-y-6 lg:block">
            <RelatedPicks picks={relatedPicks} currentId={pick.id} />
            <EdgeDetailCta />
          </div>
        </aside>
      </div>

      <div className="mt-8 space-y-6 lg:hidden">
        <RelatedPicks picks={relatedPicks} currentId={pick.id} />
        <EdgeDetailCta />
      </div>
    </article>
  );
}
