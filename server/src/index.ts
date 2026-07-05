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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});