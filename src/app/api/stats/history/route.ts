import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getGameResultsForUser } from "@/lib/grading";
import { findLongestStreakRange } from "@/lib/stats";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const games = await getGameResultsForUser(session.user.id);

  const gradedIndices: number[] = [];
  const gradedPicks = games.reduce<{ correct: boolean }[]>((acc, game, i) => {
    if (game.status === "correct" || game.status === "incorrect") {
      gradedIndices.push(i);
      acc.push({ correct: game.status === "correct" });
    }
    return acc;
  }, []);

  const rangeInGraded = findLongestStreakRange(gradedPicks);
  const longestStreakRange = rangeInGraded
    ? { startIndex: gradedIndices[rangeInGraded.startIndex], endIndex: gradedIndices[rangeInGraded.endIndex] }
    : null;

  return NextResponse.json({ games, longestStreakRange }, { status: 200 });
}
