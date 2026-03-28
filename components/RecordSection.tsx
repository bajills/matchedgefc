import type { SportRecordRow } from "@/lib/types";

function pct(w: number, l: number) {
  const t = w + l;
  if (t === 0) return 0;
  return Math.round((w / t) * 1000) / 10;
}

type Props = { records: SportRecordRow[] };

export function RecordSection({ records }: Props) {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-3xl font-bold text-[var(--fg)] md:text-4xl">W–L Record</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Tracked picks — updated from our database.</p>
        <div className="mt-10 space-y-6">
          {records.map((r) => {
            const p = pct(r.wins, r.losses);
            return (
              <div key={r.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-heading font-semibold text-[var(--fg)]">{r.label}</span>
                  <span className="text-[var(--muted)]">
                    {r.wins}W – {r.losses}L · {p}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-navy-800">
                  <div
                    className="h-full rounded-full bg-edge transition-all"
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
