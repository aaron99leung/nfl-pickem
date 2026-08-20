import { prisma } from "@/lib/prisma";
import type { GradedPick } from "@/lib/stats";

export type GameResult = {
  gameId: string;
  week: number;
  season: number;
  kickoffAt: Date;
  status: "correct" | "incorrect" | "scheduled" | "cancelled";
  homeTeamAbbreviation: string;
  awayTeamAbbreviation: string;
};

export async function getGameResultsForUser(userId: string): Promise<GameResult[]> {
  const predictions = await prisma.prediction.findMany({
    where: { userId },
    include: {
      game: { include: { homeTeam: true, awayTeam: true } },
    },
    orderBy: { game: { kickoffAt: "asc" } },
  });

  return predictions
    .filter((p) => p.game.status !== "FINAL" || p.game.homeScore !== p.game.awayScore)
    .map((p) => {
      let status: GameResult["status"];
      if (p.game.status === "CANCELLED") {
        status = "cancelled";
      } else if (p.game.status === "SCHEDULED") {
        status = "scheduled";
      } else {
        const winnerTeamId =
          p.game.homeScore! > p.game.awayScore! ? p.game.homeTeamId : p.game.awayTeamId;
        status = p.pickedTeamId === winnerTeamId ? "correct" : "incorrect";
      }

      return {
        gameId: p.gameId,
        week: p.game.week,
        season: p.game.season,
        kickoffAt: p.game.kickoffAt,
        status,
        homeTeamAbbreviation: p.game.homeTeam.abbreviation,
        awayTeamAbbreviation: p.game.awayTeam.abbreviation,
      };
    });
}

export async function getGradedPicksForUser(userId: string): Promise<GradedPick[]> {
  const results = await getGameResultsForUser(userId);
  return results
    .filter((r) => r.status === "correct" || r.status === "incorrect")
    .map((r) => ({ correct: r.status === "correct" }));
}
