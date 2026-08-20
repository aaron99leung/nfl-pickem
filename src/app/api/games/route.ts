import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season");
  const week = searchParams.get("week");
  const team = searchParams.get("team");

  if (!season) {
    return NextResponse.json(
      { error: "season query param is required." },
      { status: 400 }
    );
  }

  const games = await prisma.game.findMany({
    where: {
      season: Number(season),
      ...(week ? { week: Number(week) } : {}),
      ...(team ? { OR: [{ homeTeam: { abbreviation: team } }, { awayTeam: { abbreviation: team } }, 
      ],
     }
    : {}),
    },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { kickoffAt: "asc" },
  });

  return NextResponse.json(games, { status: 200 });
}
