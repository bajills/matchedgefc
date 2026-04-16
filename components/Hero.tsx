export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-700/40 bg-gradient-to-b from-navy-900/40 to-transparent px-4 py-16 md:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,184,0.12),transparent)]" />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-edge md:text-sm">
          Soccer picks · Data-backed
        </p>
        <h1 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-[64px] lg:leading-[1.1]">
          Edge on every match.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base text-[var(--muted)] md:text-lg lg:text-xl">
          Free picks every matchday. Full reasoning + grades when you join Edge.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#picks"
            className="inline-flex w-full items-center justify-center rounded-full bg-edge px-8 py-3 text-sm font-semibold text-navy-900 shadow-lg transition hover:bg-[#00e6b8] sm:w-auto"
          >
            View today&apos;s picks
          </a>
          <a
            href="#pricing"
            className="inline-flex w-full items-center justify-center rounded-full border border-navy-600 px-8 py-3 text-sm font-medium text-white transition hover:border-edge hover:text-edge sm:w-auto"
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}
