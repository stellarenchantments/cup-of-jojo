import Phaser from "phaser";
import { startNewDayGameState } from "../state/GameState";

export class SleepButton {
    private button: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.button = scene.add
            .text(x, y, "🛏️", {
                fontSize: "65px",
            })
            .setInteractive({ useHandCursor: true });

        this.button.on("pointerdown", async () => {
            await startNewDayGameState();

            scene.scene.start("MapScene");
        });
    }

    destroy() {
        this.button.destroy();
    }
}