import Link from "next/link";
import type { PickRow } from "@/lib/types";
import { KickoffLocal } from "./KickoffLocal";

type Props = {
  pick: PickRow;
  locked: boolean;
};

function ContextPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--fg)]">{title}</h3>
      <p className="mt-4 text-sm text-[var(--muted)]">Coming soon</p>
    </div>
  );
}

export function PickDetail({ pick, locked }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-6 md:pt-10">
      <Link
        href="/#picks"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-edge"
      >
        <span aria-hidden>←</span> Back to Picks
      </Link>

      {/* HEADER */}
      <header className="mt-8 border-b border-[var(--border)] pb-8">
        <span className="inline-flex rounded-full border border-edge/35 bg-edge/10 px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-edge">
          {pick.competition || "Competition"}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-[var(--fg)] md:text-4xl">
          {pick.match_name}
        </h1>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Kickoff</dt>
            <dd className="mt-1 font-medium text-[var(--fg)]">
              <KickoffLocal iso={pick.kickoff_at} className="text-[var(--fg)]" />
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Sportsbook</dt>
            <dd className="mt-1 font-medium text-[var(--fg)]">{pick.sportsbook || "—"}</dd>
          </div>
        </dl>
      </header>

      {/* THE PICK — always visible */}
      <section className="mt-10" aria-labelledby="pick-heading">
        <h2 id="pick-heading" className="sr-only">
          The pick
        </h2>
        <div className="rounded-2xl border-2 border-edge/55 bg-gradient-to-br from-edge/15 to-edge/5 p-6 shadow-lg shadow-edge/10 md:p-8">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-edge">The pick</p>
          <p className="mt-3 font-heading text-xl font-bold leading-snug text-[var(--fg)] md:text-2xl">{pick.bet_type}</p>
          <p className="mt-4 font-heading text-4xl font-bold tracking-tight text-edge md:text-5xl">{pick.odds_display}</p>
        </div>
      </section>

      {/* Gated block: The Edge, Match context, Odds movement */}
      <div className="relative mt-12 min-h-[200px]">
        <div
          className={
            locked
              ? "pointer-events-none select-none blur-[2px] opacity-[0.45] transition-opacity"
              : undefined
          }
          aria-hidden={locked}
        >
          <section aria-labelledby="edge-heading">
            <h2
              id="edge-heading"
              className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--fg)]"
            >
              The Edge
            </h2>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--fg)]">
                {pick.reasoning?.trim() || "Analysis will appear here once available."}
              </p>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="context-heading">
            <h2
              id="context-heading"
              className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--fg)]"
            >
              Match context
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <ContextPlaceholder title="Recent form" />
              <ContextPlaceholder title="Injuries & suspensions" />
              <ContextPlaceholder title="Head to head" />
            </div>
            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              Last five games per team, squad news, and historical record — pipeline in progress.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="odds-heading">
            <h2
              id="odds-heading"
              className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--fg)]"
            >
              Odds movement
            </h2>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Current price</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-edge">{pick.odds_display}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{pick.sportsbook}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                Live odds tracking coming soon
              </p>
            </div>
          </section>
        </div>

        {locked && (
          <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg)]/85 px-6 py-12 backdrop-blur-md">
            <span className="text-4xl" aria-hidden>
              🔒
            </span>
            <p className="mt-4 max-w-sm text-center font-heading text-lg font-semibold text-[var(--fg)]">
              Members unlock full analysis, match context, and line movement.
            </p>
            <Link
              href="/#pricing"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-edge px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-navy-900 shadow-edge transition hover:bg-edge-dim"
            >
              Unlock with Edge $9/mo — Founding Member Rate
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
