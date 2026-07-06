import Phaser from "phaser";
import { Location } from "../enums/Location";
import { GameState } from "../state/GameState";
import { addLocationButton } from "../components/LocationButton";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super("MapScene");
    }

    create() {
        const locationPositions = {
            [Location.HOME]: { x: 100, y: 250 },
            [Location.GAS]: { x: 450, y: 100 },
            [Location.GROCERY]: { x: 450, y: 500 },
            [Location.MARKET]: { x: 800, y: 250 },
        };

        const truckPosition = locationPositions[GameState.truckLocation];

        this.cameras.main.setBackgroundColor("#ffffff");

        this.add.text(450, 300, "Cup of JoJo", {
            fontSize: "40px",
            color: "#8a0e95",
        }).setOrigin(0.5);

        const truckInfoText = this.add.text(truckPosition.x, truckPosition.y - 45, "", {
            fontSize: "18px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: { x: 8, y: 4 },
        })
            .setOrigin(0.5)
            .setVisible(false);

        const travelInfoText = this.add.text(0, 0, "", {
            fontSize: "18px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: { x: 8, y: 4 },
        })
            .setOrigin(0.5)
            .setVisible(false);

        addLocationButton(this, Location.GAS, 450, 50, "GasStationScene", travelInfoText);
        addLocationButton(this, Location.GROCERY, 450, 550, "GroceryStoreScene", travelInfoText);
        addLocationButton(this, Location.HOME, 100, 300, "HomeScene", travelInfoText);
        addLocationButton(this, Location.MARKET, 800, 300, "MarketScene", travelInfoText);

        const truck = this.add.text(truckPosition.x, truckPosition.y, "🚚", {
            fontSize: "40px",
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        truck.on("pointerover", () => {
            truckInfoText.setText(`Gas: ${GameState.gallonsOfGas} gal`);
            truckInfoText.setVisible(true);
        });

        truck.on("pointerout", () => {
            truckInfoText.setVisible(false);
        });

        truck.setDepth(10);
        truckInfoText.setDepth(11);
        travelInfoText.setDepth(11);
    }
}