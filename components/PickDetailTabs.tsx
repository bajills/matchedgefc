"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PickRow } from "@/lib/types";
import type { PickDetailContextResponse } from "@/lib/pick-detail-data";
import { americanToImpliedPercent, devigTwoWay, devigThreeWay } from "@/lib/odds-implied";
import { OddsWithMovement } from "./OddsWithMovement";

const TABS = [
  { id: "pick" as const, label: "The pick" },
  { id: "h2h" as const, label: "H2H" },
  { id: "news" as const, label: "Team news" },
  { id: "stats" as const, label: "Stats" },
  { id: "odds" as const, label: "Odds" },
];

type Props = {
  pick: PickRow;
  locked: boolean;
};

export function PickDetailTabs({ pick, locked }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("pick");
  const [ctx, setCtx] = useState<PickDetailContextResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/picks/${pick.id}/context`, { cache: "no-store" })
      .then((r) => r.json() as Promise<PickDetailContextResponse>)
      .then((data) => {
        if (!cancelled) {
          setCtx({
            h2h: data.h2h ?? [],
            injuries: data.injuries ?? [],
            stats: data.stats ?? { kind: "none", message: "Statistics unavailable." },
            resolved: data.resolved ?? false,
            error: data.error,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCtx({
            h2h: [],
            injuries: [],
            stats: { kind: "none", message: "Could not load match data." },
            resolved: false,
            error: "fetch_failed",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pick.id]);

  return (
    <div className="relative mt-10 min-h-[200px]">
      <nav
        className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto border-b border-[var(--border)] px-1 pb-px"
        aria-label="Pick sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative shrink-0 whitespace-nowrap px-3 py-2.5 font-heading text-xs font-semibold uppercase tracking-wide transition md:text-sm ${
              tab === t.id
                ? "text-edge"
                : "text-[var(--muted)] hover:text-[var(--fg)]"
            } `}
          >
            {t.label}
            {tab === t.id ? (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-edge" />
            ) : null}
          </button>
        ))}
      </nav>

      <div
        className={
          locked
            ? "pointer-events-none select-none blur-[2px] opacity-[0.45] transition-opacity"
            : undefined
        }
        aria-hidden={locked}
      >
        {tab === "pick" && <PickTab pick={pick} />}
        {tab === "h2h" && <H2HTab ctx={ctx} />}
        {tab === "news" && <NewsTab ctx={ctx} />}
        {tab === "stats" && <StatsTab ctx={ctx} />}
        {tab === "odds" && <OddsTab pick={pick} />}
      </div>

      {locked && (
        <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[var(--bg)]/85 px-6 py-12 backdrop-blur-md">
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
  );
}

function PickTab({ pick }: { pick: PickRow }) {
  const opening = (pick.opening_odds || pick.odds_display || "").trim();
  return (
    <div className="mt-6 space-y-10">
      <div className="rounded-2xl border-2 border-edge/55 bg-gradient-to-br from-edge/15 to-edge/5 p-6 shadow-lg shadow-edge/10 md:p-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-widest text-edge">The pick</p>
        <p className="mt-3 font-heading text-xl font-bold leading-snug text-[var(--fg)] md:text-2xl">{pick.bet_type}</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <OddsWithMovement pick={pick} size="large" />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Opened at {opening} · now {pick.odds_display}
        </p>
      </div>

      <section>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-[var(--fg)]">The Edge</h2>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--fg)]">
            {pick.reasoning?.trim() || "Analysis will appear here once available."}
          </p>
        </div>
      </section>
    </div>
  );
}

function tabErrorMessage(ctx: PickDetailContextResponse | null): string | null {
  if (!ctx?.error || ctx.stats.kind !== "none") {
    return null;
  }
  return ctx.stats.message || null;
}

