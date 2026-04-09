/*
  Warnings:

  - You are about to drop the column `layoutX` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `layoutY` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Table" DROP COLUMN "layoutX",
DROP COLUMN "layoutY";
