-- CreateEnum
CREATE TYPE "StockCategory" AS ENUM ('INGREDIENTS', 'BEVERAGES', 'SUPPLIES', 'OTHER');

-- CreateTable
CREATE TABLE "StockItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "StockCategory" NOT NULL DEFAULT 'INGREDIENTS',
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "reorderQuantity" INTEGER NOT NULL,
    "supplier" TEXT,
    "lastRestocked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockItem_pkey" PRIMARY KEY ("id")
);
