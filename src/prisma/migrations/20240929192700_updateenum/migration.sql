/*
  Warnings:

  - The values [NOT_DEFINED] on the enum `accountType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "accountType_new" AS ENUM ('ISSUER', 'USER', 'VERIFIER');
ALTER TABLE "user" ALTER COLUMN "accountType" TYPE "accountType_new" USING ("accountType"::text::"accountType_new");
ALTER TYPE "accountType" RENAME TO "accountType_old";
ALTER TYPE "accountType_new" RENAME TO "accountType";
DROP TYPE "accountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "accountType" DROP NOT NULL;
