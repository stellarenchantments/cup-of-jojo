import Phaser from "phaser";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super("MapScene");
    }

    preload() {
        // Load assets here later
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        this.add.text(450, 300, "Cup of Jojos", {
            fontSize: "40px",
            color: "#000000",
        }).setOrigin(0.5);

        const gasStationButton = this.add.text(450, 50, "⛽ Gas Station", {
            fontSize: "32px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: {
                x: 16,
                y: 8,
            },    
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            gasStationButton.on("pointerdown", () => {
                this.scene.start("GasStationScene");    
            });

        const groceryStoreButton = this.add.text(450, 550, "🛒 Grocery Store", {
                fontSize: "32px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                padding: {
                    x: 16,
                    y: 8,
                },    
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        
            groceryStoreButton.on("pointerdown", () => {
                this.scene.start("GroceryStoreScene");
            });

        const homeButton = this.add.text(100, 300, "🏠 Home", {
                fontSize: "32px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                padding: {
                    x: 16,
                    y: 8,
                },    
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        
            homeButton.on("pointerdown", () => {
                this.scene.start("HomeScene");
            });

        const marketButton = this.add.text(800, 300, "☕ Market", {
            fontSize: "32px",
                color: "#000000",
                backgroundColor: "#eeeeee",
                padding: {
                    x: 16,
                    y: 8,
                },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

            marketButton.on("pointerdown", () => {
                this.scene.start("MarketScene")
            });
    }

    update() {
        // Update logic later
    }
}