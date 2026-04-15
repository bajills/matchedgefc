import type { PickRow } from "./types";

/** Free picks are rows with `is_free === true` (pipeline sets exactly two). */
export const FREE_PICKS_VISIBLE = 2;
/** Blurred preview cards for non-members (after free picks). */
export const LOCKED_PREVIEW_COUNT = 3;

export function kickoffMs(p: PickRow): number {
  const t = Date.parse(p.kickoff_at || "");
  return Number.isFinite(t) ? t : 0;
}

/** One row per logical pick — same match + kickoff + bet can appear twice if the DB had duplicate inserts. */
export function dedupePicksByMatchKickoffBet(picks: PickRow[]): PickRow[] {
  const seen = new Set<string>();
  const out: PickRow[] = [];
  for (const p of picks) {
    const key = `${(p.match_name || "").trim().toLowerCase()}|${(p.kickoff_at || "").trim()}|${(p.bet_type || "").trim().toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(p);
  }
  return out;
}

/** All picks with `is_free === true` (mutually exclusive with locked / Edge-only rows). */
export function computeUnlockedIds(sorted: PickRow[]): Set<string> {
  const ids = new Set<string>();
  for (const p of sorted) {
    if (p.is_free === true) {
      ids.add(p.id);
    }
  }
  return ids;
}

export function isPickUnlocked(pick: PickRow, _soccerPicks: PickRow[]): boolean {
  return pick.is_free === true;
}
