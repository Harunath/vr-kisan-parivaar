/*
  Warnings:

  - You are about to drop the column `batchId` on the `UserPayout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPayout" DROP CONSTRAINT "UserPayout_batchId_fkey";

-- DropIndex
DROP INDEX "UserPayout_batchId_status_idx";

-- AlterTable
ALTER TABLE "UserPayout" DROP COLUMN "batchId",
ADD COLUMN     "transferReference" TEXT;

-- CreateTable
CREATE TABLE "PayoutTransfer" (
    "id" TEXT NOT NULL,
    "batchId" TEXT,
    "userId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "amountPaise" BIGINT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'REQUESTED',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPayout_transferReference_status_idx" ON "UserPayout"("transferReference", "status");

-- AddForeignKey
ALTER TABLE "PayoutTransfer" ADD CONSTRAINT "PayoutTransfer_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PayoutBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutTransfer" ADD CONSTRAINT "PayoutTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutTransfer" ADD CONSTRAINT "PayoutTransfer_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_transferReference_fkey" FOREIGN KEY ("transferReference") REFERENCES "PayoutTransfer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
