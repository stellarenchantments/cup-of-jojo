-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dayUnlocked" INTEGER NOT NULL,
    "price" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Recipe" ("dayUnlocked", "id", "name") SELECT "dayUnlocked", "id", "name" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
