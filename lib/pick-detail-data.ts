import type { PickRow } from "./types";
import { fetchApiFootballCached, fetchFixturesForPickWindow } from "./api-football/client";
import { extractFixtureList, findMatchingFixture, toMatchedFixture } from "./api-football/fixture-match";

export type H2HMeeting = {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  result: string;
};

export type InjuryRow = {
  player: string;
  team: string;
  type: string;
  status: string;
};

export type StatsTabPayload =
  | {
      kind: "match";
      rows: { type: string; home: string; away: string }[];
      homeName: string;
      awayName: string;
    }
  | {
      kind: "season";
      home: { name: string; rows: { label: string; value: string }[] };
      away: { name: string; rows: { label: string; value: string }[] };
    }
  | { kind: "none"; message: string };

export type PickDetailApiPayload = {
  h2h: H2HMeeting[];
  injuries: InjuryRow[];
  stats: StatsTabPayload;
  resolved: boolean;
};

/** Subset of tabs for `/api/picks/[id]/context?tab=` — fetch only that block after fixture resolve. */
export type PickContextTab = "h2h" | "team-news" | "stats";

export type PickDetailContextResponse = PickDetailApiPayload & {
  error?: string;
};

const FINISHED = new Set(["FT", "AET", "PEN"]);

function utcDay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

function dedupeFixtures(rows: unknown[]): unknown[] {
  const seen = new Set<number>();
  const out: unknown[] = [];
  for (const raw of rows) {
    const id = (raw as { fixture?: { id?: number } })?.fixture?.id;
    if (id == null || seen.has(id)) {
      continue;
    }
    seen.add(id);
    out.push(raw);
  }
  return out;
}

function h2hResult(homeName: string, awayName: string, gh: number, ga: number): string {
  if (gh > ga) {
    return `${homeName} win`;
  }
  if (ga > gh) {
    return `${awayName} win`;
  }
  return "Draw";
}

function parseHeadToHead(payload: unknown, currentHome: string, currentAway: string): H2HMeeting[] {
  const res = (payload as { response?: unknown[] })?.response;
  if (!Array.isArray(res)) {
    return [];
  }
  const out: H2HMeeting[] = [];
  for (const row of res) {
    const r = row as {
      fixture?: { date?: string; status?: { short?: string } };
      teams?: {
        home?: { name?: string };
        away?: { name?: string };
      };
      goals?: { home?: number | null; away?: number | null };
    };
    const st = r.fixture?.status?.short || "";
    if (!FINISHED.has(st)) {
      continue;
    }
    const hname = String(r.teams?.home?.name || "");
    const aname = String(r.teams?.away?.name || "");
    const gh = Number(r.goals?.home ?? 0);
    const ga = Number(r.goals?.away ?? 0);
    const date = String(r.fixture?.date || "").slice(0, 10);
    out.push({
      date,
      homeTeam: hname,
      awayTeam: aname,
      score: `${gh}-${ga}`,
      result: h2hResult(hname, aname, gh, ga),
    });
    if (out.length >= 5) {
      break;
    }
  }
  return out;
}

function parseInjuriesResponse(
  payload: unknown,
  homeName: string,
  awayName: string,
): InjuryRow[] {
  const res = (payload as { response?: unknown[] })?.response;
  if (!Array.isArray(res)) {
    return [];
  }
  const rows: InjuryRow[] = [];
  for (const row of res) {
    const r = row as {
      team?: { name?: string };
      player?: { name?: string; type?: string; reason?: string };
    };
    const pl = r.player;
    if (!pl || typeof pl !== "object") {
      continue;
    }
    const name = String((pl as { name?: string }).name || "").trim();
    if (!name) {
      continue;
    }
    const typ = String((pl as { type?: string }).type || "—");
    const reason = String((pl as { reason?: string }).reason || "").trim();
    const team = String(r.team?.name || "").trim() || `${homeName} / ${awayName}`;
    rows.push({
      player: name,
      team,
      type: typ.toLowerCase().includes("susp") ? "Suspension" : typ,
      status: reason || "—",
    });
  }
  return rows;
}

function getNested(obj: unknown, keys: string[]): unknown {
  let x: unknown = obj;
  for (const k of keys) {
    if (x == null || typeof x !== "object") {
      return undefined;
    }
    x = (x as Record<string, unknown>)[k];
  }
  return x;
}

