/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `PayoutTransfer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PayoutTransfer" ADD COLUMN     "cycleEnd" TIMESTAMP(3),
ADD COLUMN     "cycleKey" TEXT,
ADD COLUMN     "cycleStart" TIMESTAMP(3),
ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PayoutTransfer_idempotencyKey_key" ON "PayoutTransfer"("idempotencyKey");
