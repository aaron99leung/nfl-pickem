// Pulled out of the /api/stats route so it can be reused by the
// leaderboard too - "compute a user's graded picks" logic

import { prisma } from "@/lib/prisma";
import type { GradedPick } from "@/lib/stats";

export async function getGradedPicksForUser(userId: string): Promise<GradedPick[]> {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
      game: { status: "FINAL" },
    },
    include: { game: true },
    orderBy: { game: { kickoffAt: "asc" } },
  });

  // Ties excluded — same treatment as a cancelled game, no winner to
  // have picked correctly.
  return predictions
    .filter((p) => p.game.homeScore !== p.game.awayScore)
    .map((p) => {
      const winnerTeamId =
        p.game.homeScore! > p.game.awayScore! ? p.game.homeTeamId : p.game.awayTeamId;
      return { correct: p.pickedTeamId === winnerTeamId };
    });
}
