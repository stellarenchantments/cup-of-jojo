import Phaser from "phaser";
import { Location, LocationDisplayName } from "../enums/Location";
import { addBackToMapButton } from "../components/BackToMapButton";

export default class GasStationScene extends Phaser.Scene {
  constructor() {
    super("GasStationScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.add.text(450, 850, LocationDisplayName[Location.GAS], {
      fontSize: "32px",
      color: "#000000",
    }).setOrigin(0.5);

    this.add.text(450, 300, "Get gas for the food truck", {
      fontSize: "28px",
      color: "#000000",
    }).setOrigin(0.5);

    addBackToMapButton(this, 450, 500);
  }
}