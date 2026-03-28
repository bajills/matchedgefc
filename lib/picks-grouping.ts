import type { PickRow } from "./types";

/** Calendar date key in the user's local timezone (for grouping). */
export function kickoffDateKeyLocal(iso: string): string {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) {
    return "unknown";
  }
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** e.g. "Tuesday, March 31" */
export function formatDateGroupHeader(dateKey: string): string {
  if (dateKey === "unknown") {
    return "Date TBD";
  }
  const [ys, ms, ds] = dateKey.split("-");
  const y = Number(ys);
  const mo = Number(ms);
  const d = Number(ds);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) {
    return "Date TBD";
  }
  const date = new Date(y, mo - 1, d);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function groupPicksByLocalDate(sortedPicks: PickRow[]): { dateKey: string; picks: PickRow[] }[] {
  const map = new Map<string, PickRow[]>();
  for (const p of sortedPicks) {
    const k = kickoffDateKeyLocal(p.kickoff_at);
    if (!map.has(k)) {
      map.set(k, []);
    }
    map.get(k)!.push(p);
  }
  const entries = Array.from(map.entries()).sort(([a], [b]) => {
    if (a === "unknown") {
      return 1;
    }
    if (b === "unknown") {
      return -1;
    }
    return a.localeCompare(b);
  });
  return entries.map(([dateKey, picks]) => ({ dateKey, picks }));
}
