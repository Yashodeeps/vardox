-- AlterTable
ALTER TABLE "user" ADD COLUMN     "documents" TEXT[];

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "issuerAddress" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
