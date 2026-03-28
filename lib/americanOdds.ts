/** Parse American odds string to a signed number (+105 → 105, -110 → -110). */
export function parseAmericanOdds(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "");
  if (!t) return null;
  const m = t.match(/^([+-]?)(\d+)$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const n = parseInt(m[2], 10);
  if (!Number.isFinite(n)) return null;
  return sign * n;
}

/** Line moved in bettor's favor (higher number is better for both + and − American odds). */
export function compareOddsMovement(
  opening: string,
  current: string,
): "up" | "down" | "same" | "unknown" {
  const o = parseAmericanOdds(opening);
  const c = parseAmericanOdds(current);
  if (o === null || c === null) return "unknown";
  if (o !== 0 && c !== 0 && Math.sign(o) !== Math.sign(c)) return "unknown";
  if (c === o) return "same";
  return c > o ? "up" : "down";
}