function seasonSummaryForTeam(payload: unknown, fallbackName: string): { name: string; rows: { label: string; value: string }[] } {
  const raw = (payload as { response?: unknown }).response;
  const r =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  if (!r) {
    return { name: fallbackName, rows: [] };
  }
  const team = (r.team as { name?: string } | undefined)?.name || fallbackName;
  const rows: { label: string; value: string }[] = [];
  const form = r?.form;
  if (typeof form === "string" && form) {
    rows.push({ label: "Form (last 5)", value: form });
  }
  const played = getNested(r, ["fixtures", "played", "total"]);
  if (typeof played === "number") {
    rows.push({ label: "Matches played", value: String(played) });
  }
  const gf = getNested(r, ["goals", "for", "total", "total"]);
  const ga = getNested(r, ["goals", "against", "total", "total"]);
  if (typeof gf === "number") {
    rows.push({ label: "Goals scored", value: String(gf) });
  }
  if (typeof ga === "number") {
    rows.push({ label: "Goals conceded", value: String(ga) });
  }
  const cs = getNested(r, ["clean_sheet", "total"]);
  if (typeof cs === "number") {
    rows.push({ label: "Clean sheets", value: String(cs) });
  }
  const fts = getNested(r, ["failed_to_score", "total"]);
  if (typeof fts === "number") {
    rows.push({ label: "Failed to score", value: String(fts) });
  }
  return { name: team, rows };
}

function parseFixtureMatchStats(payload: unknown): StatsTabPayload {
  const res = (payload as { response?: unknown[] })?.response;
  if (!Array.isArray(res) || res.length < 2) {
    return { kind: "none", message: "Match statistics not available." };
  }
  const h = res[0] as {
    team?: { name?: string };
    statistics?: { type?: string; value?: unknown }[];
  };
  const a = res[1] as {
    team?: { name?: string };
    statistics?: { type?: string; value?: unknown }[];
  };
  const hs = h.statistics || [];
  const as = a.statistics || [];
  const mapA = new Map(as.map((s) => [s.type, s.value]));
  const rows = hs
    .filter((s) => s.type)
    .map((s) => ({
      type: String(s.type),
      home: formatStatVal(s.value),
      away: formatStatVal(mapA.get(s.type)),
    }));
  return {
    kind: "match",
    rows,
    homeName: h.team?.name || "Home",
    awayName: a.team?.name || "Away",
  };
}

function formatStatVal(v: unknown): string {
  if (v == null) {
    return "—";
  }
  if (typeof v === "object") {
    return JSON.stringify(v);
  }
  return String(v);
}

/**
 * Server-only: loads H2H / injuries / stats from API-Football (uses `API_FOOTBALL_KEY`).
 * Call from Route Handlers or other server code — not from client bundles.
 * @param tab If set, only fetches that section (after resolving the fixture once).
 */
