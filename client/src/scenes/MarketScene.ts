import Phaser from "phaser";
import { Location, LocationDisplayName } from "../models/Location";
import { addBackToMapButton } from "../components/BackToMapButton";

export default class MarketScene extends Phaser.Scene {
  constructor() {
    super("MarketScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.add.text(450, 850, LocationDisplayName[Location.MARKET], {
      fontSize: "32px",
      color: "#000000",
    }).setOrigin(0.5);

    this.add.text(450, 300, "Time to serve!", {
      fontSize: "28px",
      color: "#000000",
    }).setOrigin(0.5);

    addBackToMapButton(this, 450, 500);
  }
}