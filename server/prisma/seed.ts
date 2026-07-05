import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Creating ingredients...");

    await prisma.ingredient.createMany({
        data: [
            { name: "Coffee Beans", sizeOz: 16, groceryCost: 16, perishableDays: null },
            { name: "Water", sizeOz: 128, groceryCost: 4, perishableDays: null },
            { name: "Cacao Powder", sizeOz: 8, groceryCost: 4, perishableDays: 30 },
            { name: "Whole Milk", sizeOz: 128, groceryCost: 4, perishableDays: 2 },
            { name: "Oat Milk", sizeOz: 128, groceryCost: 6, perishableDays: 4 },
            { name: "Whipped Cream", sizeOz: 8, groceryCost: 3, perishableDays: 7 },
            { name: "Chocolate Syrup", sizeOz: 8, groceryCost: 5, perishableDays: 2 },
        ],
    });

    console.log("ingredients created.");
    console.log("Creating cup...");

    await prisma.cup.create({
        data: {
            name: "Regular Cup",
            sizeOz: 8,
            groceryCost: 0.50,
        }
    });

    console.log("Cup created.");

    const phantomBlood = await prisma.recipe.create({
        data: {
            name: "Phantom Blood",
            dayUnlocked: 0,
        },
        });

        const coffeeBeans = await prisma.ingredient.findUniqueOrThrow({
            where: { name: "Coffee Beans" },
        });

        const water = await prisma.ingredient.findUniqueOrThrow({
            where: { name: "Water" },
        });

        await prisma.recipeIngredient.createMany({
        data: [
            {
                recipeId: phantomBlood.id,
                ingredientId: coffeeBeans.id,
                amountOz: 2,
            },
            {
                recipeId: phantomBlood.id,
                ingredientId: water.id,
                amountOz: 8,
            },
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