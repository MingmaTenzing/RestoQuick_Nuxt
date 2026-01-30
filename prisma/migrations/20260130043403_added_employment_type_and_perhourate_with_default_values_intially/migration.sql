-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PartTime', 'FullTime', 'Casual');

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "employmentType" "EmploymentType" NOT NULL DEFAULT 'FullTime',
ADD COLUMN     "perHourRate" DECIMAL(65,30) NOT NULL DEFAULT 38.15;
