"use client";

import { useMemo, useState } from "react";
import type { PickRow } from "@/lib/types";
import { formatDateGroupHeader, groupPicksByLocalDate } from "@/lib/picks-grouping";
import {
  dedupePicksByMatchKickoffBet,
  kickoffMs,
  LOCKED_PREVIEW_COUNT,
} from "@/lib/picks-access";
import { EmailSignup } from "./EmailSignup";
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

  const sorted = useMemo(() => {
    const ordered = [...filtered].sort((a, b) => kickoffMs(a) - kickoffMs(b));
    return dedupePicksByMatchKickoffBet(ordered);
  }, [filtered]);

  const { freePicks, lockedPreview, paywalledCount } = useMemo(() => {
    const free = sorted.filter((p) => p.is_free === true);
    const lockedAll = sorted.filter((p) => p.is_free !== true);
    const preview = lockedAll.slice(0, LOCKED_PREVIEW_COUNT);
    const hidden = Math.max(0, lockedAll.length - preview.length);
    return { freePicks: free, lockedPreview: preview, paywalledCount: hidden };
  }, [sorted]);

  const lockedDateGroups = useMemo(() => groupPicksByLocalDate(lockedPreview), [lockedPreview]);

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
            {/* Free picks — flat list, kickoff order (no date grouping) */}
            {freePicks.length > 0 && (
              <div className="mt-10">
                <h3 className="font-heading text-xl font-bold text-[var(--fg)] md:text-2xl">Free Picks</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {freePicks.map((pick) => (
                    <li key={pick.id}>
                      <PickCard pick={pick} locked={false} prominent />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Divider + Edge paywall preview */}
            {lockedPreview.length > 0 && (
              <div className={freePicks.length > 0 ? "mt-12" : "mt-10"}>
                {freePicks.length > 0 && (
                  <div
                    className="mb-10 border-t border-[var(--border)]"
                    role="separator"
                    aria-hidden
                  />
                )}
                <h3 className="font-heading text-xl font-bold text-[var(--fg)] md:text-2xl">
                  Edge Members Only
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Next {LOCKED_PREVIEW_COUNT} picks on the slate — unlock for full analysis and every pick.
                </p>
                <div className="mt-6 flex flex-col gap-8">
                  {lockedDateGroups.map(({ dateKey, picks: dayPicks }) => (
                    <div key={`locked-${dateKey}`}>
                      <h4 className="mb-4 border-b border-[var(--border)] pb-2 font-heading text-base font-semibold tracking-wide text-[var(--fg)]">
                        {formatDateGroupHeader(dateKey)}
                      </h4>
                      <ul className="flex flex-col gap-4">
                        {dayPicks.map((pick) => (
                          <li key={pick.id}>
                            <PickCard pick={pick} locked />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paywalled remainder */}
            {paywalledCount > 0 && (
              <div className="mt-10 rounded-xl border border-edge/40 bg-edge/5 px-5 py-6 text-center">
                <p className="font-heading text-base font-semibold text-[var(--fg)] md:text-lg">
                  {paywalledCount} more {paywalledCount === 1 ? "pick" : "picks"} available to Edge members —
                  unlock for $9/mo
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Full reasoning, line movement, and every pick on the slate — not shown on the free page.
                </p>
                <a
                  href="#pricing"
                  className="mt-4 inline-block text-sm font-semibold text-edge underline-offset-2 hover:underline"
                >
                  View pricing
                </a>
              </div>
            )}
          </>
        )}

        {sport === "soccer" && (
          <div
            className={`border-t border-[var(--border)] pt-10 ${sorted.length > 0 ? "mt-14" : "mt-10"}`}
          >
            <EmailSignup variant="inline" />
          </div>
        )}
      </div>
    </section>
  );
}
