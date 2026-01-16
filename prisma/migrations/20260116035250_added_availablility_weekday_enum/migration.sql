/*
  Warnings:

  - The `availability` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "availability",
ADD COLUMN     "availability" "WeekDay"[];
