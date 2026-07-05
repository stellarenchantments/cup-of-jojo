import Phaser from "phaser";

export default class GroceryStoreScene extends Phaser.Scene {
    constructor() {
        super("GroceryStoreScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        this.add.text(450, 50, "🛒 Grocery Store", {
        fontSize: "48px",
        color: "#000000",
        }).setOrigin(0.5);

        this.add.text(450, 300, "Get food and materials for the food truck", {
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