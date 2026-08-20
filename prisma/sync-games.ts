import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { fetchWeekGames } from "../src/lib/espn";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEASON = 2026;
const REGULAR_SEASON_WEEKS = 18;

async function main() {
  let totalSynced = 0;

  for (let week = 1; week <= REGULAR_SEASON_WEEKS; week++) {
    const games = await fetchWeekGames(SEASON, week);

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

    console.log(`Week ${week}: synced ${games.length} games.`);
    totalSynced += games.length;
  }

  console.log(`Done. Synced ${totalSynced} games across ${REGULAR_SEASON_WEEKS} weeks for season ${SEASON}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
