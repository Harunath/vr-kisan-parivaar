-- AlterTable
ALTER TABLE "UserPayoutType" ADD COLUMN     "approvedAmountPaise" BIGINT,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';
