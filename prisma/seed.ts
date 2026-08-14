import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const teams = [
  { abbreviation: "BUF", name: "Buffalo Bills", conference: "AFC", division: "East" },
  { abbreviation: "MIA", name: "Miami Dolphins", conference: "AFC", division: "East" },
  { abbreviation: "NE", name: "New England Patriots", conference: "AFC", division: "East" },
  { abbreviation: "NYJ", name: "New York Jets", conference: "AFC", division: "East" },

  { abbreviation: "BAL", name: "Baltimore Ravens", conference: "AFC", division: "North" },
  { abbreviation: "CIN", name: "Cincinnati Bengals", conference: "AFC", division: "North" },
  { abbreviation: "CLE", name: "Cleveland Browns", conference: "AFC", division: "North" },
  { abbreviation: "PIT", name: "Pittsburgh Steelers", conference: "AFC", division: "North" },

  { abbreviation: "HOU", name: "Houston Texans", conference: "AFC", division: "South" },
  { abbreviation: "IND", name: "Indianapolis Colts", conference: "AFC", division: "South" },
  { abbreviation: "JAX", name: "Jacksonville Jaguars", conference: "AFC", division: "South" },
  { abbreviation: "TEN", name: "Tennessee Titans", conference: "AFC", division: "South" },

  { abbreviation: "DEN", name: "Denver Broncos", conference: "AFC", division: "West" },
  { abbreviation: "KC", name: "Kansas City Chiefs", conference: "AFC", division: "West" },
  { abbreviation: "LV", name: "Las Vegas Raiders", conference: "AFC", division: "West" },
  { abbreviation: "LAC", name: "Los Angeles Chargers", conference: "AFC", division: "West" },

  { abbreviation: "DAL", name: "Dallas Cowboys", conference: "NFC", division: "East" },
  { abbreviation: "NYG", name: "New York Giants", conference: "NFC", division: "East" },
  { abbreviation: "PHI", name: "Philadelphia Eagles", conference: "NFC", division: "East" },
  { abbreviation: "WAS", name: "Washington Commanders", conference: "NFC", division: "East" },

  { abbreviation: "CHI", name: "Chicago Bears", conference: "NFC", division: "North" },
  { abbreviation: "DET", name: "Detroit Lions", conference: "NFC", division: "North" },
  { abbreviation: "GB", name: "Green Bay Packers", conference: "NFC", division: "North" },
  { abbreviation: "MIN", name: "Minnesota Vikings", conference: "NFC", division: "North" },

  { abbreviation: "ATL", name: "Atlanta Falcons", conference: "NFC", division: "South" },
  { abbreviation: "CAR", name: "Carolina Panthers", conference: "NFC", division: "South" },
  { abbreviation: "NO", name: "New Orleans Saints", conference: "NFC", division: "South" },
  { abbreviation: "TB", name: "Tampa Bay Buccaneers", conference: "NFC", division: "South" },

  { abbreviation: "ARI", name: "Arizona Cardinals", conference: "NFC", division: "West" },
  { abbreviation: "LAR", name: "Los Angeles Rams", conference: "NFC", division: "West" },
  { abbreviation: "SF", name: "San Francisco 49ers", conference: "NFC", division: "West" },
  { abbreviation: "SEA", name: "Seattle Seahawks", conference: "NFC", division: "West" },
];

async function main() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: { abbreviation: team.abbreviation },
      update: team,
      create: team,
    });
  }
  console.log(`Seeded ${teams.length} teams.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
