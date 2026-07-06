import Phaser from "phaser";
import { Location, LocationDisplayName } from "../models/Location";
import { addBackToMapButton } from "../components/BackToMapButton";
import { addGameHud } from "../components/GameHud";
import { addShelf } from "../components/Shelf";
import { addItemCard } from "../components/ItemCard";
import { getStoreItems } from "../services/StoreService";
import { getItemAssets } from "../assets/ItemAssets";
import type { Ingredient } from "../models/Ingredient";
import type { Cup } from "../models/Cup";
import { getInventory, buyIngredient, buyCup, type Inventory } from "../services/InventoryService";
import { GameState } from "../state/GameState";
import { showFloatingText } from "../components/FloatingText";

export default class GroceryStoreScene extends Phaser.Scene {
    private hud!: ReturnType<typeof addGameHud>;
    private fridgeShelf!: ReturnType<typeof addShelf>;
    private pantryShelf!: ReturnType<typeof addShelf>;

    constructor() {
        super("GroceryStoreScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");
        this.hud = addGameHud(this);

        this.add.text(450, 50, LocationDisplayName[Location.GROCERY], {
            fontSize: "48px",
            color: "#000000",
        }).setOrigin(0.5);

        this.add.text(450, 100, "Get food and materials for the food truck", {
            fontSize: "28px",
            color: "#000000",
        }).setOrigin(0.5);

        this.fridgeShelf = addShelf(this, 450, 190, 600, "");
        this.pantryShelf = addShelf(this, 450, 350, 600, "");

        addBackToMapButton(this, 450, 500);

        this.loadStoreItems();
    }

    private async loadStoreItems() {
        try {
            const storeItems = await getStoreItems();
            const inventory = await getInventory();

            this.drawIngredients(storeItems.ingredients, inventory);
            this.drawCups(storeItems.cups, inventory);
        } catch (error) {
            console.error(error);

            this.add.text(450, 400, "Could not load store items", {
                fontSize: "24px",
                color: "#cc0000",
            }).setOrigin(0.5);
        }
    }

    private getIngredientQuantity(inventory: Inventory, ingredientId: string) {
        return inventory.ingredients
            .filter((item) => item.ingredient.id === ingredientId)
            .reduce((total, item) => total + item.quantity, 0);
    }

    private getCupQuantity(inventory: Inventory, cupId: string) {
        return inventory.cups
            .filter((item) => item.cup.id === cupId)
            .reduce((total, item) => total + item.quantity, 0);
    }

    private drawIngredients(ingredients: Ingredient[], inventory: Inventory) {
        ingredients.forEach((ingredient) => {
            const shelf = ingredient.perishableDays == null
                ? this.pantryShelf
                : this.fridgeShelf;

            const position = shelf.getNextItemPosition();

            const shelfLifeText = ingredient.perishableDays == null
                ? "Shelf life: non-perishable"
                : `Shelf life: ${ingredient.perishableDays} days`;

            const quantity = this.getIngredientQuantity(inventory, ingredient.id);

            const card = addItemCard({
                scene: this,
                x: position.x,
                y: position.y,
                asset: getItemAssets(ingredient.name),
                quantity,
                getInfoText: () =>
                    `${ingredient.name}\nCost: $${ingredient.groceryCost}\nSize: ${ingredient.sizeOz} oz\n${shelfLifeText}`,
                onClick: async () => {
                    if (GameState.money < ingredient.groceryCost) {
                        console.log("Not enough cash");
                        return;
                    }

                    GameState.money -= ingredient.groceryCost;
                    this.hud.refresh();

                    showFloatingText(
                        this,
                        position.x,
                        position.y,
                        `${getItemAssets(ingredient.name)} -$${ingredient.groceryCost}`,
                        "#161cc2"
                    );

                    await buyIngredient(ingredient.id);

                    const updatedInventory = await getInventory();
                    const updatedQuantity = this.getIngredientQuantity(updatedInventory, ingredient.id);

                    card.setQuantity(updatedQuantity);
                },
            });
        });
    }

    private drawCups(cups: Cup[], inventory: Inventory) {
        cups.forEach((cup) => {
            const position = this.pantryShelf.getNextItemPosition();
            const quantity = this.getCupQuantity(inventory, cup.id);

            const card = addItemCard({
                scene: this,
                x: position.x,
                y: position.y,
                asset: "🥤",
                quantity,
                getInfoText: () =>
                    `${cup.name}\nCost: $${cup.groceryCost}\nSize: ${cup.sizeOz} oz`,
                onClick: async () => {
                    if (GameState.money < cup.groceryCost) {
                        console.log("Not enough cash");
                        return;
                    }

                    GameState.money -= cup.groceryCost;
                    this.hud.refresh();

                    showFloatingText(
                        this,
                        position.x,
                        position.y,
                        `🥤 -$${cup.groceryCost}`,
                        "#161cc2"
                    );

                    await buyCup(cup.id);

                    const updatedInventory = await getInventory();
                    const updatedQuantity = this.getCupQuantity(updatedInventory, cup.id);

                    card.setQuantity(updatedQuantity);
                },
            });
        });
    }
}