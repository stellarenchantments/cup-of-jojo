-- CreateTable
CREATE TABLE "Cup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sizeOz" REAL NOT NULL,
    "groceryCost" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "InventoryCup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cupId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "InventoryCup_cupId_fkey" FOREIGN KEY ("cupId") REFERENCES "Cup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cup_name_key" ON "Cup"("name");
