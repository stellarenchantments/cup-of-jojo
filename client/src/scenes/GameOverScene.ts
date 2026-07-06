import Phaser from "phaser";
import { resetGameState } from "../state/GameState";
import { resetInventory } from "../services/InventoryService";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(450, 300, "YOU LOSE! :(", {
            fontSize: "32px",
            color: "#000000",
        }).setOrigin(0.5);

        const resetButton = this.add.text(450, 400, "START OVER", {
            fontSize: "32px",
            color: "#000000",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        resetButton.on("pointerdown", async () => {
            try {
                await resetInventory();
                resetGameState();
                this.scene.start("MapScene");
            } catch (error) {
                console.error(error);
            }
        });
    }
}