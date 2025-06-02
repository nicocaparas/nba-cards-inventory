/*
  Warnings:

  - You are about to drop the column `listedForSale` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "listedForSale",
ADD COLUMN     "saleStatus" TEXT NOT NULL DEFAULT 'available';
