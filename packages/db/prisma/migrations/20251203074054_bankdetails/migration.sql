-- AddForeignKey
ALTER TABLE "UserPayout" ADD CONSTRAINT "UserPayout_bankReference_fkey" FOREIGN KEY ("bankReference") REFERENCES "BankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
