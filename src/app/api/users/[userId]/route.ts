// Within[userId] matches exactly one URL segment
// (e.g. /api/users/abc123), capturing "abc123" as params.userId.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeStats } from "@/lib/stats";
import { getGradedPicksForUser } from "@/lib/grading";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // Deliberately using `select` rather than fetching the whole User row —
  // this is a public endpoint, so we don't want to expose sensitive fields
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      favouriteTeam: true,
      favouritePlayer: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Calling the user's stats
  const gradedPicks = await getGradedPicksForUser(user.id);
  const stats = computeStats(gradedPicks);

  return NextResponse.json({ ...user, ...stats }, { status: 200 });
}
