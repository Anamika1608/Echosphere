-- AlterTable
ALTER TABLE "RaisedIssue" ALTER COLUMN "issueType" SET DEFAULT 'OTHER',
ALTER COLUMN "priorityLevel" SET DEFAULT 'P2';

-- AlterTable
ALTER TABLE "RequestedService" ALTER COLUMN "serviceType" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "Technician" ALTER COLUMN "speciality" SET DEFAULT 'GENERAL_MAINTENANCE';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'RESIDENT';
