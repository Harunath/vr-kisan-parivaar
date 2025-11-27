-- CreateEnum
CREATE TYPE "MailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'RETRYING');

-- AlterTable
CREATE SEQUENCE landparcelunit_unitnumber_seq;
ALTER TABLE "LandParcelUnit" ALTER COLUMN "unitNumber" SET DEFAULT nextval('landparcelunit_unitnumber_seq');
ALTER SEQUENCE landparcelunit_unitnumber_seq OWNED BY "LandParcelUnit"."unitNumber";

-- CreateTable
CREATE TABLE "LandAllotmentMailLog" (
    "id" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "templateKey" TEXT,
    "mergeInfo" JSONB,
    "deliveryStatus" "MailStatus" NOT NULL DEFAULT 'PENDING',
    "responseStatus" INTEGER,
    "responseData" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastTriedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandAllotmentMailLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LandAllotmentMailLog" ADD CONSTRAINT "LandAllotmentMailLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
