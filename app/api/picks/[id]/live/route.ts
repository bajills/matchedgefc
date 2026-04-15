import { NextResponse } from "next/server";
import { fetchFixturesForPickWindow } from "@/lib/api-football/client";
import {
  extractFixtureList,
  findMatchingFixture,
  parseMatchTeams,
  type ApiFixture,
} from "@/lib/api-football/fixture-match";
import { formatFinalScore, gradeSoccerPick } from "@/lib/grade-soccer-pick";
import { mapPickRow } from "@/lib/data";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const FINISHED = new Set(["FT", "AET", "PEN", "AWD", "WO"]);
const LIVE_STATUSES = new Set([
  "1H",
  "HT",
  "2H",
  "ET",
  "BT",
  "P",
  "LIVE",
]);

function pickRowFromDb(row: Record<string, unknown>) {
  return mapPickRow(row);
}

async function loadPick(id: string) {
  const supabase = createServerClient();
  if (!supabase) {
    return null;
  }
  const q = await supabase.from("picks").select("*").eq("id", id).maybeSingle();
  if (q.error || !q.data) {
    return null;
  }
  return pickRowFromDb(q.data as Record<string, unknown>);
}

function kickoffMs(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

function utcDateString(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

function msUntilKickoff(kickoffIso: string): number {
  const k = kickoffMs(kickoffIso);
  if (!Number.isFinite(k)) {
    return 0;
  }
  return Math.max(0, k - Date.now());
}

function formatKickoffHuman(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

function statusLineFromFixture(f: ApiFixture): string {
  const st = f.fixture.status.short;
  const el = f.fixture.status.elapsed;
  if (FINISHED.has(st)) {
    return st === "FT" ? "FT" : `${st}`;
  }
  if (st === "HT") {
    return "HT";
  }
  if (LIVE_STATUSES.has(st) || (el != null && el > 0)) {
    const min = el != null ? `${el}'` : "Live";
    return `Live · ${min}`;
  }
  if (st === "NS") {
    return "Not started";
  }
  return st || "—";
}

/** Read-modify-write sport_records (no RPC required). */
async function incrementSportRecordFallback(
  grade: "win" | "loss" | "push",
): Promise<void> {
  if (grade === "push") {
    return;
  }
  const svc = createServiceClient();
  if (!svc) {
    return;
  }
  const col = grade === "win" ? "wins" : "losses";
  const { data, error } = await svc.from("sport_records").select("wins,losses").eq("sport_key", "soccer").maybeSingle();
  if (error || !data) {
    return;
  }
  const cur = data as { wins: number; losses: number };
  await svc
    .from("sport_records")
    .update({
      [col]: (col === "wins" ? cur.wins : cur.losses) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("sport_key", "soccer");
}

async function applyGradeToSupabaseSimple(
  pickId: string,
  grade: "win" | "loss" | "push",
  finalScore: string,
): Promise<void> {
  const svc = createServiceClient();
  if (!svc) {
    return;
  }
  const upd = await svc
    .from("picks")
    .update({
      result: grade,
      final_score: finalScore,
    })
    .eq("id", pickId)
    .eq("result", "pending")
    .select("id");

  if (upd.error || !upd.data?.length) {
    return;
  }

  await incrementSportRecordFallback(grade);
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  const pick = await loadPick(id);
  if (!pick) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const teams = parseMatchTeams(pick.match_name);
  const homeLabel = teams?.home ?? "Home";
  const awayLabel = teams?.away ?? "Away";

  const resultLower = (pick.result || "pending").toLowerCase();
  if (resultLower === "win" || resultLower === "loss" || resultLower === "push") {
    let hs: number | null = null;
    let as: number | null = null;
    const fs = (pick.final_score || "").trim();
    const parts = fs.split(/[-–—]/);
    if (parts.length === 2) {
      const a = parseInt(parts[0].trim(), 10);
      const b = parseInt(parts[1].trim(), 10);
      if (Number.isFinite(a) && Number.isFinite(b)) {
        hs = a;
        as = b;
      }
    }
    return NextResponse.json({
      phase: "post",
      competition: pick.competition,
      homeName: homeLabel,
      awayName: awayLabel,
      homeScore: hs,
      awayScore: as,
      statusLine: pick.final_score ? `FT · ${pick.final_score}` : "FT",
      isLive: false,
      pollApi: false,
      result: pick.result,
      finalScoreDisplay: pick.final_score ?? null,
    });
  }

  if (pick.sport !== "soccer") {
    return NextResponse.json({
      phase: "pre",
      competition: pick.competition,
      homeName: homeLabel,
      awayName: awayLabel,
      kickoffInMs: msUntilKickoff(pick.kickoff_at),
      statusLine: `Kickoff in ${formatKickoffHuman(msUntilKickoff(pick.kickoff_at))}`,
      isLive: false,
      apiFootballSkipped: true,
    });
  }

  const ko = kickoffMs(pick.kickoff_at);
  const threeHours = 3 * 60 * 60 * 1000;
  const withinPollWindow = Number.isFinite(ko) && Date.now() >= ko - threeHours;

  if (!withinPollWindow) {
    return NextResponse.json({
      phase: "pre",
      competition: pick.competition,
      homeName: homeLabel,
      awayName: awayLabel,
      kickoffInMs: msUntilKickoff(pick.kickoff_at),
      statusLine: `Kickoff in ${formatKickoffHuman(msUntilKickoff(pick.kickoff_at))}`,
      isLive: false,
      pollApi: false,
    });
  }

  if (!process.env.API_FOOTBALL_KEY?.trim()) {
    return NextResponse.json({
      phase: "pre",
      competition: pick.competition,
      homeName: homeLabel,
      awayName: awayLabel,
      kickoffInMs: msUntilKickoff(pick.kickoff_at),
      statusLine: "Configure API_FOOTBALL_KEY for live scores",
      isLive: false,
      apiFootballUnavailable: true,
    });
  }

  try {
    const utcDay = utcDateString(pick.kickoff_at);
    const { live, byDate } = await fetchFixturesForPickWindow(utcDay);
    const rawMerged = [...extractFixtureList(live), ...extractFixtureList(byDate)];
    const seenIds = new Set<number>();
    const merged = rawMerged.filter((row) => {
      const id = (row as ApiFixture).fixture?.id;
      if (id == null || seenIds.has(id)) {
        return false;
      }
      seenIds.add(id);
      return true;
    });
    const fixture = findMatchingFixture(pick.match_name, merged);

    if (!fixture) {
      return NextResponse.json({
        phase: "pre",
        competition: pick.competition,
        homeName: homeLabel,
        awayName: awayLabel,
        kickoffInMs: msUntilKickoff(pick.kickoff_at),
        statusLine: `Kickoff in ${formatKickoffHuman(msUntilKickoff(pick.kickoff_at))}`,
        isLive: false,
        matchPending: true,
      });
    }

    const st = fixture.fixture.status.short;
    const h = fixture.goals.home ?? 0;
    const a = fixture.goals.away ?? 0;
    const homeName = fixture.teams.home.name;
    const awayName = fixture.teams.away.name;
    const isLive = LIVE_STATUSES.has(st) && !FINISHED.has(st);
    const isFinished = FINISHED.has(st);

    let graded: { result: string; finalScoreDisplay: string } | null = null;
    if (isFinished && resultLower === "pending") {
      const grade = gradeSoccerPick(pick.bet_type, pick.match_name, fixture);
      const fs = formatFinalScore(fixture);
      if (grade) {
        await applyGradeToSupabaseSimple(id, grade, fs);
        graded = { result: grade, finalScoreDisplay: fs };
      }
    }

    let line = isFinished ? `FT · ${h} - ${a}` : statusLineFromFixture(fixture);
    if (st === "NS") {
      line = `Kickoff in ${formatKickoffHuman(msUntilKickoff(pick.kickoff_at))}`;
    }

    return NextResponse.json({
      phase: isFinished ? "post" : isLive ? "live" : "pre",
      competition: pick.competition,
      homeName,
      awayName,
      homeLogo: fixture.teams.home.logo ?? null,
      awayLogo: fixture.teams.away.logo ?? null,
      homeScore: h,
      awayScore: a,
      statusLine: line,
      isLive,
      pollApi: isFinished ? false : true,
      ...(graded ?? {}),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: msg,
        phase: "pre",
        competition: pick.competition,
        homeName: homeLabel,
        awayName: awayLabel,
        statusLine: "Live score unavailable",
        isLive: false,
      },
      { status: 200 },
    );
  }
}
