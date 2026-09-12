import { prisma } from "@/lib/prisma";
import { toGradedPicks, type GradedPick, type PickStatus } from "@/lib/stats";

export type GameResult = {
  gameId: string;
  week: number;
  season: number;
  kickoffAt: Date;
  status: PickStatus;
  homeTeamAbbreviation: string;
  awayTeamAbbreviation: string;
};

export async function getGameResultsForUser(userId: string): Promise<GameResult[]> {
  const games = await prisma.game.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      predictions: { where: { userId } },
    },
    orderBy: { kickoffAt: "asc" },
  });

  const now = new Date();

  return games.map((game) => {
    const prediction = game.predictions[0];
    const isTie = game.status === "FINAL" && game.homeScore === game.awayScore;

    let status: PickStatus;
    if (game.status === "CANCELLED" || isTie) {
      status = "cancelled";
    } else if (!prediction) {
      status = game.kickoffAt <= now ? "missed" : "unpicked";
    } else if (game.status === "SCHEDULED") {
      status = "scheduled";
    } else {
      const winnerTeamId =
        game.homeScore! > game.awayScore! ? game.homeTeamId : game.awayTeamId;
      status = prediction.pickedTeamId === winnerTeamId ? "correct" : "incorrect";
    }

    return {
      gameId: game.id,
      week: game.week,
      season: game.season,
      kickoffAt: game.kickoffAt,
      status,
      homeTeamAbbreviation: game.homeTeam.abbreviation,
      awayTeamAbbreviation: game.awayTeam.abbreviation,
    };
  });
}

export async function getGradedPicksForUser(userId: string): Promise<GradedPick[]> {
  const results = await getGameResultsForUser(userId);
  return toGradedPicks(results);
}
