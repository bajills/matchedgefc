const items = [
  { label: "Win Rate", value: process.env.NEXT_PUBLIC_STAT_WIN_RATE ?? "0-0" },
  { label: "Picks Published", value: process.env.NEXT_PUBLIC_STAT_PICKS ?? "0" },
  { label: "Leagues Covered", value: process.env.NEXT_PUBLIC_STAT_LEAGUES ?? "10+" },
  { label: "Free To Start", value: process.env.NEXT_PUBLIC_STAT_FREE ?? "Yes" },
];

export function StatsBar() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="font-heading text-2xl font-bold text-edge md:text-3xl">{item.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
