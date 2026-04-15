"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PickRow } from "@/lib/types";

type LiveJson = {
  phase?: string;
  competition?: string;
  homeName?: string;
  awayName?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeLogo?: string | null;
  awayLogo?: string | null;
  statusLine?: string;
  isLive?: boolean;
  kickoffInMs?: number;
  /** When false, fixture is FT — stop polling */
  pollApi?: boolean;
  result?: string | null;
  finalScoreDisplay?: string | null;
  error?: string;
  matchPending?: boolean;
};

function teamInitial(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

function formatKickoffCountdown(ms: number): string {
  if (ms <= 0) {
    return "Starting soon";
  }
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  if (d > 0) {
    return `${d}d ${h}h`;
  }
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

export function LiveScoreWidget({ pick }: { pick: PickRow }) {
  const router = useRouter();
  const [live, setLive] = useState<LiveJson | null>(null);
  const [tick, setTick] = useState(0);

  const kickoffMs = useMemo(() => Date.parse(pick.kickoff_at), [pick.kickoff_at]);
  const resultLower = (pick.result || "pending").toLowerCase();
  const pickGraded =
    resultLower === "win" || resultLower === "loss" || resultLower === "push";
  const liveGraded =
    live?.result === "win" || live?.result === "loss" || live?.result === "push";
  const isGraded = pickGraded || liveGraded;

  const threeHours = 3 * 60 * 60 * 1000;
  const withinPollWindow =
    Number.isFinite(kickoffMs) && Date.now() >= kickoffMs - threeHours;

  const pollEndpoint = useCallback(async () => {
    const r = await fetch(`/api/picks/${pick.id}/live`, { cache: "no-store" });
    const j = (await r.json()) as LiveJson;
    setLive(j);
    if (j.result === "win" || j.result === "loss" || j.result === "push") {
      router.refresh();
    }
  }, [pick.id, router]);

  // Local countdown before API window (no server calls).
  useEffect(() => {
    if (pickGraded || withinPollWindow) {
      return;
    }
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [pickGraded, withinPollWindow]);

  // Poll API every 60s when in window and pick still pending in DB.
  useEffect(() => {
    if (
      pickGraded ||
      liveGraded ||
      live?.pollApi === false ||
      !withinPollWindow ||
      pick.sport !== "soccer"
    ) {
      return;
    }
    void pollEndpoint();
    const id = setInterval(() => {
      void pollEndpoint();
    }, 60_000);
    return () => clearInterval(id);
  }, [pickGraded, liveGraded, live?.pollApi, withinPollWindow, pick.sport, pollEndpoint]);

  void tick;
  const preKickoffMs = Number.isFinite(kickoffMs) ? Math.max(0, kickoffMs - Date.now()) : 0;

  const homeName =
    live?.homeName ??
    pick.match_name.split(/\s+vs\.?\s+/i)[0]?.trim() ??
    "Home";
  const awayName =
    live?.awayName ??
    pick.match_name.split(/\s+vs\.?\s+/i)[1]?.trim() ??
    "Away";

  const displayFinalScore = pick.final_score ?? live?.finalScoreDisplay;

  const showScores =
    live &&
    live.homeScore != null &&
    live.awayScore != null &&
    (live.phase === "live" || live.phase === "post");

  const statusText = (() => {
    if (isGraded) {
      if (displayFinalScore) {
        return `FT · ${displayFinalScore}`;
      }
      return "FT";
    }
    if (!withinPollWindow) {
      return `Kickoff in ${formatKickoffCountdown(preKickoffMs)}`;
    }
    if (live?.statusLine) {
      return live.statusLine;
    }
    return "Loading…";
  })();

  const centerScore = (() => {
    if (isGraded && displayFinalScore) {
      const parts = displayFinalScore.split(/[-–—]/);
      if (parts.length === 2) {
        return (
          <>
            <span className="text-4xl font-bold tabular-nums text-[var(--fg)] md:text-5xl">
              {parts[0].trim()}
            </span>
            <span className="text-2xl font-bold text-[var(--muted)]">—</span>
            <span className="text-4xl font-bold tabular-nums text-[var(--fg)] md:text-5xl">
              {parts[1].trim()}
            </span>
          </>
        );
      }
    }
    if (showScores && live && live.homeScore != null && live.awayScore != null) {
      return (
        <>
          <span className="text-4xl font-bold tabular-nums text-[var(--fg)] md:text-5xl">
            {live.homeScore}
          </span>
          <span className="text-2xl font-bold text-[var(--muted)]">—</span>
          <span className="text-4xl font-bold tabular-nums text-[var(--fg)] md:text-5xl">
            {live.awayScore}
          </span>
        </>
      );
    }
    if (withinPollWindow && (live?.phase === "pre" || !live)) {
      return (
        <span className="text-xl font-semibold tabular-nums text-[var(--fg)] md:text-2xl">
          {live?.matchPending ? "…" : `Kickoff in ${formatKickoffCountdown(preKickoffMs)}`}
        </span>
      );
    }
    return (
      <span className="text-lg font-medium text-[var(--muted)]">
        {`Kickoff in ${formatKickoffCountdown(preKickoffMs)}`}
      </span>
    );
  })();

  return (
    <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-heading text-xs font-semibold uppercase tracking-wider text-edge">
          {live?.competition ?? pick.competition}
        </span>
        {live?.isLive ? (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            Live
          </span>
        ) : null}
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <TeamFace name={homeName} logoUrl={live?.homeLogo} initial={teamInitial(homeName)} />
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate font-heading text-base font-bold text-[var(--fg)] md:text-lg">{homeName}</p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-center gap-2 px-2">{centerScore}</div>

        <div className="flex flex-1 items-center gap-3 sm:flex-row-reverse">
          <TeamFace name={awayName} logoUrl={live?.awayLogo} initial={teamInitial(awayName)} />
          <div className="min-w-0 flex-1 sm:text-right">
            <p className="truncate font-heading text-base font-bold text-[var(--fg)] md:text-lg">{awayName}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        {live?.error ? (
          <span className="text-amber-600 dark:text-amber-400">{live.error}</span>
        ) : (
          statusText
        )}
      </p>
    </div>
  );
}

function TeamFace({
  name,
  logoUrl,
  initial,
}: {
  name: string;
  logoUrl?: string | null;
  initial: string;
}) {
  if (logoUrl) {
    return (
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-white dark:bg-navy-800">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote API logos */}
        <img src={logoUrl} alt={name} width={48} height={48} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-edge/40 bg-edge/10 font-heading text-sm font-bold text-edge"
      aria-hidden
    >
      {initial}
    </div>
  );
}
