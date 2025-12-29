-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "city" TEXT,
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "Onboarding" ALTER COLUMN "userPhoto" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userPhoto" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Districts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "Districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
