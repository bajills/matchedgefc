"use client";

import type { PickRow } from "@/lib/types";

/** First sentence or line; optional max length with ellipsis. */
export function firstSentence(text: string | null | undefined, maxLen?: number): string {
  if (!text?.trim()) return "";
  const t = text.trim();
  const enders = /[.!?](?:\s|$)/;
  let cut = t;
  const idx = t.search(enders);
  if (idx >= 0) {
    cut = t.slice(0, idx + 1).trim();
  } else {
    cut = t.split("\n")[0]?.trim() ?? t;
  }
  if (maxLen && cut.length > maxLen) {
    return cut.slice(0, maxLen - 3).trim() + "...";
  }
  return cut;
}

type Props = {
  pick: PickRow;
  locked: boolean;
  prominent?: boolean;
};

export function PickTeaser({ pick, locked, prominent }: Props) {
  const teaser = firstSentence(pick.reasoning, locked ? 100 : undefined);
  if (!teaser) return null;

  if (locked) {
    return (
      <div className="relative flex items-start gap-2 rounded-lg border border-navy-600/40 bg-navy-900/20 px-3 py-2 dark:bg-navy-950/40">
        <span className="mt-0.5 shrink-0 text-sm" aria-hidden>
          🔒
        </span>
        <p
          className={`flex-1 text-[var(--muted)] blur-[2.5px] ${
            prominent ? "text-sm" : "text-xs"
          }`}
        >
          {teaser}
        </p>
      </div>
    );
  }

  return (
    <p className={`text-[var(--muted)] ${prominent ? "text-sm leading-relaxed" : "text-xs leading-relaxed"}`}>
      {teaser}
    </p>
  );
}
