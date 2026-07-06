import type { Ingredient } from "../models/Ingredient";
import type { Cup } from "../models/Cup";

export interface StoreItems {
    ingredients: Ingredient[];
    cups: Cup[];
}

export async function getStoreItems(): Promise<StoreItems> {
    const response = await fetch("http://localhost:3000/api/store-items");

    if (!response.ok) {
        throw new Error("Failed to load store items");
    }

    return response.json();
}