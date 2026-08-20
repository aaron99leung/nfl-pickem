import "dotenv/config";
import { syncSeason } from "@/lib/syncGames";

const SEASON = 2026;

syncSeason(SEASON)
  .then((totalSynced) => {
    console.log(`Done. Synced ${totalSynced} games for season ${SEASON}.`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
