import { NextRequest, NextResponse } from "next/server";
import { syncRecentWeeks } from "@/lib/syncGames";

export const dynamic = "force-dynamic";

const SEASON = 2026;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncRecentWeeks(SEASON);
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("Cron sync failed:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
