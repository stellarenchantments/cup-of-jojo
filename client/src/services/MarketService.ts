import type { MarketSpot } from "../models/MarketSpot";
import type { Recipe } from "../models/Recipe";

export async function getMarketSpots(): Promise<MarketSpot[]> {
  const response = await fetch("http://localhost:3000/api/market-spots");

  if (!response.ok) {
    throw new Error("Failed to load market spots.");
  }

  return response.json();
}

export async function getRecipes(): Promise<Recipe[]> {
    const response = await fetch("http://localhost:3000/api/recipes");

    if (!response.ok) {
        throw new Error("Failed to load recipes.");
    }

    return response.json();
}

export async function updateRecipePrice(
    recipeId: string,
    price: number
): Promise<Recipe> {
    const response = await fetch(
        `http://localhost:3000/api/recipes/${recipeId}/price`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ price }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update recipe price.");
    }

    return response.json();
}

export async function resetRecipePrices() {
    const response = await fetch("http://localhost:3000/api/recipes/reset-prices", {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Failed to reset recipe prices.");
    }

    return response.json();
}

export async function sellRecipe(
    recipeId: string,
    budget: number
) {
    const response = await fetch("http://localhost:3000/api/orders/sell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recipeId,
            budget,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Failed to sell drink.");
    }

    return response.json();
}