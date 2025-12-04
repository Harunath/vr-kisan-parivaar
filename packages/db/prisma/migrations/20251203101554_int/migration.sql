/*
  Warnings:

  - You are about to alter the column `requestedAmountPaise` on the `UserPayout` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `approvedAmountPaise` on the `UserPayout` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "UserPayout" ALTER COLUMN "requestedAmountPaise" SET DATA TYPE INTEGER,
ALTER COLUMN "approvedAmountPaise" SET DATA TYPE INTEGER;
