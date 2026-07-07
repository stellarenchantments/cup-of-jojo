import type { RecipeIngredient } from "./RecipeIngredient";

export interface Recipe {
    id: string;
    name: string;
    dayUnlocked: number;
    price: number;

    ingredients: RecipeIngredient[];
}