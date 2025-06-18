-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "trackPrices" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
