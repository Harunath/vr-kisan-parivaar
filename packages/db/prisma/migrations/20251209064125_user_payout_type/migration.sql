/*
  Warnings:

  - You are about to alter the column `approvedAmountPaise` on the `UserPayoutType` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "UserPayoutType" ALTER COLUMN "approvedAmountPaise" SET DATA TYPE INTEGER;
