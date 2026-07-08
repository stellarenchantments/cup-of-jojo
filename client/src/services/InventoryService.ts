import type { Inventory} from "../models/InventoryItems";
import { API_URL } from "../config";

export async function getInventory(): Promise<Inventory> {
    const response = await fetch(`${API_URL}/api/inventory`);

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
        `${API_URL}/api/inventory/ingredients`,
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
        `${API_URL}/api/inventory/cups`,
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
        `${API_URL}/api/inventory`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to reset inventory.");
    }

    return response.json();
}

export async function consumeIngredient(
    inventoryIngredientId: string,
    amountOz = 1
) {
    const response = await fetch(
        `${API_URL}/api/inventory/ingredients/${inventoryIngredientId}/consume`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amountOz }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to consume ingredient.");
    }

    return response.json();
}

export async function consumeCup(
    inventoryCupId: string
) {
    const response = await fetch(
        `${API_URL}/api/inventory/cups/${inventoryCupId}/consume`,
        {
            method: "PATCH",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to consume cup.");
    }

    return response.json();
}

export async function ageInventoryOneDay() {
    const response = await fetch(`${API_URL}/api/inventory/age`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Failed to age inventory.");
    }

    return response.json();
}