// ResetButton.ts
import Phaser from "phaser";
import { resetGameState } from "../../state/GameState";
import { resetInventory } from "../../services/InventoryService";
import { resetRecipePrices } from "../../services/MarketService";

export class ResetButton extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        label: string,
        nextScene = "MapScene",
    ) {
        super(scene, x, y, label, {
            fontSize: "32px",
            color: "#000000",
        });

        scene.add.existing(this);

        this.setOrigin(0.5);
        this.setInteractive({ useHandCursor: true });

        this.on("pointerdown", async () => {
            try {
                await resetInventory();
                await resetRecipePrices();
                resetGameState();
                scene.scene.start(nextScene);
            } catch (error) {
                console.error(error);
            }
        });
    }
}