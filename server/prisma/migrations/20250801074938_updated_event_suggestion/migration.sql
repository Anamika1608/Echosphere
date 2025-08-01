-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('COMMON_ROOM', 'ROOFTOP', 'GARDEN', 'PARKING_AREA', 'DINING_HALL', 'RECREATION_ROOM', 'STUDY_ROOM', 'GYM', 'LIBRARY', 'BALCONY', 'COURTYARD', 'OTHER');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPROVED', 'IMPLEMENTED', 'REJECTED', 'EXPIRED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'FESTIVAL';
ALTER TYPE "EventType" ADD VALUE 'SPORTS';
ALTER TYPE "EventType" ADD VALUE 'CULTURAL';
ALTER TYPE "EventType" ADD VALUE 'EDUCATIONAL';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "actualCost" DOUBLE PRECISION,
ADD COLUMN     "estimatedCost" DOUBLE PRECISION,
ADD COLUMN     "facilityId" TEXT;

-- CreateTable
CREATE TABLE "PgFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FacilityType" NOT NULL,
    "capacity" INTEGER,
    "description" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "amenities" TEXT[],
    "pgCommunityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PgFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAnalytic" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "pgCommunityId" TEXT NOT NULL,
    "totalRegistrations" INTEGER NOT NULL DEFAULT 0,
    "actualAttendance" INTEGER NOT NULL DEFAULT 0,
    "attendanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "noShowCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "totalFeedbacks" INTEGER NOT NULL DEFAULT 0,
    "positiveFeedbackCount" INTEGER NOT NULL DEFAULT 0,
    "negativeFeedbackCount" INTEGER NOT NULL DEFAULT 0,
    "neutralFeedbackCount" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "eventCost" DOUBLE PRECISION,
    "estimatedROI" DOUBLE PRECISION,
    "photosShared" INTEGER NOT NULL DEFAULT 0,
    "socialMentions" INTEGER NOT NULL DEFAULT 0,
    "successFactors" TEXT[],
    "improvementAreas" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAnalytic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSuggestion" (
    "id" TEXT NOT NULL,
    "pgCommunityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestedEventType" "EventType" NOT NULL,
    "suggestedDate" TIMESTAMP(3),
    "suggestedDuration" INTEGER,
    "reasoning" TEXT NOT NULL,
    "contextFactors" TEXT[],
    "basedOnEventIds" TEXT[],
    "expectedEngagement" DOUBLE PRECISION,
    "requiredFacilities" TEXT[],
    "recommendedCapacity" INTEGER,
    "estimatedCost" DOUBLE PRECISION,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "implementedAsEventId" TEXT,
    "ownerFeedback" TEXT,
    "ownerRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAnalytic_eventId_key" ON "EventAnalytic"("eventId");

-- AddForeignKey
ALTER TABLE "PgFacility" ADD CONSTRAINT "PgFacility_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAnalytic" ADD CONSTRAINT "EventAnalytic_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAnalytic" ADD CONSTRAINT "EventAnalytic_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSuggestion" ADD CONSTRAINT "EventSuggestion_pgCommunityId_fkey" FOREIGN KEY ("pgCommunityId") REFERENCES "PgCommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "PgFacility"("id") ON DELETE SET NULL ON UPDATE CASCADE;
