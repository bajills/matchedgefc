import { parseAmericanOdds } from "./americanOdds";

/** Implied probability from American odds (includes vig for single side). */
export function americanToImpliedPercent(american: string): number | null {
  const n = parseAmericanOdds(american);
  if (n === null || n === 0) {
    return null;
  }
  if (n > 0) {
    return 100 / (n + 100);
  }
  const a = Math.abs(n);
  return a / (a + 100);
}

/** Remove vig from two implied probabilities (binary market). */
export function devigTwoWay(p1: number, p2: number): { fair1: number; fair2: number } | null {
  const s = p1 + p2;
  if (s <= 0) {
    return null;
  }
  return { fair1: (p1 / s) * 100, fair2: (p2 / s) * 100 };
}

/** Remove vig from three implied probabilities (1X2). */
export function devigThreeWay(p1: number, p2: number, p3: number): {
  fair1: number;
  fair2: number;
  fair3: number;
} | null {
  const s = p1 + p2 + p3;
  if (s <= 0) {
    return null;
  }
  return {
    fair1: (p1 / s) * 100,
    fair2: (p2 / s) * 100,
    fair3: (p3 / s) * 100,
  };
}
