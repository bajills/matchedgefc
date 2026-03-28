"use client";

import { useState } from "react";

export function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pricing" className="scroll-mt-20 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-3xl font-bold text-[var(--fg)] md:text-4xl">Pricing</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Start free. Upgrade when you want the full edge.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h3 className="font-heading text-xl font-bold text-[var(--fg)]">Free</h3>
            <p className="mt-2 font-heading text-4xl font-bold text-[var(--fg)]">
              $0<span className="text-lg font-normal text-[var(--muted)]">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              <li>✓ 2 picks daily</li>
              <li>✓ Basic W–L record</li>
              <li>✓ Soccer slate</li>
            </ul>
            <a
              href="#picks"
              className="mt-8 inline-flex w-full items-center justify-center rounded border border-[var(--border)] py-3 font-heading text-sm font-semibold uppercase tracking-wide text-[var(--fg)] hover:border-edge"
            >
              Start Free
            </a>
          </div>

          <div className="rounded-xl border-2 border-edge bg-navy-900/50 p-8 dark:bg-navy-900/80">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-edge">Edge</h3>
              <span className="rounded bg-edge/20 px-2 py-0.5 text-xs font-semibold text-edge">Popular</span>
            </div>
            <p className="mt-2 font-heading text-4xl font-bold text-[var(--fg)]">
              $15<span className="text-lg font-normal text-[var(--muted)]">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
              <li>✓ All picks + full reasoning</li>
              <li>✓ Every league we cover</li>
              <li>✓ Line alerts</li>
              <li>✓ Early access to NBA, NFL, MLB</li>
            </ul>
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center rounded border border-edge bg-edge py-3 font-heading text-sm font-semibold uppercase tracking-wide text-navy-900 shadow-edge hover:bg-edge-dim disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Subscribe with Stripe"}
            </button>
            {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
            <p className="mt-4 text-center text-[10px] text-[var(--muted)]">
              Secure checkout via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