export async function fetchPickDetailContext(
  pick: PickRow,
  tab?: PickContextTab,
): Promise<PickDetailContextResponse> {
  const empty: PickDetailApiPayload = {
    h2h: [],
    injuries: [],
    stats: { kind: "none", message: "Statistics unavailable." },
    resolved: false,
  };

  if (pick.sport !== "soccer" || !process.env.API_FOOTBALL_KEY?.trim()) {
    return {
      ...empty,
      stats: {
        kind: "none",
        message: "API-Football is not configured for this pick.",
      },
      error: "api_football_unconfigured",
    };
  }

  try {
    const day = utcDay(pick.kickoff_at);
    const { live, byDate } = await fetchFixturesForPickWindow(day);
    const merged = dedupeFixtures([...extractFixtureList(live), ...extractFixtureList(byDate)]);
    const raw = findMatchingFixture(pick.match_name, merged);
    const fx = toMatchedFixture(raw, pick.kickoff_at);
    if (!fx) {
      return {
        ...empty,
        stats: {
          kind: "none",
          message: "Could not match this pick to an API-Football fixture.",
        },
        error: "fixture_unmatched",
      };
    }

    const hid = fx.teams.home.id;
    const aid = fx.teams.away.id;
    const lid = fx.league.id;
    const season = fx.league.season;
    const fixtureId = fx.fixture.id;
    const a = Math.min(hid, aid);
    const b = Math.max(hid, aid);
    const st = fx.fixture.status?.short || "";

    const needH2h = tab == null || tab === "h2h";
    const needNews = tab == null || tab === "team-news";
    const needStats = tab == null || tab === "stats";

    const h2hKey = `h2h:${a}-${b}:5`;
    const injFixKey = `injuries:fx:${fixtureId}`;
    const statFixKey = `stats:fixture:${fixtureId}`;
    const statHomeKey = `stats:team:${hid}:${lid}:${season}`;
    const statAwayKey = `stats:team:${aid}:${lid}:${season}`;

    const finished = FINISHED.has(st);

    let h2hRaw: unknown = { response: [] };
    let injRaw: unknown = { response: [] };
    let statsRaw: unknown | [unknown, unknown] = [{ response: {} }, { response: {} }];

    if (needH2h || needNews || needStats) {
      const h2hP = needH2h
        ? fetchApiFootballCached(
            "/fixtures/headtohead",
            { h2h: `${a}-${b}`, last: "5" },
            h2hKey,
          )
        : Promise.resolve({ response: [] });
      const injFixP = needNews
        ? fetchApiFootballCached("/injuries", { fixture: String(fixtureId) }, injFixKey)
        : Promise.resolve({ response: [] });
      const statsP =
        needStats && finished
          ? fetchApiFootballCached("/fixtures/statistics", { fixture: String(fixtureId) }, statFixKey)
          : needStats && !finished
            ? Promise.all([
                fetchApiFootballCached(
                  "/teams/statistics",
                  { team: String(hid), league: String(lid), season: String(season) },
                  statHomeKey,
                ),
                fetchApiFootballCached(
                  "/teams/statistics",
                  { team: String(aid), league: String(lid), season: String(season) },
                  statAwayKey,
                ),
              ])
            : Promise.resolve(null);

      const results = await Promise.all([h2hP, injFixP, statsP]);
      h2hRaw = results[0];
      injRaw = results[1];
      statsRaw = results[2] ?? statsRaw;
    }

    const h2h = needH2h
      ? parseHeadToHead(h2hRaw, fx.teams.home.name, fx.teams.away.name)
      : [];

    let injuries: InjuryRow[] = [];
    if (needNews) {
      injuries = parseInjuriesResponse(injRaw, fx.teams.home.name, fx.teams.away.name);
      if (injuries.length === 0) {
        const injH = await fetchApiFootballCached(
          "/injuries",
          {
            team: String(hid),
            league: String(lid),
            season: String(season),
          },
          `injuries:team:${hid}:${lid}:${season}`,
        );
        const injA = await fetchApiFootballCached(
          "/injuries",
          {
            team: String(aid),
            league: String(lid),
            season: String(season),
          },
          `injuries:team:${aid}:${lid}:${season}`,
        );
        injuries = [
          ...parseInjuriesResponse(injH, fx.teams.home.name, fx.teams.away.name),
          ...parseInjuriesResponse(injA, fx.teams.home.name, fx.teams.away.name),
        ];
      }
      const injSeen = new Set<string>();
      injuries = injuries.filter((row) => {
        const k = `${row.player.toLowerCase()}|${row.team.toLowerCase()}`;
        if (injSeen.has(k)) {
          return false;
        }
        injSeen.add(k);
        return true;
      });
    }

    let stats: StatsTabPayload = empty.stats;
    if (needStats) {
      if (finished) {
        const matchStats = parseFixtureMatchStats(statsRaw as unknown);
        stats =
          matchStats.kind === "match" && matchStats.rows.length > 0
            ? matchStats
            : { kind: "none", message: "Match statistics not available." };
      } else {
        const [homeS, awayS] = statsRaw as [unknown, unknown];
        const home = seasonSummaryForTeam(homeS, fx.teams.home.name);
        const away = seasonSummaryForTeam(awayS, fx.teams.away.name);
        if (home.rows.length === 0 && away.rows.length === 0) {
          stats = { kind: "none", message: "Season statistics not available." };
        } else {
          stats = { kind: "season", home, away };
        }
      }
    }

    return {
      h2h,
      injuries,
      stats,
      resolved: true,
    };
  } catch {
    return {
      ...empty,
      stats: { kind: "none", message: "Could not load match data." },
      error: "fetch_failed",
    };
  }
}
