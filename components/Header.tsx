import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight text-[var(--fg)]">
          MatchEdge<span className="text-edge">FC</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-[var(--muted)]">
          <Link href="#picks" className="hover:text-edge">
            Picks
          </Link>
          <Link href="#pricing" className="hover:text-edge">
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  );
}
