import Phaser from "phaser";
import { ResetButton } from "../components/buttons/ResetButton";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(450, 300, "YOU LOSE! :(\nYou ran out of gas and got stranded!\nTry Again?", {
            fontSize: "32px",
            color: "#000000",
            align: "center"
        }).setOrigin(0.5);

        new ResetButton(this, 450, 400, "START OVER")
            .setBackgroundColor("#0e270d")
            .setColor("#FFFFFF");
    }
}