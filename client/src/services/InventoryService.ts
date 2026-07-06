import type { Ingredient } from "../models/Ingredient";
import type { Cup } from "../models/Cup";

export interface InventoryIngredient {
    id: string;
    quantity: number;
    daysOld: number;
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

export async function getInventory(): Promise<Inventory> {
    const response = await fetch("http://localhost:3000/api/inventory");

    if (!response.ok) {
        throw new Error("Failed to load inventory.");
    }

    return response.json();
}

export async function buyIngredient(
    ingredientId: string,
    quantity = 1
) {
    const response = await fetch(
        "http://localhost:3000/api/inventory/ingredients",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredientId,
                quantity,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to buy ingredient.");
    }

    return response.json();
}

export async function buyCup(
    cupId: string,
    quantity = 1
) {
    const response = await fetch(
        "http://localhost:3000/api/inventory/cups",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cupId,
                quantity,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to buy cup.");
    }

    return response.json();
}

export async function resetInventory() {
    const response = await fetch(
        "http://localhost:3000/api/inventory",
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to reset inventory.");
    }

    return response.json();
}