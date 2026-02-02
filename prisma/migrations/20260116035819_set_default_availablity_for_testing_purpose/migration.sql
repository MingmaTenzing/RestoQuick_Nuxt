-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "availability" SET DEFAULT ARRAY['MON', 'WED', 'FRI', 'SUN']::"WeekDay"[];
