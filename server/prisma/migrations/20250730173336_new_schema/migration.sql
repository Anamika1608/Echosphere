/*
  Warnings:

  - You are about to drop the `PgOwner` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `pgOwnerId` on table `RaisedIssue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pgOwnerId` on table `RequestedService` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pgOwnerId` on table `Technician` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PG_OWNER', 'RESIDENT');

-- DropForeignKey
ALTER TABLE "RaisedIssue" DROP CONSTRAINT "RaisedIssue_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "RequestedService" DROP CONSTRAINT "RequestedService_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Technician" DROP CONSTRAINT "Technician_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pgOwnerId_fkey";

-- AlterTable
ALTER TABLE "RaisedIssue" ALTER COLUMN "pgOwnerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RequestedService" ALTER COLUMN "pgOwnerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Technician" ALTER COLUMN "pgOwnerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'RESIDENT';

-- DropTable
DROP TABLE "PgOwner";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaisedIssue" ADD CONSTRAINT "RaisedIssue_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedService" ADD CONSTRAINT "RequestedService_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
