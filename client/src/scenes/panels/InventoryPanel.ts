import Phaser from "phaser";
import { TruckPanel } from "../../models/TruckPanel";
import { addShelf } from "../../components/Shelf";
import { addItemCard } from "../../components/ItemCard";
import { getInventory } from "../../services/InventoryService";
import { getItemAssets } from "../../assets/ItemAssets";
import type { InventoryCup, InventoryIngredient } from "../../models/InventoryItems";

export class InventoryPanel extends TruckPanel {
    readonly name = "Inventory";

    render(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ): Phaser.GameObjects.GameObject[] {
        const objects: Phaser.GameObjects.GameObject[] = [];

        objects.push(
            scene.add.text(450, 90, "Truck Inventory", {
                fontSize: "40px",
                color: "#000000",
            }).setOrigin(0.5)
        );

        const fridgeShelf = addShelf(scene, 450, 210, 600, "");
        const pantryShelf = addShelf(scene, 450, 390, 600, "");

        objects.push(
            fridgeShelf.labelText,
            fridgeShelf.shelfLine,
            pantryShelf.labelText,
            pantryShelf.shelfLine
        );

        this.loadInventory(scene, addActiveObject, fridgeShelf, pantryShelf);

        return objects;
    }

    private async loadInventory(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void,
        fridgeShelf: ReturnType<typeof addShelf>,
        pantryShelf: ReturnType<typeof addShelf>
    ) {
        try {
            const inventory = await getInventory();

            const sortedIngredients = [...inventory.ingredients].sort(
                (a, b) => b.daysOld - a.daysOld
            );

            sortedIngredients.forEach((inventoryItem) => {
                const shelf = inventoryItem.ingredient.perishableDays == null
                    ? pantryShelf
                    : fridgeShelf;

                const position = shelf.getNextItemPosition();

                const card = this.addInventoryIngredientCard(
                    scene,
                    inventoryItem,
                    position.x,
                    position.y
                );

                addActiveObject(card.item);
                addActiveObject(card.infoPopup);
                addActiveObject(card.quantityBadge);
            });

            const groupedCups = inventory.cups.reduce((groups, inventoryCup) => {
                const cupId = inventoryCup.cup.id;

                if (!groups[cupId]) {
                    groups[cupId] = {
                        cup: inventoryCup.cup,
                        quantity: 0,
                    };
                }

                groups[cupId].quantity += inventoryCup.quantity;

                return groups;
            }, {} as Record<string, { cup: InventoryCup["cup"]; quantity: number }>);

            Object.values(groupedCups).forEach((group) => {
                const position = pantryShelf.getNextItemPosition();

                const card = this.addInventoryCupCard(
                    scene,
                    group.cup,
                    group.quantity,
                    position.x,
                    position.y
                );

                addActiveObject(card.item);
                addActiveObject(card.infoPopup);
                addActiveObject(card.quantityBadge);
            });
        } catch (error) {
            console.error(error);

            addActiveObject(
                scene.add.text(450, 300, "Could not load inventory", {
                    fontSize: "24px",
                    color: "#cc0000",
                }).setOrigin(0.5)
            );
        }
    }

    private addInventoryIngredientCard(
        scene: Phaser.Scene,
        inventoryItem: InventoryIngredient,
        x: number,
        y: number
    ) {
        return addItemCard({
            scene,
            x,
            y,
            asset: getItemAssets(inventoryItem.ingredient.name),
            quantity: inventoryItem.remainingOz,
            getInfoText: () =>
                `${inventoryItem.ingredient.name}\nRemaining Oz: ${inventoryItem.remainingOz}\nDays old: ${inventoryItem.daysOld}`,
        });
    }

    private addInventoryCupCard(
        scene: Phaser.Scene,
        cup: InventoryCup["cup"],
        quantity: number,
        x: number,
        y: number
    ) {
        return addItemCard({
            scene,
            x,
            y,
            asset: "🥤",
            quantity,
            getInfoText: () =>
                `${cup.name}\nQuantity: ${quantity}\nSize: ${cup.sizeOz} oz`,
        });
    }
}