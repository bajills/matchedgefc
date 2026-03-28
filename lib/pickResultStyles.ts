import type { PickRow } from "./types";

export function pickResultBorderClass(pick: PickRow): string {
  const r = (pick.result || "pending").toLowerCase();
  if (r === "win") return "border-green-500 ring-2 ring-green-500/25";
  if (r === "loss") return "border-red-500 ring-2 ring-red-500/25";
  if (r === "push") return "border-yellow-500 ring-2 ring-yellow-400/30";
  return "";
}

export function confidenceStars(n: number | null | undefined): number {
  if (typeof n === "number" && n >= 1 && n <= 3) return n;
  return 2;
}
