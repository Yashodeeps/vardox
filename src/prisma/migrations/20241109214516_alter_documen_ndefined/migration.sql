-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
