import type { PickRow } from "./types";

export function kickoffMs(p: PickRow): number {
  const t = Date.parse(p.kickoff_at || "");
  return Number.isFinite(t) ? t : 0;
}

/**
 * In kickoff order, the first two picks with `is_free === true` are treated as unlocked for display.
 */
export function computeUnlockedIds(sorted: PickRow[]): Set<string> {
  let slots = 2;
  const ids = new Set<string>();
  for (const p of sorted) {
    if (p.is_free === true && slots > 0) {
      ids.add(p.id);
      slots -= 1;
    }
  }
  return ids;
}

export function isPickUnlocked(pick: PickRow, soccerPicks: PickRow[]): boolean {
  const sorted = [...soccerPicks].sort((a, b) => kickoffMs(a) - kickoffMs(b));
  return computeUnlockedIds(sorted).has(pick.id);
}
