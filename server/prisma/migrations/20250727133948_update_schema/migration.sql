/*
  Warnings:

  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TechnicianField" AS ENUM ('PLUMBING', 'ELECTRICAL', 'CARPENTRY', 'CLEANING', 'PAINTING', 'AC_REPAIR', 'APPLIANCE_REPAIR', 'GENERAL_MAINTENANCE');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('PLUMBING', 'ELECTRICAL', 'HEATING_COOLING', 'CLEANING', 'SECURITY', 'INTERNET_WIFI', 'APPLIANCE', 'STRUCTURAL', 'PEST_CONTROL', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CLEANING', 'MAINTENANCE', 'REPAIR', 'INSTALLATION', 'UPGRADE', 'INSPECTION', 'OTHER');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('P1', 'P2', 'P3', 'P4');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('PENDING', 'AWAITING_APPROVAL', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "pgOwnerId" TEXT;

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "PgOwner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PgOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "speciality" "TechnicianField" NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pgOwnerId" TEXT,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaisedIssue" (
    "id" TEXT NOT NULL,
    "ticketNumber" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "issueType" "IssueType" NOT NULL,
    "priorityLevel" "PriorityLevel" NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "raisedById" TEXT NOT NULL,
    "assignedTechnicianId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "pgOwnerId" TEXT,

    CONSTRAINT "RaisedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedService" (
    "id" TEXT NOT NULL,
    "ticketNumber" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "priorityLevel" "PriorityLevel" NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT NOT NULL,
    "isApprovedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "ownerComment" TEXT,
    "rejectionReason" TEXT,
    "requestedById" TEXT NOT NULL,
    "assignedTechnicianId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "pgOwnerId" TEXT,

    CONSTRAINT "RequestedService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PgOwner_email_key" ON "PgOwner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RaisedIssue_ticketNumber_key" ON "RaisedIssue"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RequestedService_ticketNumber_key" ON "RequestedService"("ticketNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "PgOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "PgOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaisedIssue" ADD CONSTRAINT "RaisedIssue_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaisedIssue" ADD CONSTRAINT "RaisedIssue_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaisedIssue" ADD CONSTRAINT "RaisedIssue_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "PgOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedService" ADD CONSTRAINT "RequestedService_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedService" ADD CONSTRAINT "RequestedService_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedService" ADD CONSTRAINT "RequestedService_pgOwnerId_fkey" FOREIGN KEY ("pgOwnerId") REFERENCES "PgOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
