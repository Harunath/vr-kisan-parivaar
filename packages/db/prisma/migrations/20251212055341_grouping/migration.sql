/*
  Warnings:

  - You are about to drop the `_InsuranceRecordToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InsuranceRecordToUser" DROP CONSTRAINT "_InsuranceRecordToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_InsuranceRecordToUser" DROP CONSTRAINT "_InsuranceRecordToUser_B_fkey";

-- DropTable
DROP TABLE "_InsuranceRecordToUser";

-- CreateTable
CREATE TABLE "UserInsuranceEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insuranceRecordId" TEXT NOT NULL,
    "memberCode" TEXT,
    "certificateUrl" TEXT,
    "activationDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInsuranceEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserInsuranceEnrollment_userId_idx" ON "UserInsuranceEnrollment"("userId");

-- CreateIndex
CREATE INDEX "UserInsuranceEnrollment_insuranceRecordId_idx" ON "UserInsuranceEnrollment"("insuranceRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInsuranceEnrollment_userId_insuranceRecordId_key" ON "UserInsuranceEnrollment"("userId", "insuranceRecordId");

-- CreateIndex
CREATE INDEX "InsuranceRecord_status_idx" ON "InsuranceRecord"("status");

-- CreateIndex
CREATE INDEX "InsuranceRecord_activationDate_idx" ON "InsuranceRecord"("activationDate");

-- CreateIndex
CREATE INDEX "InsuranceRecord_expiryDate_idx" ON "InsuranceRecord"("expiryDate");

-- AddForeignKey
ALTER TABLE "UserInsuranceEnrollment" ADD CONSTRAINT "UserInsuranceEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsuranceEnrollment" ADD CONSTRAINT "UserInsuranceEnrollment_insuranceRecordId_fkey" FOREIGN KEY ("insuranceRecordId") REFERENCES "InsuranceRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
