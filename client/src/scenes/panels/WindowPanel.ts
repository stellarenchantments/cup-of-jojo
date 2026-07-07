import Phaser from "phaser";
import { TruckPanel } from "../../models/TruckPanel";
import { GameState } from "../../state/GameState";
import { getInventory } from "../../services/InventoryService";
import type { Inventory } from "../../models/InventoryItems";
import {
    getRecipes,
    updateRecipePrice,
} from "../../services/MarketService";
import type { Recipe } from "../../models/Recipe";
import { getActiveOrder, setActiveOrder, clearActiveOrder } from "../../state/OrderState";
import { showFloatingText } from "../../components/FloatingText";

export class WindowPanel extends TruckPanel {
    readonly name = "Window";

    private menuSelections = new Map<string, boolean>();

    private recipes: Recipe[] = [];
    private customerText!: Phaser.GameObjects.Text;
    private orderText!: Phaser.GameObjects.Text;
    private serveButton!: Phaser.GameObjects.Text;
    
    render(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ): Phaser.GameObjects.GameObject[] {
        const objects: Phaser.GameObjects.GameObject[] = [];

        objects.push(
            scene.add.text(450, 90, " Customer Window", {
                fontSize: "40px",
                color: "#000000",
            }).setOrigin(0.5)
        );

        objects.push(
            scene.add.text(220, 145, "Menu", {
                fontSize: "30px",
                color: "#000000",
            }).setOrigin(0.5)
        );

        objects.push(
            scene.add.text(650, 145, "Customer", {
                fontSize: "30px",
                color: "#000000",
            }).setOrigin(0.5)
        );

        objects.push(
            scene.add.rectangle(450, 315, 4, 280, 0x000000)
        );

        this.loadMenu(scene, addActiveObject);

        return objects;
    }

    private async loadMenu(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ) {
        try {
            const recipes = await getRecipes();
            const inventory = await getInventory();

            this.recipes = recipes.filter(
                recipe => recipe.dayUnlocked <= GameState.day
            );

            this.renderRecipeList(scene, addActiveObject, this.recipes, inventory);
            this.renderCustomerArea(scene, addActiveObject);
        } catch (error) {
            console.error(error);

            addActiveObject(
                scene.add.text(220, 230, "Could not load menu.", {
                    fontSize: "22px",
                    color: "#cc0000",
                }).setOrigin(0.5)
            );
        }
    }

    private renderRecipeList(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void,
        recipes: Recipe[],
        inventory: Inventory
    ) {
        let y = 200;

        recipes.forEach((recipe) => {
            const recipeNameX = 95;
            const checkboxX = 395;
            
            const priceLabelX = 130;
            const minusX = 220;
            const priceX = 280;
            const plusX = 350;
            
            const canMake = this.canMakeRecipe(recipe, inventory);
            const isSelected = this.menuSelections.get(recipe.id) ?? false;

            const recipeText = scene.add.text(
                recipeNameX,
                y,
                recipe.name,
                {
                    fontSize: "22px",
                    color: canMake ? "#000000" : "#999999",
                }
            );

            const checkbox = scene.add.text(checkboxX, y, isSelected ? "[X]" : "[ ]", {
                fontSize: "20px",
                color: canMake ? "#000000" : "#999999",
                backgroundColor: "#eeeeee",
                padding: { x: 6, y: 3 },
            });

            const priceLabel = scene.add.text(priceLabelX, y + 32, "Price:", {
                fontSize: "18px",
                color: canMake ? "#000000" : "#999999",
            });

            const priceText = scene.add.text(priceX, y + 32, `$${recipe.price.toFixed(2)}`, {
                fontSize: "18px",
                color: canMake ? "#000000" : "#999999",
            })

            const minusButton = scene.add.text(minusX, y + 30, "-", {
                fontSize: "20px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                padding: { x: 8, y: 3 },
            }).setInteractive({ useHandCursor: true });

            const plusButton = scene.add.text(plusX, y + 30, "+", {
                fontSize: "20px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                padding: { x: 8, y: 3 },
            }).setInteractive({ useHandCursor: true });

            const refreshText = () => {
                const checked = this.menuSelections.get(recipe.id) ?? false;
                recipeText.setText(recipe.name);
                checkbox.setText(checked ? "[X]" : "[ ]");
                priceText.setText(`$${recipe.price.toFixed(2)}`);
            };

            if (canMake) {
                checkbox.setInteractive({ useHandCursor: true });

                checkbox.on("pointerdown", () => {
                    const currentValue = this.menuSelections.get(recipe.id) ?? false;
                    this.menuSelections.set(recipe.id, !currentValue);
                    refreshText();
                });
            }

            minusButton.on("pointerdown", async () => {
                recipe.price = Math.max(0, recipe.price - 0.5);
                refreshText();
                await updateRecipePrice(recipe.id, recipe.price);
            });

            plusButton.on("pointerdown", async () => {
                recipe.price += 0.5;
                refreshText();
                await updateRecipePrice(recipe.id, recipe.price);
            });

            addActiveObject(recipeText);
            addActiveObject(checkbox);
            addActiveObject(priceLabel);
            addActiveObject(priceText);
            addActiveObject(minusButton);
            addActiveObject(plusButton);

            if (!canMake) {
                const disabledText = scene.add.text(recipeNameX, y + 58, "Missing inventory", {
                    fontSize: "14px",
                    color: "#999999",
                });

                addActiveObject(disabledText);
                y += 90;
            } else {
                y += 78;
            }
        });
    }

