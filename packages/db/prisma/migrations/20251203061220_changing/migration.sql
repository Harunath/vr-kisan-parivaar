/*
  Warnings:

  - You are about to alter the column `defaultAmountPaise` on the `UserPayoutType` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Made the column `defaultAmountPaise` on table `UserPayoutType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserPayoutType" ALTER COLUMN "defaultAmountPaise" SET NOT NULL,
ALTER COLUMN "defaultAmountPaise" SET DATA TYPE INTEGER;