function H2HTab({ ctx }: { ctx: PickDetailContextResponse | null }) {
  if (ctx == null) {
    return <p className="mt-6 text-sm text-[var(--muted)]">Loading…</p>;
  }
  const err = tabErrorMessage(ctx);
  if (err) {
    return <p className="mt-6 text-sm text-[var(--muted)]">{err}</p>;
  }
  const rows = ctx.h2h;
  if (!rows.length) {
    return (
      <p className="mt-6 text-sm text-[var(--muted)]">No head-to-head history available for this fixture.</p>
    );
  }
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Home</th>
            <th className="px-3 py-2 font-medium">Score</th>
            <th className="px-3 py-2 font-medium">Away</th>
            <th className="px-3 py-2 font-medium">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((r) => (
            <tr key={`${r.date}-${r.homeTeam}-${r.awayTeam}`} className="text-[var(--fg)]">
              <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-[var(--muted)]">{r.date}</td>
              <td className="px-3 py-2.5">{r.homeTeam}</td>
              <td className="px-3 py-2.5 font-heading font-semibold tabular-nums">{r.score}</td>
              <td className="px-3 py-2.5">{r.awayTeam}</td>
              <td className="px-3 py-2.5 text-[var(--muted)]">{r.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewsTab({ ctx }: { ctx: PickDetailContextResponse | null }) {
  if (ctx == null) {
    return <p className="mt-6 text-sm text-[var(--muted)]">Loading…</p>;
  }
  const err = tabErrorMessage(ctx);
  if (err) {
    return <p className="mt-6 text-sm text-[var(--muted)]">{err}</p>;
  }
  const rows = ctx.injuries;
  if (!rows.length) {
    return <p className="mt-6 text-sm text-[var(--muted)]">No injury news available</p>;
  }
  return (
    <ul className="mt-6 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
      {rows.map((r) => (
        <li key={`${r.player}-${r.team}-${r.type}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <span className="font-medium text-[var(--fg)]">{r.player}</span>
            <span className="text-[var(--muted)]"> · {r.team}</span>
          </div>
          <div className="text-sm text-[var(--muted)]">
            <span className="text-[var(--fg)]">{r.type}</span>
            {r.status ? ` · ${r.status}` : ""}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatsTab({ ctx }: { ctx: PickDetailContextResponse | null }) {
  if (ctx == null) {
    return <p className="mt-6 text-sm text-[var(--muted)]">Loading…</p>;
  }
  const payload = ctx.stats;
  if (payload.kind === "none") {
    return <p className="mt-6 text-sm text-[var(--muted)]">{payload.message}</p>;
  }
  if (payload.kind === "season") {
    return (
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[payload.home, payload.away].map((side) => (
          <div key={side.name} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-edge">{side.name}</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">Season</p>
            <dl className="mt-3 space-y-2 text-sm">
              {side.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 border-b border-[var(--border)]/60 py-1.5 last:border-0">
                  <dt className="text-[var(--muted)]">{row.label}</dt>
                  <dd className="font-medium tabular-nums text-[var(--fg)]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)]">
      <p className="border-b border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Match statistics
      </p>
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase text-[var(--muted)]">
            <th className="px-3 py-2 text-left font-medium">Metric</th>
            <th className="px-3 py-2 text-right font-medium">{payload.homeName}</th>
            <th className="px-3 py-2 text-right font-medium">{payload.awayName}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {payload.rows.map((r) => (
            <tr key={r.type}>
              <td className="px-3 py-2 text-[var(--fg)]">{r.type}</td>
              <td className="px-3 py-2 text-right font-heading tabular-nums text-[var(--fg)]">{r.home}</td>
              <td className="px-3 py-2 text-right font-heading tabular-nums text-[var(--fg)]">{r.away}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OddsTab({ pick }: { pick: PickRow }) {
  const opening = (pick.opening_odds || "").trim();
  const current = (pick.odds_display || "").trim();
  const oImp = americanToImpliedPercent(opening);
  const cImp = americanToImpliedPercent(current);
  const bt = pick.bet_type;
  const pricesInBet = bt.match(/([+-]\d{2,4})/g) || [];
  const p0 = pricesInBet[0];
  const p1 = pricesInBet[1];
  const i0 = p0 != null ? americanToImpliedPercent(p0) : null;
  const i1 = p1 != null ? americanToImpliedPercent(p1) : null;
  const twoFromBet =
    i0 != null && i1 != null ? devigTwoWay(i0, i1) : null;
  const looksThreeWay =
    /\bto win\b|moneyline|\bml\b|draw|tie|1x2/i.test(bt) && !/\bover\b|\bunder\b|btts|total/i.test(bt);
  const threeParsed = extractThreeAmerican(bt);
  const t0 = threeParsed?.[0];
  const t1 = threeParsed?.[1];
  const t2 = threeParsed?.[2];
  const j0 = t0 != null ? americanToImpliedPercent(t0) : null;
  const j1 = t1 != null ? americanToImpliedPercent(t1) : null;
  const j2 = t2 != null ? americanToImpliedPercent(t2) : null;
  const threeWay =
    j0 != null && j1 != null && j2 != null ? devigThreeWay(j0, j1, j2) : null;

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--fg)]">Your line</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card)] text-xs uppercase text-[var(--muted)]">
                <th className="px-3 py-2 text-left font-medium">Market</th>
                <th className="px-3 py-2 text-right font-medium">Opening</th>
                <th className="px-3 py-2 text-right font-medium">Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2.5 text-[var(--fg)]">{pick.bet_type}</td>
                <td className="px-3 py-2.5 text-right font-heading tabular-nums text-[var(--fg)]">{opening || "—"}</td>
                <td className="px-3 py-2.5 text-right">
                  <OddsWithMovement pick={pick} size="default" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{pick.sportsbook}</p>
      </section>

      <section>
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--fg)]">Implied probability</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Raw implied % (vig included in the listed price). Fair / de-vig figures need full market prices.
        </p>
        <dl className="mt-3 space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Opening</dt>
            <dd className="font-medium tabular-nums text-[var(--fg)]">
              {oImp != null ? `${oImp.toFixed(2)}%` : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted)]">Current</dt>
            <dd className="font-medium tabular-nums text-[var(--fg)]">
              {cImp != null ? `${cImp.toFixed(2)}%` : "—"}
            </dd>
          </div>
        </dl>
      </section>

      {twoFromBet && pricesInBet.length >= 2 && (
        <section>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--fg)]">
            Two-way fair odds (vig removed)
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            From the first two American prices found in the bet line (e.g. Over / Under). Add both sides to the pick
            text for a full market breakdown.
          </p>
          <p className="mt-2 text-sm text-[var(--fg)]">
            Fair implied:{" "}
            <span className="font-heading font-semibold tabular-nums">{twoFromBet.fair1.toFixed(2)}%</span> vs{" "}
            <span className="font-heading font-semibold tabular-nums">{twoFromBet.fair2.toFixed(2)}%</span>
          </p>
        </section>
      )}

      {looksThreeWay && threeWay && threeParsed && (
        <section>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--fg)]">
            1X2 de-vig (from prices in bet text)
          </h3>
          <p className="mt-2 text-sm text-[var(--fg)]">
            Home{" "}
            <span className="font-heading tabular-nums">{threeWay.fair1.toFixed(2)}%</span> · Draw{" "}
            <span className="font-heading tabular-nums">{threeWay.fair2.toFixed(2)}%</span> · Away{" "}
            <span className="font-heading tabular-nums">{threeWay.fair3.toFixed(2)}%</span>
          </p>
        </section>
      )}

      {!looksThreeWay && !twoFromBet && (
        <p className="text-xs text-[var(--muted)]">
          Add two American prices in the bet text for a two-way de-vig, or three for 1X2. Single-number lines show raw
          implied % only.
        </p>
      )}
    </div>
  );
}

/** Best-effort: three American prices embedded in bet_type (e.g. +180 / +200 / +155). */
function extractThreeAmerican(text: string): [string, string, string] | null {
  const re = /([+-]\d{2,4})/g;
  const m = text.match(re);
  if (!m || m.length < 3) {
    return null;
  }
  return [m[0], m[1], m[2]];
}
