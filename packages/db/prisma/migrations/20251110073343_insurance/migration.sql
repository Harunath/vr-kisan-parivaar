-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "InsuranceRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "providerName" TEXT,
    "policyType" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "activationDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" "PolicyStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceRecord_userId_key" ON "InsuranceRecord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceRecord_policyId_key" ON "InsuranceRecord"("policyId");

-- AddForeignKey
ALTER TABLE "InsuranceRecord" ADD CONSTRAINT "InsuranceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
