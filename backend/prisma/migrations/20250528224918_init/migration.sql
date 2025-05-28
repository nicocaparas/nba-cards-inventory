-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cardBrand" TEXT NOT NULL,
    "variant" TEXT,
    "isRookie" BOOLEAN NOT NULL DEFAULT false,
    "isGraded" BOOLEAN NOT NULL DEFAULT false,
    "grader" TEXT,
    "grade" DOUBLE PRECISION,
    "acquirePrice" DOUBLE PRECISION,
    "estimatedValue" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3),
    "listedForSale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Card_playerName_idx" ON "Card"("playerName");
