"use client";

import type { PickRow } from "@/lib/types";
import { compareOddsMovement } from "@/lib/americanOdds";

type Props = {
  pick: PickRow;
  className?: string;
  size?: "default" | "large";
};

export function OddsWithMovement({ pick, className = "", size = "default" }: Props) {
  const opening = (pick.opening_odds || pick.odds_display || "").trim();
  const current = (pick.odds_display || "").trim();
  const dir = compareOddsMovement(opening, current);
  const textCls = size === "large" ? "text-2xl md:text-3xl" : "text-xl";
  const tooltip = `Opened at ${opening}, now ${current}`;

  return (
    <span
      className={`inline-flex items-center gap-1 font-heading font-bold text-edge ${textCls} ${className}`}
      title={dir === "up" || dir === "down" ? tooltip : undefined}
    >
      <span>{current}</span>
      {dir === "up" && (
        <span className="select-none text-lg leading-none text-edge md:text-xl" aria-hidden>
          ↑
        </span>
      )}
      {dir === "down" && (
        <span className="select-none text-lg leading-none text-red-500 md:text-xl" aria-hidden>
          ↓
        </span>
      )}
    </span>
  );
}
