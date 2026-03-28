import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PickNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-[var(--fg)]">Pick not found</h1>
        <p className="mt-2 text-[var(--muted)]">This pick may have been removed or the link is invalid.</p>
        <Link
          href="/#picks"
          className="mt-8 inline-flex items-center gap-2 font-medium text-edge underline-offset-4 hover:underline"
        >
          ← Back to Picks
        </Link>
      </main>
      <Footer />
    </>
  );
}
