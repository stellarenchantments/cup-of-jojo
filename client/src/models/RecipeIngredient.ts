import type { Ingredient } from "./Ingredient";

export interface RecipeIngredient {
    id: string;
    amountOz: number;
    remainingOz: number;
    ingredient: Ingredient;
}