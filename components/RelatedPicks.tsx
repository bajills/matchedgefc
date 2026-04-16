import Link from "next/link";
import type { PickRow } from "@/lib/types";

type Props = {
  picks: PickRow[];
  currentId: string;
};

export function RelatedPicks({ picks, currentId }: Props) {
  const items = picks.filter((p) => p.id !== currentId).slice(0, 5);
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        More picks
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/picks/${p.id}`}
              className="block rounded-lg border border-transparent px-2 py-2 text-sm transition hover:border-edge/30 hover:bg-navy-900/40"
            >
              <span className="line-clamp-2 font-medium text-[var(--fg)]">{p.match_name}</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">
                {p.bet_type} · {p.odds_display}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
