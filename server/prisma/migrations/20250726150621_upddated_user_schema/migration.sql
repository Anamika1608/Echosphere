-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('OWNER', 'RESIDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'RESIDENT';
