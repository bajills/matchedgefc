"use client";

import { useState } from "react";

type Props = {
  variant?: "footer" | "inline";
};

export function EmailSignup({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("done");
      setMessage(data.message || "You're in — we'll notify you when picks drop.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  const isFooter = variant === "footer";

  return (
    <div className={isFooter ? "max-w-md" : ""}>
      <p
        className={`font-heading font-semibold text-[var(--fg)] ${isFooter ? "text-lg" : "text-base"}`}
      >
        Email alerts
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Get notified when new picks drop. No spam — unsubscribe anytime.
      </p>
      {status === "done" ? (
        <p className="mt-3 text-sm font-medium text-edge">{message}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor={`me-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`me-email-${variant}`}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-edge focus:outline-none focus:ring-1 focus:ring-edge/50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-edge px-4 py-2 font-heading text-sm font-bold uppercase tracking-wide text-navy-900 transition hover:bg-edge-dim disabled:opacity-60"
          >
            {status === "loading" ? "…" : "Notify me"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
