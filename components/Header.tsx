import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-700/50 bg-navy-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 lg:grid lg:grid-cols-3 lg:items-center">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-white">
          MatchEdge<span className="text-edge">FC</span>
        </Link>
        <nav className="hidden justify-center gap-10 text-sm font-medium text-[var(--muted)] lg:flex">
          <Link href="/#picks" className="transition hover:text-white">
            Picks
          </Link>
          <Link href="/#pricing" className="transition hover:text-white">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-4">
          <nav className="flex gap-6 text-sm font-medium text-[var(--muted)] lg:hidden">
            <Link href="/#picks" className="transition hover:text-white">
              Picks
            </Link>
            <Link href="/#pricing" className="transition hover:text-white">
              Pricing
            </Link>
          </nav>
          <Link
            href="/#pricing"
            className="hidden rounded-full bg-edge px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg transition hover:bg-[#00e6b8] lg:inline-flex"
          >
            Get Edge Access
          </Link>
        </div>
      </div>
    </header>
  );
}
