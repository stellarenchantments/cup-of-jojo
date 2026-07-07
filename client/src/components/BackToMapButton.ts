import Phaser from "phaser";
import { GameState } from "../state/GameState";

export function addBackToMapButton(scene: Phaser.Scene, x: number, y: number) {
  const button = scene.add.text(x, y, "⬅ Back to Map", {
    fontSize: "18px",
    color: "#000000",
    backgroundColor: "#eeeeee",
    padding: { x: 16, y: 8 },
  })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  button.on("pointerdown", () => {
    if (GameState.gallonsOfGas <= 0) {
      scene.scene.start("GameOverScene");
      return;
    }

    scene.scene.start("MapScene");
  });

  return button;
}