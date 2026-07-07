import Phaser from "phaser";
import { ResetButton } from "../components/buttons/ResetButton";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(450, 300, "YOU LOSE! :(", {
            fontSize: "32px",
            color: "#000000",
        }).setOrigin(0.5);

        new ResetButton(this, 450, 400, "START OVER");
    }
}