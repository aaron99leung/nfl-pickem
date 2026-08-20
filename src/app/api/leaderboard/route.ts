import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeStats } from "@/lib/stats";
import { getGradedPicksForUser } from "@/lib/grading";

const VALID_SORT_FIELDS = ["currentStreak", "longestStreak", "accuracy"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

// GET /api/leaderboard?sortBy=currentStreak (default) | longestStreak | accuracy
// Deliberately no auth check here — this is intentionally public data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortByParam = searchParams.get("sortBy") ?? "currentStreak";

  if (!VALID_SORT_FIELDS.includes(sortByParam as SortField)) {
    return NextResponse.json(
      { error: `sortBy must be one of: ${VALID_SORT_FIELDS.join(", ")}` },
      { status: 400 }
    );
  }
  const sortBy = sortByParam as SortField;

  // Deliberately using `select` rather than fetching the whole User row —
  // this is a public endpoint, so we don't want to expose sensitive fields
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  // Reusing the exact same computeStats function, calling once per user
  const leaderboard = await Promise.all(
    users.map(async (user) => {
      const gradedPicks = await getGradedPicksForUser(user.id);
      const stats = computeStats(gradedPicks);
      return {
        userId: user.id,
        name: user.name,
        ...stats,
      };
    })
  );

  leaderboard.sort((a, b) => b[sortBy] - a[sortBy]);

  return NextResponse.json(leaderboard, { status: 200 });
}
