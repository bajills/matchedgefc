/**
 * API-Football (api-sports.io) — server-only. Budget + 60s response cache.
 */

const BASE = "https://v3.football.api-sports.io";
const CACHE_MS = 60_000;
const DAILY_MAX = 90;

type CacheEntry = { at: number; json: unknown };
const responseCache = new Map<string, CacheEntry>();

let budgetDay = "";
let budgetCount = 0;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns false when the daily budget is exhausted (no request should be made). */
export function consumeApiFootballRequest(): boolean {
  const d = todayUtc();
  if (budgetDay !== d) {
    budgetDay = d;
    budgetCount = 0;
  }
  if (budgetCount >= DAILY_MAX) {
    return false;
  }
  budgetCount += 1;
  return true;
}

export function getApiFootballBudgetSnapshot(): { day: string; used: number; max: number } {
  const d = todayUtc();
  if (budgetDay !== d) {
    return { day: d, used: 0, max: DAILY_MAX };
  }
  return { day: d, used: budgetCount, max: DAILY_MAX };
}

function getCached(key: string): unknown | null {
  const e = responseCache.get(key);
  if (!e || Date.now() - e.at >= CACHE_MS) {
    return null;
  }
  return e.json;
}

function setCached(key: string, json: unknown): void {
  responseCache.set(key, { at: Date.now(), json });
}

function getApiKey(): string | null {
  const k = process.env.API_FOOTBALL_KEY?.trim();
  return k || null;
}

async function fetchJson(path: string, params: Record<string, string>): Promise<unknown> {
  const key = getApiKey();
  if (!key) {
    throw new Error("API_FOOTBALL_KEY is not configured");
  }
  const qs = new URLSearchParams(params);
  const url = `${BASE}${path}?${qs.toString()}`;
  const r = await fetch(url, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 0 },
  });
  if (!r.ok) {
    throw new Error(`API-Football ${r.status}: ${await r.text()}`);
  }
  return r.json();
}

/** GET /fixtures?live=all — in-progress games. */
export async function fetchFixturesLiveAll(): Promise<unknown> {
  const cacheKey = "fixtures:live=all";
  const hit = getCached(cacheKey);
  if (hit != null) {
    return hit;
  }
  if (!consumeApiFootballRequest()) {
    return getCached(cacheKey) ?? { response: [], errors: [] };
  }
  const json = await fetchJson("/fixtures", { live: "all" });
  setCached(cacheKey, json);
  return json;
}

/** GET /fixtures?date=YYYY-MM-DD — upcoming / finished / live on that calendar day. */
export async function fetchFixturesByDate(dateIso: string): Promise<unknown> {
  const cacheKey = `fixtures:date=${dateIso}`;
  const hit = getCached(cacheKey);
  if (hit != null) {
    return hit;
  }
  if (!consumeApiFootballRequest()) {
    return getCached(cacheKey) ?? { response: [], errors: [] };
  }
  const json = await fetchJson("/fixtures", { date: dateIso });
  setCached(cacheKey, json);
  return json;
}

/**
 * Fetches live + date fixtures for the kickoff UTC day (cache per endpoint).
 * Uses up to 2 budget units when both caches miss.
 */
export async function fetchFixturesForPickWindow(kickoffUtcDate: string): Promise<{
  live: unknown;
  byDate: unknown;
}> {
  const [live, byDate] = await Promise.all([
    fetchFixturesLiveAll(),
    fetchFixturesByDate(kickoffUtcDate),
  ]);
  return { live, byDate };
}

/** Generic cached GET — uses same 60s cache + daily budget as other fixture calls. */
export async function fetchApiFootballCached(
  path: string,
  params: Record<string, string>,
  cacheKey: string,
): Promise<unknown> {
  const hit = getCached(cacheKey);
  if (hit != null) {
    return hit;
  }
  if (!consumeApiFootballRequest()) {
    return { response: [], errors: [] };
  }
  const json = await fetchJson(path, params);
  setCached(cacheKey, json);
  return json;
}
