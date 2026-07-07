import type { PrismaClient } from "@prisma/client";

export async function sellRecipe(
    prisma: PrismaClient,
    recipeId: string,
    budget: number
) {
    const recipe = await prisma.recipe.findUniqueOrThrow({
        where: { id: recipeId },
        include: {
            ingredients: {
                include: { ingredient: true },
            },
        },
    });

    if (recipe.price <= 0) {
        throw new Error("Recipe does not have a price set.");
    }

    if (recipe.price > budget) {
        throw new Error("Customer cannot afford this drink.");
    }

    const cup = await prisma.inventoryCup.findFirst({
        where: {
            quantity: { gt: 0 },
        },
        orderBy: {
            quantity: "desc",
        },
    });

    if (!cup) {
        throw new Error("No cups available.");
    }

    for (const recipeIngredient of recipe.ingredients) {
        const inventoryItems = await prisma.inventoryIngredient.findMany({
            where: {
                ingredientId: recipeIngredient.ingredientId,
            },
        });

        const totalAvailableOz = inventoryItems.reduce(
            (total, item) => total + item.remainingOz,
            0
        );

        if (totalAvailableOz < recipeIngredient.amountOz) {
            throw new Error(`Not enough ${recipeIngredient.ingredient.name}.`);
        }
    }

    for (const recipeIngredient of recipe.ingredients) {
        let amountLeftToConsume = recipeIngredient.amountOz;

        const inventoryItems = await prisma.inventoryIngredient.findMany({
            where: {
                ingredientId: recipeIngredient.ingredientId,
            },
            orderBy: {
                daysOld: "desc",
            },
        });

        for (const item of inventoryItems) {
            if (amountLeftToConsume <= 0) break;

            const amountToUse = Math.min(item.remainingOz, amountLeftToConsume);
            const newRemainingOz = item.remainingOz - amountToUse;

            if (newRemainingOz <= 0) {
                await prisma.inventoryIngredient.delete({
                    where: { id: item.id },
                });
            } else {
                await prisma.inventoryIngredient.update({
                    where: { id: item.id },
                    data: { remainingOz: newRemainingOz },
                });
            }

            amountLeftToConsume -= amountToUse;
        }
    }

    const newCupQuantity = cup.quantity - 1;

    if (newCupQuantity <= 0) {
        await prisma.inventoryCup.delete({
            where: { id: cup.id },
        });
    } else {
        await prisma.inventoryCup.update({
            where: { id: cup.id },
            data: { quantity: newCupQuantity },
        });
    }

    return {
        message: "Sale complete.",
        recipeName: recipe.name,
        price: recipe.price,
    };
}