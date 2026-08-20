import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    include: { predictions: true },
    orderBy: { createdAt: "asc" },
  });
  for (const u of users) {
    console.log(
      JSON.stringify({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
        predictionCount: u.predictions.length,
      })
    );
  }
  console.log("TOTAL:", users.length);
}

main().finally(() => prisma.$disconnect());
