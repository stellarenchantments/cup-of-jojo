import Phaser from "phaser";
import { Location, LocationDisplayName } from "../enums/Location";
import { addBackToMapButton } from "../components/BackToMapButton";

export default class GroceryStoreScene extends Phaser.Scene {
    constructor() {
        super("GroceryStoreScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        this.add.text(450, 50, LocationDisplayName[Location.GROCERY], {
        fontSize: "48px",
        color: "#000000",
        }).setOrigin(0.5);

        this.add.text(450, 300, "Get food and materials for the food truck", {
        fontSize: "28px",
        color: "#000000",
        }).setOrigin(0.5);

        addBackToMapButton(this, 450, 500);
    }
}