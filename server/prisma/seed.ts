import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    await prisma.recipeIngredient.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.inventoryIngredient.deleteMany();
    await prisma.inventoryCup.deleteMany();
    await prisma.marketSpot.deleteMany();
    await prisma.cup.deleteMany();
    await prisma.ingredient.deleteMany();
    
    await prisma.ingredient.createMany({
        data: [
            { name: "Coffee Beans", sizeOz: 16, groceryCost: 16, perishableDays: null },
            { name: "Water", sizeOz: 128, groceryCost: 4, perishableDays: null },
            { name: "Cacao Powder", sizeOz: 8, groceryCost: 4, perishableDays: 30 },
            { name: "Whole Milk", sizeOz: 128, groceryCost: 4, perishableDays: 2 },
            { name: "Oat Milk", sizeOz: 128, groceryCost: 6, perishableDays: 4 },
            { name: "Sugar", sizeOz: 8, groceryCost: 3, perishableDays: null },
            { name: "Chocolate", sizeOz: 8, groceryCost: 5, perishableDays: 2 },
        ],
    });

    await prisma.cup.upsert({
        where: { name: "Regular Cup" },
        update: {},
        create: {
            name: "Regular Cup",
            sizeOz: 8,
            groceryCost: 0.50,
        },
    });

    const ingredients = {
        coffeeBeans: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Coffee Beans" } }),
        water: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Water" } }),
        cacaoPowder: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Cacao Powder" } }),
        wholeMilk: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Whole Milk" } }),
        oatMilk: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Oat Milk" } }),
        sugar: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Sugar" } }),
        chocolate: await prisma.ingredient.findUniqueOrThrow({ where: { name: "Chocolate" } }),
    };

    async function createRecipe(
        name: string,
        dayUnlocked: number,
        recipeIngredients: { ingredientId: string; amountOz: number }[]
    ) {
        const recipe = await prisma.recipe.upsert({
            where: { name },
            update: { dayUnlocked },
            create: { name, dayUnlocked },
        });

        await prisma.recipeIngredient.deleteMany({
            where: { recipeId: recipe.id },
        });

        await prisma.recipeIngredient.createMany({
            data: recipeIngredients.map((ingredient) => ({
                recipeId: recipe.id,
                ingredientId: ingredient.ingredientId,
                amountOz: ingredient.amountOz,
            })),
        });
    }

    await createRecipe("Phantom Blood", 1, [
        { ingredientId: ingredients.coffeeBeans.id, amountOz: 2 },
        { ingredientId: ingredients.water.id, amountOz: 8 },
    ]);

    await createRecipe("Battle Tendency", 2, [
        { ingredientId: ingredients.coffeeBeans.id, amountOz: 2 },
        { ingredientId: ingredients.water.id, amountOz: 6 },
        { ingredientId: ingredients.wholeMilk.id, amountOz: 2 },
    ]);

    await createRecipe("Stardust Crusader", 3, [
        { ingredientId: ingredients.coffeeBeans.id, amountOz: 2 },
        { ingredientId: ingredients.water.id, amountOz: 6 },
        { ingredientId: ingredients.oatMilk.id, amountOz: 2 },
    ]);

    await createRecipe("Diamond is Unbreakable", 4, [
        { ingredientId: ingredients.cacaoPowder.id, amountOz: 2 },
        { ingredientId: ingredients.wholeMilk.id, amountOz: 8 },
    ]);

    await createRecipe("Golden Wind", 5, [
        { ingredientId: ingredients.coffeeBeans.id, amountOz: 2 },
        { ingredientId: ingredients.chocolate.id, amountOz: 1 },
        { ingredientId: ingredients.oatMilk.id, amountOz: 7 },
    ]);

    await createRecipe("Stone Ocean", 6, [
        { ingredientId: ingredients.coffeeBeans.id, amountOz: 2 },
        { ingredientId: ingredients.chocolate.id, amountOz: 1 },
        { ingredientId: ingredients.wholeMilk.id, amountOz: 6 },
        { ingredientId: ingredients.sugar.id, amountOz: 1 },
    ]);

    await prisma.marketSpot.createMany({
        data: [
            { name: "Spot 1", rentalCost: 30 },
            { name: "Spot 2", rentalCost: 30 },
        ],
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });