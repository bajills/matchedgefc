import type { PickRow, SportRecordRow } from "./types";
import { createServerClient } from "./supabase/server";

/** Map Supabase row (legacy or current column names) to `PickRow` for UI components. */
function mapPickRow(row: Record<string, unknown>): PickRow {
  const kickoff =
    (typeof row.kickoff === "string" && row.kickoff) ||
    (typeof row.kickoff_at === "string" && row.kickoff_at) ||
    "";
  return {
    id: String(row.id ?? ""),
    competition: String(row.competition ?? ""),
    match_name: String(row.match_name ?? row.match ?? ""),
    bet_type: String(row.bet_type ?? ""),
    odds_display: String(row.odds_display ?? row.odds ?? ""),
    sportsbook: String(row.sportsbook ?? ""),
    kickoff_at: kickoff,
    sport: String(row.sport ?? "soccer"),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : undefined,
    reasoning: row.reasoning == null ? null : String(row.reasoning),
    result: row.result == null ? null : String(row.result),
    is_free:
      typeof row.is_free === "boolean"
        ? row.is_free
        : row.is_free == null
          ? null
          : Boolean(row.is_free),
  };
}

/** Picks: Supabase only — empty array if unconfigured, error, or no rows. */
export async function getPicks(): Promise<PickRow[]> {
  const supabase = createServerClient();
  if (!supabase) {
    return [];
  }
  const nowIso = new Date().toISOString();

  let data: Record<string, unknown>[] | null = null;
  let error: { message?: string } | null = null;

  const primary = await supabase
    .from("picks")
    .select("*")
    .gte("kickoff", nowIso)
    .order("kickoff", { ascending: true });

  if (!primary.error) {
    data = primary.data as Record<string, unknown>[] | null;
  } else {
    const legacy = await supabase
      .from("picks")
      .select("*")
      .gte("kickoff_at", nowIso)
      .order("kickoff_at", { ascending: true });
    error = legacy.error;
    data = legacy.data as Record<string, unknown>[] | null;
  }

  if (error || !data?.length) {
    return [];
  }
  return data.map(mapPickRow);
}

/** Win-loss: Supabase only — zeros until you log real results in sport_records. */
export async function getSportRecords(): Promise<SportRecordRow[]> {
  const supabase = createServerClient();
  if (!supabase) {
    return zeroRecords();
  }
  const { data, error } = await supabase
    .from("sport_records")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data?.length) {
    return zeroRecords();
  }
  return data as SportRecordRow[];
}

/** Honest launch defaults — no fabricated wins/losses. */
function zeroRecords(): SportRecordRow[] {
  return [
    { id: "soccer", sport_key: "soccer", label: "Soccer", wins: 0, losses: 0 },
    { id: "nba", sport_key: "nba", label: "NBA", wins: 0, losses: 0 },
    { id: "nfl", sport_key: "nfl", label: "NFL", wins: 0, losses: 0 },
  ];
}
