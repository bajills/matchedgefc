/**
 * Match API-Football fixture rows to a pick's `match_name` (team names).
 */

export type ApiFixture = {
  fixture: {
    id: number;
    status: { short: string; elapsed?: number | null };
  };
  goals: { home: number | null; away: number | null };
  teams: {
    home: { name: string; logo?: string };
    away: { name: string; logo?: string };
  };
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(fc|cf|afc|sc|ac)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenScore(a: string, b: string): number {
  const na = norm(a);
  const nb = norm(b);
  if (!na.length || !nb.length) {
    return 0;
  }
  if (na === nb) {
    return 1;
  }
  if (na.includes(nb) || nb.includes(na)) {
    return 0.92;
  }
  const ta = new Set(na.split(" ").filter((w) => w.length > 2));
  const tb = new Set(nb.split(" ").filter((w) => w.length > 2));
  let hit = 0;
  ta.forEach((x) => {
    if (tb.has(x)) {
      hit += 1;
    }
  });
  return hit >= 1 ? 0.75 + 0.05 * hit : 0;
}

export function parseMatchTeams(matchName: string): { home: string; away: string } | null {
  const s = matchName.trim();
  const vs = /\s+vs\.?\s+/i;
  if (vs.test(s)) {
    const parts = s.split(vs);
    if (parts.length === 2) {
      return { home: parts[0].trim(), away: parts[1].trim() };
    }
  }
  for (const sep of [" v ", " – ", " — ", " - "]) {
    const idx = s.toLowerCase().indexOf(sep);
    if (idx >= 0) {
      return {
        home: s.slice(0, idx).trim(),
        away: s.slice(idx + sep.length).trim(),
      };
    }
  }
  return null;
}

/** Best fixture match by team names (handles home/away swap vs pick string order). */
export function findMatchingFixture(
  matchName: string,
  responses: unknown[],
): ApiFixture | null {
  const pick = parseMatchTeams(matchName);
  if (!pick) {
    return null;
  }

  const candidates: ApiFixture[] = [];
  for (const raw of responses) {
    if (!raw || typeof raw !== "object") {
      continue;
    }
    const o = raw as ApiFixture;
    if (!o.teams?.home?.name || !o.teams?.away?.name) {
      continue;
    }
    candidates.push(o);
  }

  let best: ApiFixture | null = null;
  let bestSc = 0;

  for (const f of candidates) {
    const hn = f.teams.home.name;
    const an = f.teams.away.name;
    const s1 =
      0.5 * tokenScore(pick.home, hn) +
      0.5 * tokenScore(pick.away, an);
    const s2 =
      0.5 * tokenScore(pick.home, an) +
      0.5 * tokenScore(pick.away, hn);
    const sc = Math.max(s1, s2);
    if (sc > bestSc) {
      bestSc = sc;
      best = f;
    }
  }

  if (best && bestSc >= 0.72) {
    return best;
  }
  return null;
}

export function extractFixtureList(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const r = (payload as { response?: unknown[] }).response;
  return Array.isArray(r) ? r : [];
}
