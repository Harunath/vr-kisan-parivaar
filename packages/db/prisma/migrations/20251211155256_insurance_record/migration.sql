/*
  Warnings:

  - You are about to drop the column `issueDate` on the `InsuranceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `policyId` on the `InsuranceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `policyType` on the `InsuranceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `providerName` on the `InsuranceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `InsuranceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InsuranceRecord` table. All the data in the column will be lost.
  - The `status` column on the `InsuranceRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `InsuranceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policyNumber` to the `InsuranceRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `activationDate` on table `InsuranceRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiryDate` on table `InsuranceRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InsuranceBatchStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "InsuranceRecord" DROP CONSTRAINT "InsuranceRecord_userId_fkey";

-- DropIndex
DROP INDEX "InsuranceRecord_policyId_key";

-- DropIndex
DROP INDEX "InsuranceRecord_userId_key";

-- AlterTable
ALTER TABLE "InsuranceRecord" DROP COLUMN "issueDate",
DROP COLUMN "policyId",
DROP COLUMN "policyType",
DROP COLUMN "providerName",
DROP COLUMN "remarks",
DROP COLUMN "userId",
ADD COLUMN     "batchDocumentUrl" TEXT,
ADD COLUMN     "insurerName" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "otherDocumentUrls" TEXT[],
ADD COLUMN     "policyDocumentUrl" TEXT,
ADD COLUMN     "policyNumber" TEXT NOT NULL,
ALTER COLUMN "activationDate" SET NOT NULL,
ALTER COLUMN "expiryDate" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "InsuranceBatchStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "_InsuranceRecordToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InsuranceRecordToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_InsuranceRecordToUser_B_index" ON "_InsuranceRecordToUser"("B");

-- AddForeignKey
ALTER TABLE "_InsuranceRecordToUser" ADD CONSTRAINT "_InsuranceRecordToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "InsuranceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuranceRecordToUser" ADD CONSTRAINT "_InsuranceRecordToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
