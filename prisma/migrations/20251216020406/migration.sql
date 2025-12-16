/*
  Warnings:

  - A unique constraint covering the columns `[orderNo]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderNo" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNo_key" ON "Order"("orderNo");
