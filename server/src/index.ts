import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { sellRecipe } from "./services/OrderService.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "Cup of Jojos server is running" });
});

app.get("/api/recipes", async (_req, res) => {
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  res.json(recipes);
});

app.patch("/api/recipes/reset-prices", async (_req, res) => {
    await prisma.recipe.updateMany({
        data: {
            price: 0,
        },
    });

    res.json({
        message: "Recipe prices reset.",
    });
});

app.get("/api/store-items", async (_req, res) => {
    const ingredients = await prisma.ingredient.findMany({
        orderBy: { name: "asc" },
    });

    const cups = await prisma.cup.findMany({
        orderBy: { name: "asc" },
    });

    res.json({
        ingredients,
        cups,
    });
});

app.post("/api/inventory/ingredients", async (req, res) => {
    const { ingredientId, quantity } = req.body;

    const ingredient = await prisma.ingredient.findUniqueOrThrow({
        where: { id: ingredientId },
    });

    const inventoryItem = await prisma.inventoryIngredient.create({
        data: {
            ingredientId,
            quantity: quantity ?? 1,
            remainingOz: ingredient.sizeOz * (quantity ?? 1),
            daysOld: 0,
        },
        include: {
            ingredient: true,
        },
    });

    res.json(inventoryItem);
});

app.post("/api/inventory/cups", async (req, res) => {
    const { cupId, quantity } = req.body;

    const inventoryCup = await prisma.inventoryCup.create({
        data: {
            cupId,
            quantity: quantity ?? 1,
        },
        include: {
            cup: true,
        },
    });

    res.json(inventoryCup);
});

app.get("/api/inventory", async (_req, res) => {
    const ingredients = await prisma.inventoryIngredient.findMany({
        include: {
            ingredient: true,
        },
    });

    const cups = await prisma.inventoryCup.findMany({
        include: {
            cup: true,
        },
    });

    res.json({
        ingredients,
        cups,
    });
});

app.delete("/api/inventory", async (_req, res) => {
    await prisma.inventoryIngredient.deleteMany();
    await prisma.inventoryCup.deleteMany();

    res.json({
        message: "Inventory reset.",
    });
});

app.get("/api/market-spots", async (_req, res) => {
  const spots = await prisma.marketSpot.findMany({
    orderBy: { name: "asc" },
  });

  res.json(spots);
});

app.patch("/api/inventory/ingredients/:id/consume", async (req, res) => {
    const { id } = req.params;
    const { amountOz } = req.body;

    const inventoryItem = await prisma.inventoryIngredient.findUniqueOrThrow({
        where: { id },
        include: { ingredient: true },
    });

    if (inventoryItem.remainingOz < amountOz) {
        return res.status(400).json({
            message: "Not enough ingredient remaining.",
        });
    }

    const newRemainingOz = inventoryItem.remainingOz - amountOz;

    if (newRemainingOz <= 0) {
        await prisma.inventoryIngredient.delete({
            where: { id },
        });

        return res.json({
            consumed: amountOz,
            deleted: true,
        });
    }

    const updatedItem = await prisma.inventoryIngredient.update({
        where: { id },
        data: {
            remainingOz: newRemainingOz,
        },
        include: {
            ingredient: true,
        },
    });

    res.json(updatedItem);
});

app.patch("/api/inventory/cups/:id/consume", async (req, res) => {
    const { id } = req.params;

    const inventoryCup = await prisma.inventoryCup.findUniqueOrThrow({
        where: { id },
        include: { cup: true },
    });

    const newQuantity = inventoryCup.quantity - 1;

    if (newQuantity <= 0) {
        await prisma.inventoryCup.delete({
            where: { id },
        });

        return res.json({
            consumed: 1,
            deleted: true,
        });
    }

    const updatedCup = await prisma.inventoryCup.update({
        where: { id },
        data: {
            quantity: newQuantity,
        },
        include: {
            cup: true,
        },
    });

    res.json(updatedCup);
});

app.post("/api/orders/sell", async (req, res) => {
    try {
        const { recipeId, budget } = req.body;

        const sale = await sellRecipe(prisma, recipeId, budget);

        res.json(sale);
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to sell recipe.";

        res.status(400).json({ message });
    }
});

app.patch("/api/inventory/age", async (_req, res) => {
    await prisma.inventoryIngredient.updateMany({
        data: {
            daysOld: {
                increment: 1,
            },
        },
    });

    res.json({
        message: "Inventory aged by one day.",
    });
});

app.patch("/api/recipes/:id/price", async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data: { price },
        include: {
            ingredients: {
                include: {
                    ingredient: true,
                },
            },
        },
    });

    res.json(updatedRecipe);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});