-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('TAKEAWAY', 'DINING', 'UBER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'DINING';
