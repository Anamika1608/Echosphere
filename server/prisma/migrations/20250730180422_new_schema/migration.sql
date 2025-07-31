/*
  Warnings:

  - You are about to drop the column `pgOwnerId` on the `RaisedIssue` table. All the data in the column will be lost.
  - You are about to drop the column `pgOwnerId` on the `RequestedService` table. All the data in the column will be lost.
  - You are about to drop the column `pgOwnerId` on the `Technician` table. All the data in the column will be lost.
  - You are about to drop the column `pgOwnerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `pgCommunityId` to the `RaisedIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pgCommunityId` to the `RequestedService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RaisedIssue" DROP CONSTRAINT "RaisedIssue_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "RequestedService" DROP CONSTRAINT "RequestedService_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Technician" DROP CONSTRAINT "Technician_pgOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pgOwnerId_fkey";

-- AlterTable
ALTER TABLE "RaisedIssue" DROP COLUMN "pgOwnerId",
ADD COLUMN     "pgCommunityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequestedService" DROP COLUMN "pgOwnerId",
ADD COLUMN     "pgCommunityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "pgOwnerId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pgOwnerId",
ADD COLUMN     "pgCommunityId" TEXT,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PgCommunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "pgCode" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PgCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianPgAssignment" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "pgCommunityId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechnicianPgAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PgCommunity_pgCode_key" ON "PgCommunity"("pgCode");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianPgAssignment_technicianId_pgCommunityId_key" ON "TechnicianPgAssignment"("technicianId", "pgCommunityId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PgCommunity" ADD CONSTRAINT "PgCommunity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianPgAssignment" ADD CONSTRAINT "TechnicianPgAssignment_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianPgAssignment" ADD CONSTRAINT "TechnicianPgAssignment_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaisedIssue" ADD CONSTRAINT "RaisedIssue_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedService" ADD CONSTRAINT "RequestedService_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
