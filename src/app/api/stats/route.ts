import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeStats, type GradedPick } from "@/lib/stats";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const predictions = await prisma.prediction.findMany({
    where: {
      userId: session.user.id,
      game: { status: "FINAL" },
    },
    include: { game: true },
    orderBy: { game: { kickoffAt: "asc" } },
  });

  const gradedPicks: GradedPick[] = predictions
    .filter((p) => p.game.homeScore !== p.game.awayScore)
    .map((p) => {
      const winnerTeamId =
        p.game.homeScore! > p.game.awayScore! ? p.game.homeTeamId : p.game.awayTeamId;
      return { correct: p.pickedTeamId === winnerTeamId };
    });

  const stats = computeStats(gradedPicks);

  return NextResponse.json(stats, { status: 200 });
}
