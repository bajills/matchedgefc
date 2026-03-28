"use client";

import { useEffect, useState } from "react";

type Props = {
  kickoffIso: string;
  result: string | null | undefined;
  className?: string;
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 48) {
    const d = Math.floor(h / 24);
    return `Kickoff in ${d}d ${h % 24}h`;
  }
  if (h > 0) return `Kickoff in ${h}h ${m}m`;
  return `Kickoff in ${m}m`;
}

export function KickoffCountdown({ kickoffIso, result, className = "" }: Props) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const r = (result || "pending").toLowerCase();
    if (r === "win" || r === "loss" || r === "push") {
      setLabel("Final");
      return;
    }

    const kick = Date.parse(kickoffIso);
    if (!Number.isFinite(kick)) {
      setLabel("");
      return;
    }

    const tick = () => {
      const now = Date.now();
      const r2 = (result || "pending").toLowerCase();
      if (r2 === "win" || r2 === "loss" || r2 === "push") {
        setLabel("Final");
        return;
      }
      if (now >= kick) {
        setLabel("Live now");
        return;
      }
      setLabel(formatCountdown(kick - now));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [kickoffIso, result]);

  if (!label) return null;

  return (
    <p
      className={`text-xs font-medium tabular-nums text-[var(--muted)] ${className}`}
      suppressHydrationWarning
    >
      {label}
    </p>
  );
}
