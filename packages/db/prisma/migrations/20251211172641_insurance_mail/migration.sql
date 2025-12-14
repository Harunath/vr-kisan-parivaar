-- CreateTable
CREATE TABLE "InsuranceMailLog" (
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

    CONSTRAINT "InsuranceMailLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InsuranceMailLog" ADD CONSTRAINT "InsuranceMailLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
