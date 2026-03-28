import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SuccessPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <h1 className="font-heading text-3xl font-bold text-[var(--fg)]">You&apos;re in.</h1>
      <p className="mt-4 max-w-md text-center text-[var(--muted)]">
        Thanks for subscribing to Edge. Check your email for a receipt. Full picks unlock on your account
        as soon as webhooks are connected (see README).
      </p>
      <Link
        href="/#picks"
        className="mt-8 rounded border border-edge bg-edge px-6 py-3 font-heading text-sm font-semibold text-navy-900"
      >
        Back to picks
      </Link>
      </div>
      <Footer />
    </>
  );
}
