import Phaser from "phaser";
import {
    getInventory,
    consumeIngredient,
    consumeCup,
} from "../../services/InventoryService";
import type { InventoryCup, Inventory } from "../../models/InventoryItems";
import { getItemAssets } from "../../assets/ItemAssets";
import {
    getActiveOrder,
    markActiveOrderPrepared,
} from "../../state/OrderState";

type DraggableMachineItem = Phaser.GameObjects.Text & {
    startX: number;
    startY: number;
};

export class Kettle {
    private addActiveObject: (object: Phaser.GameObjects.GameObject) => void;

    private scene: Phaser.Scene;
    private machine!: Phaser.GameObjects.Text;
    private brewingText!: Phaser.GameObjects.Text;
    private brewButton!: Phaser.GameObjects.Text;
    private statusText!: Phaser.GameObjects.Text;
    private machineText!: Phaser.GameObjects.Text;
    private orderText!: Phaser.GameObjects.Text;

    private inventory!: Inventory;

    private ingredientAmountsAdded = new Map<string, number>();
    private hasBrewed = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ) {
        this.scene = scene;
        this.addActiveObject = addActiveObject;

        this.createBaseUi(x, y);
        this.loadInventory(x, y);
        this.setupDragEvents();
    }

    private createBaseUi(x: number, y: number) {
        this.orderText = this.scene.add.text(x + 300, y - 100, "Order: None yet", {
            fontSize: "18px",
            color: "#000000",
            align: "center",
            wordWrap: { width: 260 },
        }).setOrigin(0.5);

        const title = this.scene.add.text(x, y - 145, "Bizarre Machine", {
            fontSize: "28px",
            color: "#000000",
        }).setOrigin(0.5);

        this.machine = this.scene.add.text(x, y, "🫖", {
            fontSize: "95px",
        })
            .setOrigin(0.5)
            .setInteractive();

        this.machineText = this.scene.add.text(x, y + 70, "", {
            fontSize: "44px",
        }).setOrigin(0.5);

        this.brewingText = this.scene.add.text(x, y - 80, "", {
            fontSize: "34px",
        }).setOrigin(0.5);

        this.statusText = this.scene.add.text(x, y + 170, "Loading inventory...", {
            fontSize: "18px",
            color: "#000000",
            align: "center",
            wordWrap: { width: 360 },
        }).setOrigin(0.5);

        this.brewButton = this.scene.add.text(x, y + 110, "Brew Drink", {
            fontSize: "22px",
            color: "#999999",
            backgroundColor: "#dddddd",
            padding: { x: 12, y: 8 },
        }).setOrigin(0.5);

        this.addActiveObject(this.orderText);
        this.addActiveObject(title);
        this.addActiveObject(this.machine);
        this.addActiveObject(this.machineText);
        this.addActiveObject(this.brewingText);
        this.addActiveObject(this.brewButton);
        this.addActiveObject(this.statusText);
    }

    private async loadInventory(x: number, y: number) {
        try {
            this.inventory = await getInventory();

            this.createIngredientBoxesForActiveOrder(x - 330, y);
            this.createCupBox(x + 300, y + 40);

            this.updateStatus();
        } catch (error) {
            console.error(error);
            this.statusText.setText("Could not load inventory.");
        }
    }

    private createIngredientBoxesForActiveOrder(x: number, y: number) {
        const order = getActiveOrder();

        if (!order) {
            this.statusText.setText("No active order. Go to the window first.");
            return;
        }

        const startX = x;
        const startY = y - 55;

        const columnSpacing = 165;
        const rowSpacing = 100;

        order.recipe.ingredients.forEach((recipeIngredient, index) => {
            const ingredientName = recipeIngredient.ingredient.name;
            const requiredAmountOz = recipeIngredient.amountOz;

            this.ingredientAmountsAdded.set(ingredientName, 0);

            const column = index % 2;
            const row = Math.floor(index / 2);

            this.createIngredientBox(
                ingredientName,
                startX + column * columnSpacing,
                startY + row * rowSpacing,
                requiredAmountOz
            );
        });
    }

    private createIngredientBox(
        ingredientName: string,
        x: number,
        y: number,
        requiredAmountOz: number
    ) {
        const totalOz = this.getAvailableIngredientOz(ingredientName);
        const amountToDisplay = Math.min(totalOz, requiredAmountOz);

        const BOX_WIDTH = 165;
        const BOX_HEIGHT = 90;

        const box = this.scene.add.rectangle(
            x,
            y,
            BOX_WIDTH,
            BOX_HEIGHT,
            0xf5f5f5
        ).setStrokeStyle(2, 0x000000);

        const label = this.scene.add.text(
            x,
            y - 28,
            `${ingredientName}\n${totalOz} oz`,
            {
                fontSize: "13px",
                color: "#000000",
                align: "center"
            }
        ).setOrigin(0.5);

        this.addActiveObject(box);
        this.addActiveObject(label);

        for (let i = 0; i < amountToDisplay; i++) 
        {
            const startX = x - BOX_WIDTH / 2 + 25;
            const startY = y + 3;
            const emojiSpacingX = 28;
            const emojiSpacingY = 32;

            const item = this.scene.add.text(
                startX + (i % 4) * emojiSpacingX,
                startY + Math.floor(i / 4) * emojiSpacingY,
                getItemAssets(ingredientName),
                {
                    fontSize: "22px",
                }
            )
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true }) as DraggableMachineItem;

            item.setData("type", "ingredient");
            item.setData("ingredientName", ingredientName);
            item.startX = item.x;
            item.startY = item.y;

            this.scene.input.setDraggable(item);
            this.addActiveObject(item);
        }
    }

    private createCupBox(x: number, y: number) {
        const totalCups = this.inventory.cups.reduce(
            (total, inventoryCup) => total + inventoryCup.quantity,
            0
        );

        const box = this.scene.add.rectangle(x, y, 200, 115, 0xf5f5f5)
            .setStrokeStyle(2, 0x000000);

        const label = this.scene.add.text(
            x,
            y - 40,
            `Cups: ${totalCups} available`,
            {
                fontSize: "16px",
                color: "#000000",
            }
        ).setOrigin(0.5);

        const amountToDisplay = Math.min(totalCups, 6);

        this.addActiveObject(box);
        this.addActiveObject(label);

        for (let i = 0; i < amountToDisplay; i++) {
            const cup = this.scene.add.text(
                x - 70 + i * 30,
                y,
                "🥤",
                {
                    fontSize: "30px",
                }
            )
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true }) as DraggableMachineItem;

            cup.setData("type", "cup");
            cup.startX = cup.x;
            cup.startY = cup.y;

            this.scene.input.setDraggable(cup);
            this.addActiveObject(cup);
        }
    }

    private setupDragEvents() {
        const dragHandler = (
            _pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.GameObject,
            dragX: number,
            dragY: number
        ) => {
            const object = gameObject as DraggableMachineItem;
            object.x = dragX;
            object.y = dragY;
        };

        const dragEndHandler = (
            _pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.GameObject
        ) => {
            const object = gameObject as DraggableMachineItem;

            if (!this.isOverlappingMachine(object)) {
                object.x = object.startX;
                object.y = object.startY;
                return;
            }

            this.handleDroppedOnMachine(object);
        };

        this.scene.input.on("drag", dragHandler);
        this.scene.input.on("dragend", dragEndHandler);

        this.machine.on("destroy", () => {
            this.scene.input.off("drag", dragHandler);
            this.scene.input.off("dragend", dragEndHandler);
        });
    }

    private handleDroppedOnMachine(object: DraggableMachineItem) {
        const type = object.getData("type");

        if (type === "ingredient") {
            this.handleIngredientDropped(object);
            return;
        }

        if (type === "cup") {
            this.tryFillCup(object);
        }
    }

    private handleIngredientDropped(object: DraggableMachineItem) {
        const ingredientName = object.getData("ingredientName");
        const order = getActiveOrder();

        if (!order) {
            object.x = object.startX;
            object.y = object.startY;
            this.statusText.setText("No active order.");
            return;
        }

        const recipeIngredient = order.recipe.ingredients.find(
            item => item.ingredient.name === ingredientName
        );

        if (!recipeIngredient) {
            object.x = object.startX;
            object.y = object.startY;
            return;
        }

        const currentAmount = this.ingredientAmountsAdded.get(ingredientName) ?? 0;

        if (currentAmount >= recipeIngredient.amountOz) {
            object.x = object.startX;
            object.y = object.startY;
            return;
        }

        this.ingredientAmountsAdded.set(ingredientName, currentAmount + 1);
        object.destroy();

        this.updateStatus();
    }

    private async tryFillCup(cup: DraggableMachineItem) {
        if (!this.hasBrewed) {
            cup.x = cup.startX;
            cup.y = cup.startY;
            this.statusText.setText("Brew before adding a cup.");
            return;
        }

        try {
            const cupItem = this.getFirstCup();

            if (!cupItem) {
                this.statusText.setText("No cups available.");
                return;
            }

            await consumeCup(cupItem.id);

            markActiveOrderPrepared();

            cup.destroy();
            this.statusText.setText("Drink is ready! 🥤\nGo right to window to serve to customer!");
        } catch (error) {
            console.error(error);
            this.statusText.setText("Could not fill cup.");
        }
    }

    private updateStatus() {
        const order = getActiveOrder();

        if (!order) {
            this.orderText.setText("Order: None yet");
            this.statusText.setText("No active order.");
            this.disableBrewButton();
            return;
        }

        this.orderText.setText(
            `Order: ${order.recipe.name}\nNeeds:\n${this.getRecipeNeedsText()}`
        );

        this.statusText.setText(this.getProgressText());

        if (this.isReadyToBrew() && !this.hasBrewed) {
            this.enableBrewButton();
        } else {
            this.disableBrewButton();
        }
    }

    private getRecipeNeedsText() {
        const order = getActiveOrder();

        if (!order) return "";

        return order.recipe.ingredients
            .map(recipeIngredient =>
                `${recipeIngredient.amountOz} oz ${recipeIngredient.ingredient.name}`
            )
            .join("\n");
    }

    private getProgressText() {
        const order = getActiveOrder();

        if (!order) return "No active order.";

        return order.recipe.ingredients
            .map(recipeIngredient => {
                const ingredientName = recipeIngredient.ingredient.name;
                const currentAmount = this.ingredientAmountsAdded.get(ingredientName) ?? 0;

                return `${ingredientName}: ${currentAmount}/${recipeIngredient.amountOz} oz`;
            })
            .join("\n");
    }

    private isReadyToBrew() {
        const order = getActiveOrder();

        if (!order) return false;

        return order.recipe.ingredients.every(recipeIngredient => {
            const ingredientName = recipeIngredient.ingredient.name;
            const currentAmount = this.ingredientAmountsAdded.get(ingredientName) ?? 0;

            return currentAmount >= recipeIngredient.amountOz;
        });
    }

    private enableBrewButton() {
        this.brewButton.setColor("#000000");
        this.brewButton.setBackgroundColor("#dddddd");
        this.brewButton.setInteractive({ useHandCursor: true });

        this.brewButton.removeAllListeners("pointerdown");
        this.brewButton.on("pointerdown", async () => {
            await this.brewDrink();
        });
    }

    private disableBrewButton() {
        this.brewButton.setColor("#999999");
        this.brewButton.setBackgroundColor("#dddddd");
        this.brewButton.disableInteractive();
    }

    private async brewDrink() {
        const order = getActiveOrder();

        if (!order) {
            this.statusText.setText("No active order.");
            return;
        }

        this.disableBrewButton();
        this.statusText.setText("Brewing...");
        this.brewingText.setText("🔥");

        try {
            for (const recipeIngredient of order.recipe.ingredients) {
                await this.consumeIngredientByName(
                    recipeIngredient.ingredient.name,
                    recipeIngredient.amountOz
                );
            }

            this.scene.time.delayedCall(2000, () => {
                this.hasBrewed = true;
                this.machineText.setText("☕");
                this.statusText.setText("Drink brewed.\nDrag a cup to fill it.");
            });
        } catch (error) {
            console.error(error);
            this.statusText.setText("Could not brew drink.");
        }
    }

    private async consumeIngredientByName(name: string, amountOz: number) {
        const inventoryItems = this.inventory.ingredients
            .filter(item => item.ingredient.name === name)
            .sort((a, b) => b.daysOld - a.daysOld);

        let amountLeft = amountOz;

        for (const item of inventoryItems) {
            if (amountLeft <= 0) break;

            const amountToUse = Math.min(item.remainingOz, amountLeft);

            await consumeIngredient(item.id, amountToUse);

            amountLeft -= amountToUse;
        }

        if (amountLeft > 0) {
            throw new Error(`Not enough ${name}.`);
        }
    }

    private getAvailableIngredientOz(name: string) {
        return this.inventory.ingredients
            .filter(item => item.ingredient.name === name)
            .reduce((total, item) => total + item.remainingOz, 0);
    }

    private getFirstCup(): InventoryCup | undefined {
        return this.inventory.cups.find(cup => cup.quantity > 0);
    }

    private isOverlappingMachine(object: Phaser.GameObjects.Text): boolean {
        return Phaser.Geom.Intersects.RectangleToRectangle(
            object.getBounds(),
            this.machine.getBounds()
        );
    }
}