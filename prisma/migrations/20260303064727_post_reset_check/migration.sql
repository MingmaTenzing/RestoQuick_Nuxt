-- CreateEnum
CREATE TYPE "newOrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "new_order_status" "newOrderStatus" NOT NULL DEFAULT 'PENDING';
