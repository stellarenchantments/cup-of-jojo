/*
  Warnings:

  - Added the required column `remainingOz` to the `InventoryIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "remainingOz" REAL NOT NULL,
    "daysOld" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "InventoryIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InventoryIngredient" ("daysOld", "id", "ingredientId", "quantity") SELECT "daysOld", "id", "ingredientId", "quantity" FROM "InventoryIngredient";
DROP TABLE "InventoryIngredient";
ALTER TABLE "new_InventoryIngredient" RENAME TO "InventoryIngredient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
