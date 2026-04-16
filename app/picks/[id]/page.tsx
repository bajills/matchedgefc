import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PickDetail } from "@/components/PickDetail";
import { getPickById, getPicks } from "@/lib/data";
import { loadPickDetailApiData } from "@/lib/pick-detail-data";
import { isPickUnlocked } from "@/lib/picks-access";

/** Pick detail must reflect DB updates immediately — no static/ISR cache. */
export const revalidate = 0;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pick = await getPickById(params.id);
  if (!pick) {
    return { title: "Pick not found — MatchEdge FC" };
  }
  return {
    title: `${pick.match_name} — MatchEdge FC`,
    description: `${pick.bet_type} · ${pick.odds_display} at ${pick.sportsbook}`,
  };
}

export default async function PickPage({ params }: Props) {
  const [pick, allPicks] = await Promise.all([getPickById(params.id), getPicks()]);
  if (!pick) {
    notFound();
  }

  const soccerPicks = allPicks.filter((p) => p.sport === "soccer");
  const locked = !isPickUnlocked(pick, soccerPicks);
  const detailApi = await loadPickDetailApiData(pick);

  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <PickDetail pick={pick} locked={locked} detailApi={detailApi} />
      </main>
      <Footer />
    </>
  );
}
