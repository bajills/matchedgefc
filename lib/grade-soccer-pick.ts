import type { ApiFixture } from "./api-football/fixture-match";

export type Grade = "win" | "loss" | "push" | null;

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b(fc|cf|afc|sc|ac)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if `fragment` refers to `teamName` (substring / token overlap). */
function refersToTeam(fragment: string, teamName: string): boolean {
  const f = norm(fragment);
  const t = norm(teamName);
  if (!f.length || !t.length) {
    return false;
  }
  if (f === t || t.includes(f) || f.includes(t)) {
    return true;
  }
  const fw = f.split(" ").filter((w) => w.length > 2);
  return fw.some((w) => t.includes(w));
}

function matchOutcome(f: ApiFixture): "home" | "away" | "draw" | null {
  const h = f.goals.home;
  const a = f.goals.away;
  if (h == null || a == null) {
    return null;
  }
  if (h > a) {
    return "home";
  }
  if (a > h) {
    return "away";
  }
  return "draw";
}

/**
 * Heuristic grading from bet_type text. Returns null if we cannot determine reliably.
 */
export function gradeSoccerPick(betType: string, matchName: string, f: ApiFixture): Grade {
  const bt = (betType || "").trim();
  const lower = bt.toLowerCase();
  const outcome = matchOutcome(f);
  if (!outcome) {
    return null;
  }

  const homeName = f.teams.home.name;
  const awayName = f.teams.away.name;

  // Totals — Over / Under X.5
  const ou = lower.match(/\b(under|over)\s+([\d.]+)\b/);
  if (ou) {
    const dir = ou[1];
    const line = parseFloat(ou[2]);
    if (!Number.isFinite(line)) {
      return null;
    }
    const h = f.goals.home ?? 0;
    const a = f.goals.away ?? 0;
    const total = h + a;
    const isOver = total > line;
    if (total === line) {
      return "push";
    }
    if (dir === "over") {
      return isOver ? "win" : "loss";
    }
    return isOver ? "loss" : "win";
  }

  // Draw bet
  if (/\b(draw|tie)\b/i.test(bt) && !/\b(dnb|draw no bet)\b/i.test(bt)) {
    return outcome === "draw" ? "win" : "loss";
  }

  // Both teams to score
  if (/\bbtts\b|both teams to score/i.test(bt)) {
    const h = f.goals.home ?? 0;
    const a = f.goals.away ?? 0;
    const btts = h > 0 && a > 0;
    if (/\bno\b/i.test(lower) || /btts\s*no/i.test(lower)) {
      return btts ? "loss" : "win";
    }
    return btts ? "win" : "loss";
  }

  // Single-team win / ML: detect which side is backed
  const candidates: { label: string; side: "home" | "away" }[] = [
    { label: homeName, side: "home" },
    { label: awayName, side: "away" },
  ];

  let backed: "home" | "away" | null = null;
  for (const { label, side } of candidates) {
    if (refersToTeam(label, bt)) {
      backed = side;
      break;
    }
  }

  if (!backed) {
    const m = bt.match(/^(.+?)\s+(?:to win|ml|moneyline)\b/i);
    if (m) {
      const frag = m[1].trim();
      if (refersToTeam(frag, homeName)) {
        backed = "home";
      } else if (refersToTeam(frag, awayName)) {
        backed = "away";
      }
    }
  }

  if (!backed) {
    // Last resort: unique team name in bet
    if (refersToTeam(homeName, bt) && !refersToTeam(awayName, bt)) {
      backed = "home";
    } else if (refersToTeam(awayName, bt) && !refersToTeam(homeName, bt)) {
      backed = "away";
    }
  }

  if (!backed) {
    return null;
  }

  if (outcome === "draw") {
    return "loss";
  }
  return outcome === backed ? "win" : "loss";
}

export function formatFinalScore(f: ApiFixture): string {
  const h = f.goals.home ?? 0;
  const a = f.goals.away ?? 0;
  return `${h}-${a}`;
}
