-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sizeOz" REAL NOT NULL,
    "groceryCost" REAL NOT NULL,
    "perishableDays" INTEGER
);

-- CreateTable
CREATE TABLE "InventoryIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "daysOld" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "InventoryIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");
