import Link from "next/link";
import { EmailSignup } from "./EmailSignup";

const disclaimer = `MatchEdge provides sports research and analysis for informational and entertainment purposes only. Nothing published on this site constitutes financial, legal, or gambling advice. All picks and analysis reflect research-based opinions and do not guarantee outcomes. Sports betting involves risk — never bet more than you can afford to lose. MatchEdge is not a licensed sportsbook and does not accept wagers. We may earn affiliate commissions when you sign up with sportsbook partners through links on this site. Results and win rates shown reflect historical picks performance and are not a guarantee of future results. By accessing MatchEdge content or subscribing to Edge membership, you confirm you are of legal gambling age in your jurisdiction. If you or someone you know has a gambling problem, call 1-800-GAMBLER or visit ncpgambling.org.`;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-navy-900 px-4 py-12 text-[var(--muted)] dark:bg-navy-950">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 md:flex-row md:flex-wrap md:justify-between md:gap-x-8">
          <div>
            <p className="font-heading text-xl font-bold text-edge">MatchEdge FC</p>
            <p className="mt-2 max-w-xs text-sm">Data-forward matchday research for serious bettors.</p>
          </div>
          <EmailSignup variant="footer" />
          <nav className="flex flex-col gap-2 text-sm md:min-w-[140px]">
            <Link href="#picks" className="hover:text-edge">
              Picks
            </Link>
            <Link href="#pricing" className="hover:text-edge">
              Pricing
            </Link>
            <a
              href="https://x.com/MatchEdgeFC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-edge"
            >
              @MatchEdgeFC on X
            </a>
          </nav>
        </div>

        <div className="mt-10 rounded-lg border border-navy-700 bg-navy-950/50 p-4 text-xs leading-relaxed">
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
