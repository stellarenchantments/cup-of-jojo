import Phaser from "phaser";

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.add.text(450, 850, "🏠 Home", {
      fontSize: "32px",
      color: "#000000",
    }).setOrigin(0.5);

    this.add.text(450, 300, "Get some sleep!", {
      fontSize: "28px",
      color: "#000000",
    }).setOrigin(0.5);

    const backButton = this.add.text(450, 500, "⬅ Back to Map", {
      fontSize: "28px",
      color: "#000000",
      backgroundColor: "#eeeeee",
      padding: { x: 16, y: 8 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    backButton.on("pointerdown", () => {
      this.scene.start("MapScene");
    });
  }
}