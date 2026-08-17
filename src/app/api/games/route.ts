// Returns the full schedule for a given week — separate from
// /api/predictions, which only returns picks that already exist.

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

  // Only filter by week or teamif one was actually provided — otherwise
  // this returns every game in the season, for a full-season view.
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
