import type { Ingredient } from "../models/Ingredient";
import type { Cup } from "../models/Cup";
import { API_URL } from "../config";

export interface StoreItems {
    ingredients: Ingredient[];
    cups: Cup[];
}

export async function getStoreItems(): Promise<StoreItems> {
    const response = await fetch(`${API_URL}/api/store-items`);

    if (!response.ok) {
        throw new Error("Failed to load store items");
    }

    return response.json();
}