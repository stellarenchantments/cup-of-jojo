import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

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

    const inventoryItem = await prisma.inventoryIngredient.create({
        data: {
            ingredientId,
            quantity: quantity ?? 1,
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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});