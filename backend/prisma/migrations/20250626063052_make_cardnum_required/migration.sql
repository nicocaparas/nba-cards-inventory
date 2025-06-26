/*
  Warnings:

  - Made the column `cardNum` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "cardNum" SET NOT NULL;
