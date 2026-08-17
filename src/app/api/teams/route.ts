//for the teams schedule grid
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function GET() {
  const teams = await prisma.team.findMany({
    orderBy: [{ conference: "asc" }, { division: "asc" }, { name: "asc" }],
  });
 
  return NextResponse.json(teams, { status: 200 });
}