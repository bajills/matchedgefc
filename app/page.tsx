import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PicksSection } from "@/components/PicksSection";
import { Pricing } from "@/components/Pricing";
import { StatsBar } from "@/components/StatsBar";
import { getPicks } from "@/lib/data";

const records = [
  { label: "All-time", value: "58.2%" },
  { label: "Last 30d", value: "61.0%" },
  { label: "Edge picks", value: "62.4%" },
  { label: "Free picks", value: "54.1%" },
];

export default async function HomePage() {
  const picks = await getPicks();
  const soccerPicks = picks.filter((p) => p.sport === "soccer");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <PicksSection picks={soccerPicks} records={records} />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