    private renderCustomerArea(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ) {
        const activeOrder = getActiveOrder();

        this.customerText = scene.add.text(
            650,
            220,
            activeOrder ? activeOrder.customerEmoji : "No customer yet",
            {
                fontSize: "26px",
                color: "#000000",
                align: "center",
            }
        ).setOrigin(0.5);

        this.orderText = scene.add.text(
            650,
            280,
            activeOrder ? `Order: ${activeOrder.recipe.name}
                Budget: $${activeOrder.budget}
                ${activeOrder.isPrepared ? "\nReady to serve!" : "\nPreparing..."}`
                : "Click New Customer",
            {
                fontSize: "20px",
                color: "#000000",
                align: "center",
                wordWrap: { width: 300 },
            }
        ).setOrigin(0.5);

        const newCustomerButton = scene.add.text(650, 350, "New Customer", {
            fontSize: "22px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: { x: 12, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.serveButton = scene.add.text(650, 415, "Serve", {
            fontSize: "22px",
            color: "#999999",
            backgroundColor: "#dddddd",
            padding: { x: 12, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        newCustomerButton.on("pointerdown", () => {
            this.spawnCustomer();
        });

        this.updateServeButton();

        this.serveButton.on("pointerdown", () => {
            this.serveOrder();
        });

        addActiveObject(this.customerText);
        addActiveObject(this.orderText);
        addActiveObject(newCustomerButton);
        addActiveObject(this.serveButton);

        scene.time.addEvent({
        delay: 15000,
        loop: true,
        callback: () => {
            if (!getActiveOrder()) {
                this.spawnCustomer();
            }
        },
    });
    }

    private canMakeRecipe(recipe: Recipe, inventory: Inventory): boolean {
        const hasIngredients = recipe.ingredients.every((recipeIngredient) => {
            const totalAvailableOz = inventory.ingredients
                .filter((inventoryIngredient) =>
                    inventoryIngredient.ingredient.id === recipeIngredient.ingredient.id
                )
                .reduce((total, inventoryIngredient) =>
                    total + inventoryIngredient.remainingOz,
                    0
                );

            return totalAvailableOz >= recipeIngredient.amountOz;
        });

        const hasCup = inventory.cups.some((inventoryCup) =>
            inventoryCup.quantity > 0
        );

        return hasIngredients && hasCup;
    }

    private spawnCustomer() {
        if (getActiveOrder()) {
            return;
        }

        const customerEmojis = ["🙂", "😎", "🤠", "🧙", "👩", "👨", "🧑"];
        const customerEmoji = Phaser.Utils.Array.GetRandom(customerEmojis);
        const budget = Phaser.Math.Between(0, 100);

        this.customerText.setText(customerEmoji);

        const customerWillOrder = Phaser.Math.Between(1, 100) <= 75;

        if (!customerWillOrder) {
            this.orderText.setText(`${customerEmoji}: Actually... just kidding.`);
            return;
        }

        const recipesForSale = this.recipes.filter(recipe =>
            this.menuSelections.get(recipe.id) === true
        );

        if (recipesForSale.length === 0) {
            this.orderText.setText(`${customerEmoji}: Nothing is for sale right now.`);
            return;
        }

        const recipe = Phaser.Utils.Array.GetRandom(recipesForSale);

        if (recipe.price > budget) {
            this.orderText.setText(
                `${customerEmoji}: I only have $${budget}.\nNever mind.`
            );
            return;
        }

        setActiveOrder({
            customerEmoji,
            budget,
            recipe,
            isPrepared: false,
        });

        this.orderText.setText(
            `${customerEmoji}: Can I get ${recipe.name}?\nBudget: $${budget}`
        );

        this.updateServeButton();
    }

    private serveOrder() {
        const order = getActiveOrder();

        if (!order) {
            this.orderText.setText("No active order to serve.");
            return;
        }

        if (!order.isPrepared) {
            this.orderText.setText("The drink is not ready yet.");
            return;
        }

        GameState.money += order.recipe.price;
        showFloatingText(
            this.customerText.scene,
            650,
            415,
            `+ $${order.recipe.price.toFixed(2)}`,
            "#008000"
        );
        this.customerText.scene.events.emit("game-state-updated");

        this.orderText.setText(
            `${order.customerEmoji}🥤 paid $${order.recipe.price.toFixed(2)}!`
        );

        this.customerText.setText("No customer yet");

        clearActiveOrder();
        this.updateServeButton();
    }

    private updateServeButton() {
        const order = getActiveOrder();

        if (order?.isPrepared) {
            this.serveButton.setColor("#000000");
            this.serveButton.setBackgroundColor("#b6ffb6");
        } else {
            this.serveButton.setColor("#999999");
            this.serveButton.setBackgroundColor("#dddddd");
        }
    }
}