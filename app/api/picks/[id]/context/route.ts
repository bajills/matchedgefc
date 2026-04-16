import { NextResponse } from "next/server";
import {
  fetchPickDetailContext,
  type PickContextTab,
} from "@/lib/pick-detail-data";
import { getPickById } from "@/lib/data";

export const dynamic = "force-dynamic";

function parseTab(raw: string | null): PickContextTab | undefined {
  if (raw === "h2h" || raw === "team-news" || raw === "stats") {
    return raw;
  }
  return undefined;
}

/**
 * GET /api/picks/[id]/context
 * GET /api/picks/[id]/context?tab=h2h|team-news|stats
 * Server-only: uses API_FOOTBALL_KEY from the environment (never NEXT_PUBLIC_).
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  const pick = await getPickById(id);
  if (!pick) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const tab = parseTab(searchParams.get("tab"));

  const payload = await fetchPickDetailContext(pick, tab);

  return NextResponse.json(payload);
}
