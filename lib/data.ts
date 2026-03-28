import type { PickRow, SportRecordRow } from "./types";
import { createServerClient } from "./supabase/server";

/** Picks: Supabase only — empty array if unconfigured, error, or no rows. */
export async function getPicks(): Promise<PickRow[]> {
  const supabase = createServerClient();
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from("picks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("kickoff_at", { ascending: true });
  if (error || !data?.length) {
    return [];
  }
  return data as PickRow[];
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
