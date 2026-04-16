type Stat = { label: string; value: string };

const stats: Stat[] = [
  { label: "Sportsbook odds", value: "Real-time" },
  { label: "Model", value: "Elo + Poisson" },
  { label: "Leagues", value: "Top 5 + Europe" },
  { label: "Updates", value: "Matchday" },
];

export function StatsBar() {
  return (
    <section className="border-b border-navy-700/40 bg-navy-950/30">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-14">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10 lg:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-lg font-semibold text-white md:text-xl">{s.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
