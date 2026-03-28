import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PicksSection } from "@/components/PicksSection";
import { Pricing } from "@/components/Pricing";
import { RecordSection } from "@/components/RecordSection";
import { StatsBar } from "@/components/StatsBar";
import { getPicks, getSportRecords } from "@/lib/data";

/** Supabase picks/records must be fresh on every visit — no static/ISR cache. */
export const revalidate = 0;

export default async function HomePage() {
  const [picks, records] = await Promise.all([getPicks(), getSportRecords()]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <PicksSection picks={picks} />
        <RecordSection records={records} />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
