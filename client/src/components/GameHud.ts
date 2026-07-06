import Phaser from "phaser";
import { GameState } from "../state/GameState";

export function addGameHud(scene: Phaser.Scene) {
    const hudText = scene.add.text(880, 20, "", {
        fontSize: "18px",
        color: "#000000",
        align: "right",
        backgroundColor: "#eeeeee",
        padding: { x: 8, y: 6 },
    })
        .setOrigin(1, 0)
        .setDepth(100);

    const refresh = () => {
        hudText.setText(
            `Day: ${GameState.day}\nTime: ${GameState.time}\nCash: $${GameState.money}`
        );
    };

    refresh();

    return {
        text: hudText,
        refresh,
    };
}