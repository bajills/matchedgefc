/**
 * Match API-Football fixture rows to a pick's `match_name` (team names).
 */

export type ApiFixture = {
  fixture: {
    id: number;
    date?: string;
    status: { short: string; elapsed?: number | null };
  };
  league?: { id: number; season: number; name?: string };
  goals: { home: number | null; away: number | null };
  teams: {
    home: { id?: number; name: string; logo?: string };
    away: { id?: number; name: string; logo?: string };
  };
};

/** Resolved fixture with API-Football team ids (required for H2H / injuries / stats). */
export type MatchedFixture = ApiFixture & {
  teams: {
    home: { id: number; name: string; logo?: string };
    away: { id: number; name: string; logo?: string };
  };
  league: { id: number; season: number; name?: string };
};

function inferSeasonUtc(kickoffIso: string): number {
  const d = new Date(kickoffIso);
  if (Number.isNaN(d.getTime())) {
    return new Date().getUTCFullYear();
  }
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return m >= 7 ? y : y - 1;
}

/** Resolve API fixture row for enrichment; `kickoffIso` fills `season` when missing from the payload. */
export function toMatchedFixture(f: ApiFixture | null, kickoffIso?: string): MatchedFixture | null {
  if (!f) {
    return null;
  }
  const hid = f.teams?.home?.id;
  const aid = f.teams?.away?.id;
  const lid = f.league?.id;
  let season = f.league?.season;
  const fid = f.fixture?.id;
  if (hid == null || aid == null || lid == null || fid == null) {
    return null;
  }
  if (season == null && kickoffIso) {
    season = inferSeasonUtc(kickoffIso);
  }
  if (season == null) {
    return null;
  }
  const leagueName = f.league?.name ?? "";
  const merged: MatchedFixture = {
    ...f,
    league: { id: lid, season, name: leagueName },
    teams: {
      home: { id: hid, name: f.teams.home.name, logo: f.teams.home.logo },
      away: { id: aid, name: f.teams.away.name, logo: f.teams.away.logo },
    },
  };
  return merged;
}

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
