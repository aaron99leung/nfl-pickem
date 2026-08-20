import { prisma } from "@/lib/prisma";
import { fetchWeekGames } from "@/lib/espn";

export async function syncWeek(season: number, week: number): Promise<number> {
  const games = await fetchWeekGames(season, week);

  for (const game of games) {
    const homeTeam = await prisma.team.findUniqueOrThrow({
      where: { abbreviation: game.homeAbbreviation },
    });
    const awayTeam = await prisma.team.findUniqueOrThrow({
      where: { abbreviation: game.awayAbbreviation },
    });

    await prisma.game.upsert({
      where: { externalId: game.externalId },
      update: {
        kickoffAt: game.kickoffAt,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        status: game.status,
      },
      create: {
        externalId: game.externalId,
        season: game.season,
        week: game.week,
        kickoffAt: game.kickoffAt,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        status: game.status,
      },
    });
  }

  return games.length;
}

export async function syncSeason(season: number, totalWeeks = 18): Promise<number> {
  let totalSynced = 0;
  for (let week = 1; week <= totalWeeks; week++) {
    totalSynced += await syncWeek(season, week);
  }
  return totalSynced;
}

export async function syncRecentWeeks(season: number): Promise<{
  totalSynced: number;
  weeksSynced: number[];
}> {
  const mostRecentStartedGame = await prisma.game.findFirst({
    where: { season, kickoffAt: { lte: new Date() } },
    orderBy: { kickoffAt: "desc" },
  });

  const currentWeek = mostRecentStartedGame?.week ?? 1;
  const weeksToSync = [Math.max(1, currentWeek - 1), currentWeek];
  const uniqueWeeks = [...new Set(weeksToSync)];

  let totalSynced = 0;
  for (const week of uniqueWeeks) {
    totalSynced += await syncWeek(season, week);
  }

  return { totalSynced, weeksSynced: uniqueWeeks };
}
