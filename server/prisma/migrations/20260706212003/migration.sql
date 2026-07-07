-- CreateTable
CREATE TABLE "MarketSpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rentalCost" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketSpot_name_key" ON "MarketSpot"("name");
