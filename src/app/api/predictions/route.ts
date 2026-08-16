import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // 1. Who's asking? Better Auth reads the session cookie off the incoming request.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json();
  const { gameId, pickedTeamId } = body;

  if (!gameId || !pickedTeamId) {
    return NextResponse.json(
      { error: "gameId and pickedTeamId are required." },
      { status: 400 }
    );
  }

  // 2. Does the game exist?
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) {
    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  }

  // 3. Has kickoff already passed? The locking rule from the schema design.
  if (new Date() >= game.kickoffAt) {
    return NextResponse.json(
      { error: "This game has already kicked off — picks are locked." },
      { status: 403 }
    );
  }

  // 4. Is the picked team actually playing in this game?
  if (pickedTeamId !== game.homeTeamId && pickedTeamId !== game.awayTeamId) {
    return NextResponse.json(
      { error: "pickedTeamId must be one of the two teams playing in this game." },
      { status: 400 }
    );
  }

  // 5. Upsert — one prediction per user per game. Changing your mind before
  // kickoff updates the existing row instead of creating a duplicate.
  const prediction = await prisma.prediction.upsert({
    where: {
      userId_gameId: {
        userId: session.user.id,
        gameId,
      },
    },
    update: { pickedTeamId },
    create: {
      userId: session.user.id,
      gameId,
      pickedTeamId,
    },
  });

  return NextResponse.json(prediction, { status: 200 });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
 
  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season");
  const week = searchParams.get("week");
 
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: session.user.id,
      // Only add the game filter if both params were actually provided —
      // otherwise this returns the user's full prediction history.
      ...(season && week
        ? {
            game: {
              season: Number(season),
              week: Number(week),
            },
          }
        : {}),
    },
    // Pull the related Game and Team rows in the same query, rather than
    // making the frontend fire off a second request just to know who
    // played and what the final score was.
    include: {
      game: true,
      pickedTeam: true,
    },
    orderBy: {
      game: {
        kickoffAt: "asc",
      },
    },
  });
  
  return NextResponse.json(predictions, { status: 200 });
}