"use client";

import { useMemo, useState } from "react";
import type { PickRow } from "@/lib/types";
import { PickCard } from "./PickCard";
import { EmailSignup } from "./EmailSignup";

type RecordEntry = { label: string; value: string };

type Props = {
  picks: PickRow[];
  records?: RecordEntry[];
};

function RecordTrackerCompact({ records }: { records: RecordEntry[] }) {
  return (
    <div className="rounded-xl border border-navy-700/50 bg-navy-900/30 p-5">
      <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-edge">
        Record tracker
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {records.map((r) => (
          <div
            key={r.label}
            className="rounded-lg border border-navy-700/40 bg-navy-950/40 px-3 py-2 text-center"
          >
            <p className="font-heading text-lg font-bold text-white">{r.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{r.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PicksSidebar({
  gamesCount,
  leaguesCount,
  records,
}: {
  gamesCount: number;
  leaguesCount: number;
  records: RecordEntry[];
}) {
  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      <div className="rounded-xl border border-navy-700/50 bg-navy-900/30 p-5">
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wider text-edge">
          Today&apos;s slate
        </h3>
        <p className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-white">{gamesCount}</span>{" "}
          {gamesCount === 1 ? "game" : "games"}
          {" · "}
          <span className="font-semibold text-white">{leaguesCount}</span>{" "}
          {leaguesCount === 1 ? "league" : "leagues"}
        </p>
      </div>
      <EmailSignup />
      <div className="rounded-xl border border-edge/30 bg-gradient-to-br from-edge/10 to-transparent p-5">
        <h3 className="mb-2 font-heading text-lg font-bold text-white">Get the full edge</h3>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Unlock grades, full write-ups, and historical performance for every pick.
        </p>
        <a
          href="#pricing"
          className="inline-flex w-full items-center justify-center rounded-full bg-edge px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-[#00e6b8]"
        >
          View Edge membership — $9/mo
        </a>
      </div>
      {records.length > 0 ? <RecordTrackerCompact records={records} /> : null}
    </aside>
  );
}

export function PicksSection({ picks, records = [] }: Props) {
  const [filter, setFilter] = useState<"all" | "edge">("all");

  const sorted = useMemo(() => {
    return [...picks].sort((a, b) => {
      const ta = new Date(a.kickoff_at).getTime();
      const tb = new Date(b.kickoff_at).getTime();
      return ta - tb;
    });
  }, [picks]);

  const filtered = useMemo(() => {
    if (filter === "edge") return sorted.filter((p) => !p.is_free);
    return sorted;
  }, [sorted, filter]);

  const slateGames = sorted.length;
  const leagueSet = useMemo(
    () => new Set(sorted.map((p) => p.competition).filter(Boolean)),
    [sorted],
  );
  const slateLeagues = leagueSet.size;

  return (
    <section id="picks" className="scroll-mt-24 px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center lg:mb-12 lg:text-left">
          <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            Today&apos;s picks
          </h2>
          <p className="mx-auto max-w-xl text-[var(--muted)] lg:mx-0">
            Free picks listed below. Edge picks unlock full reasoning and model grades.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,65%)_minmax(0,35%)] lg:items-start lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-edge text-navy-900"
                    : "bg-navy-800/50 text-[var(--muted)] hover:text-white"
                }`}
              >
                All picks
              </button>
              <button
                type="button"
                onClick={() => setFilter("edge")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === "edge"
                    ? "bg-edge text-navy-900"
                    : "bg-navy-800/50 text-[var(--muted)] hover:text-white"
                }`}
              >
                Edge only
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-xl border border-navy-700/50 bg-navy-900/30 py-12 text-center text-[var(--muted)]">
                No picks match this filter.
              </p>
            ) : (
              <ul className="space-y-4">
                {filtered.map((pick) => (
                  <li key={pick.id}>
                    <PickCard pick={pick} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-12 lg:mt-0">
            <PicksSidebar
              gamesCount={slateGames}
              leaguesCount={slateLeagues}
              records={records}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
