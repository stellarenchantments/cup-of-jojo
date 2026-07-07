import Phaser from "phaser";
import { Location, LocationDisplayName } from "../models/Location";
import { addBackToMapButton } from "../components/BackToMapButton";
import { ResetButton } from "../components/buttons/ResetButton";
import { SleepButton } from "../components/SleepButton";

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.add.text(450, 850, LocationDisplayName[Location.HOME], {
      fontSize: "32px",
      color: "#000000",
    })
      .setOrigin(0.5);

    new ResetButton(this, 450, 100, "RESET")
      .setBackgroundColor("#eeeeee",)
      .setPadding( 12, 8 );

    this.add.text(450, 300, "Get some sleep! Click bed to end day.", {
      fontSize: "28px",
      color: "#000000",
    })
      .setOrigin(0.5);

    new SleepButton(this, 400, 350);

    addBackToMapButton(this, 450, 500);
  }  
}