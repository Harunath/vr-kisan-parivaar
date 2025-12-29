/*
  Warnings:

  - Added the required column `stateId` to the `Districts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Districts" ADD COLUMN     "stateId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Districts" ADD CONSTRAINT "Districts_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
