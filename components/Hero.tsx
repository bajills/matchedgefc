import Link from "next/link";

export function Hero() {
  return (
    <section className="relative border-b border-navy-700 bg-navy-900 px-4 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-edge">
          ⚽ LIVE MATCHDAY RESEARCH
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">The Research.</span>
          <span className="block">Done For You.</span>
          <span className="block text-edge">That&apos;s MatchEdge.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-slate-300 sm:text-lg">
          Best bets and prop picks across every major soccer league — every matchday, one place.
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-sm text-slate-400">
          Premier League · La Liga · Bundesliga · Serie A · Ligue 1 · UCL · UEL · Euros · Copa America ·
          World Cup
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#picks"
            className="inline-flex min-h-[44px] items-center justify-center rounded border border-edge bg-edge px-8 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-navy-900 shadow-edge transition hover:bg-edge-dim"
          >
            Start Free
          </Link>
          <a
            href="#picks"
            className="inline-flex min-h-[44px] items-center justify-center rounded border border-white/20 bg-white/5 px-8 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-edge hover:text-edge"
          >
            Today&apos;s Picks ↓
          </a>
        </div>
      </div>
    </section>
  );
}
