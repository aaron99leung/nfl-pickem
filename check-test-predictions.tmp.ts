import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  const testEmails = ["test@example.com", "test2@example.com", "pickui-test-1787249375671@example.com"];
  const preds = await prisma.prediction.findMany({
    where: { user: { email: { in: testEmails } } },
    include: { user: true, game: { include: { homeTeam: true, awayTeam: true } } },
  });
  for (const p of preds) {
    console.log(JSON.stringify({
      user: p.user.email,
      gameId: p.gameId,
      status: p.game.status,
      homeScore: p.game.homeScore,
      awayScore: p.game.awayScore,
      home: p.game.homeTeam.abbreviation,
      away: p.game.awayTeam.abbreviation,
      week: p.game.week,
      kickoffAt: p.game.kickoffAt.toISOString(),
    }));
  }

  // Also check for any FINAL games overall that might be leftover test artifacts
  const finalGames = await prisma.game.findMany({
    where: { status: "FINAL" },
    include: { homeTeam: true, awayTeam: true },
  });
  console.log("FINAL games count:", finalGames.length);
  for (const g of finalGames) {
    console.log(JSON.stringify({
      id: g.id,
      week: g.week,
      home: g.homeTeam.abbreviation,
      away: g.awayTeam.abbreviation,
      homeScore: g.homeScore,
      awayScore: g.awayScore,
      kickoffAt: g.kickoffAt.toISOString(),
    }));
  }
}

main().finally(() => prisma.$disconnect());
