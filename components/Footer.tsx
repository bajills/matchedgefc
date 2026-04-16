import Link from "next/link";
import { EmailSignup } from "./EmailSignup";

const disclaimer = `MatchEdge provides sports research and analysis for informational and entertainment purposes only. Nothing published on this site constitutes financial, legal, or gambling advice. All picks and analysis reflect research-based opinions and do not guarantee outcomes. Sports betting involves risk — never bet more than you can afford to lose. MatchEdge is not a licensed sportsbook and does not accept wagers. We may earn affiliate commissions when you sign up with sportsbook partners through links on this site. Results and win rates shown reflect historical picks performance and are not a guarantee of future results. By accessing MatchEdge content or subscribing to Edge membership, you confirm you are of legal gambling age in your jurisdiction. If you or someone you know has a gambling problem, call 1-800-GAMBLER or visit ncpgambling.org.`;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-navy-900 px-4 py-12 text-[var(--muted)] dark:bg-navy-950 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-3 lg:items-start lg:gap-8">
          <div className="text-center lg:text-left">
            <p className="font-heading text-xl font-bold text-edge">MatchEdge FC</p>
            <p className="mt-2 max-w-xs text-sm lg:mx-0">
              Data-forward matchday research for serious bettors.
            </p>
          </div>
          <nav className="flex flex-col items-center gap-3 text-sm lg:justify-self-center">
            <Link href="/#picks" className="transition hover:text-edge">
              Picks
            </Link>
            <Link href="/#pricing" className="transition hover:text-edge">
              Pricing
            </Link>
          </nav>
          <div className="flex flex-col items-center gap-3 lg:items-end">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Social</p>
            <a
              href="https://x.com/MatchEdgeFC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition hover:text-edge"
            >
              @MatchEdgeFC on X
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-xl lg:mt-12">
          <EmailSignup variant="footer" />
        </div>

        <div className="mt-10 w-full rounded-lg border border-navy-700 bg-navy-950/50 p-4 text-xs leading-relaxed lg:mt-12">
          <p className="font-semibold text-[var(--fg)]">Disclaimer</p>
          <p className="mt-2 text-[var(--muted)]">{disclaimer}</p>
        </div>

        <p className="mt-8 text-center text-xs text-navy-400">© 2026 MatchEdge LLC. All rights reserved.</p>

        <p className="mt-6 text-center text-[10px] leading-snug text-navy-500">
          If you or someone you know has a gambling problem, call{" "}
          <a href="tel:18004262537" className="text-navy-300 underline hover:text-edge">
            1-800-GAMBLER
          </a>{" "}
          or visit{" "}
          <a
            href="https://www.ncpgambling.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-300 underline hover:text-edge"
          >
            ncpgambling.org
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
