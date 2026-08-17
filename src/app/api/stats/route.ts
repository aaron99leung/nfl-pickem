import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { computeStats, type GradedPick } from "@/lib/stats";
import { getGradedPicksForUser } from "@/lib/grading";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const gradedPicks = await getGradedPicksForUser(session.user.id);

  const stats = computeStats(gradedPicks);

  return NextResponse.json(stats, { status: 200 });
}
