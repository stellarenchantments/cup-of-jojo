import type { Ingredient } from "./Ingredient";
import type { Cup } from "./Cup";

export interface InventoryIngredient {
    id: string;
    daysOld: number;
    remainingOz: number;
    ingredient: Ingredient;
}

export interface InventoryCup {
    id: string;
    quantity: number;
    cup: Cup;
}

export interface Inventory {
    ingredients: InventoryIngredient[];
    cups: InventoryCup[];
}