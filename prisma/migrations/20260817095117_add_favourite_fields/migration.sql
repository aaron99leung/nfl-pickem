-- AlterTable
ALTER TABLE "user" ADD COLUMN     "favouritePlayer" TEXT,
ADD COLUMN     "favouriteTeam" TEXT;

-- AddForeignKey
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
