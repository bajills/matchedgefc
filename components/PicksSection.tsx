"use client";

import { useMemo, useState } from "react";
import type { PickRow } from "@/lib/types";
import { formatDateGroupHeader, groupPicksByLocalDate } from "@/lib/picks-grouping";
import { computeUnlockedIds, kickoffMs } from "@/lib/picks-access";
import { PickCard } from "./PickCard";

const FILTERS = [
  { key: "soccer", label: "Soccer", status: "active" as const },
  { key: "nba", label: "NBA", status: "soon" as const },
  { key: "nfl", label: "NFL", status: "soon" as const },
  { key: "mlb", label: "MLB", status: "soon" as const },
];

type Props = { picks: PickRow[] };

export function PicksSection({ picks }: Props) {
  const [sport, setSport] = useState("soccer");

  const filtered = useMemo(() => {
    if (sport !== "soccer") {
      return [];
    }
    return picks.filter((p) => p.sport === "soccer");
  }, [picks, sport]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => kickoffMs(a) - kickoffMs(b)),
    [filtered],
  );

  const dateGroups = useMemo(() => groupPicksByLocalDate(sorted), [sorted]);

  const { unlockedIds, lockedCount } = useMemo(() => {
    const unlocked = computeUnlockedIds(sorted);
    return {
      unlockedIds: unlocked,
      lockedCount: sorted.length - unlocked.size,
    };
  }, [sorted]);

  return (
    <section id="picks" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-3xl font-bold text-[var(--fg)] md:text-4xl">Today&apos;s Picks</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Curated from our research pipeline. Updated each matchday.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              disabled={f.status === "soon"}
              onClick={() => setSport(f.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                sport === f.key
                  ? "border-edge bg-edge/15 text-edge"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-edge/50"
              } ${f.status === "soon" ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {f.label}
              {f.status === "soon" && (
                <span className="ml-2 text-[10px] uppercase text-[var(--muted)]">soon</span>
              )}
            </button>
          ))}
        </div>

        {sport !== "soccer" && (
          <p className="mt-10 text-center text-[var(--muted)]">Coming soon.</p>
        )}

        {sport === "soccer" && sorted.length === 0 && (
          <p className="mt-10 text-center text-[var(--muted)]">
            No picks today — check back on matchday
          </p>
        )}

        {sport === "soccer" && sorted.length > 0 && (
          <>
            <div className="mt-10 flex flex-col gap-10">
              {dateGroups.map(({ dateKey, picks: dayPicks }) => (
                <div key={dateKey}>
                  <h3 className="mb-4 border-b border-[var(--border)] pb-2 font-heading text-lg font-semibold tracking-wide text-[var(--fg)]">
                    {formatDateGroupHeader(dateKey)}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {dayPicks.map((pick) => (
                      <li key={pick.id}>
                        <PickCard pick={pick} locked={!unlockedIds.has(pick.id)} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {lockedCount > 0 && (
              <div className="mt-10 rounded-lg border border-edge/40 bg-edge/5 px-4 py-4 text-center">
                <p className="font-heading text-sm font-semibold uppercase tracking-wide text-[var(--fg)]">
                  {lockedCount} more {lockedCount === 1 ? "pick" : "picks"} locked today — unlock with Edge
                  $15/mo
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Edge membership — full card, reasoning, line alerts, and early access to new sports.
                </p>
                <a
                  href="#pricing"
                  className="mt-3 inline-block text-sm font-semibold text-edge underline-offset-2 hover:underline"
                >
                  View pricing
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
