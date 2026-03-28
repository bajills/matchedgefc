"use client";

import { useEffect, useState } from "react";

/**
 * Format an ISO instant for display in the browser's local timezone.
 * Example: "Wed, Apr 1 · 3:00 PM PST"
 */
export function formatKickoffLocal(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) {
    return iso;
  }
  const d = new Date(t);

  const datePart = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);

  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(d);

  return `${datePart} · ${timePart}`;
}

type Props = {
  iso: string;
  className?: string;
};

/**
 * Renders kickoff in the visitor's local timezone (client-only) to avoid SSR timezone mismatch.
 */
export function KickoffLocal({ iso, className }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatKickoffLocal(iso));
  }, [iso]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label ?? "\u00a0"}
    </time>
  );
}
