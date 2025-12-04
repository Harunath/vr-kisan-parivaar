/*
  Warnings:

  - Added the required column `parentId` to the `UserPayout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LandParcelUnit" ALTER COLUMN "unitNumber" DROP DEFAULT;
DROP SEQUENCE "landparcelunit_unitnumber_seq";

-- AlterTable
ALTER TABLE "UserPayout" ADD COLUMN     "parentId" TEXT NOT NULL,
ADD COLUMN     "referralId" TEXT;

-- CreateIndex
CREATE INDEX "UserPayout_referralId_idx" ON "UserPayout"("referralId");

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
