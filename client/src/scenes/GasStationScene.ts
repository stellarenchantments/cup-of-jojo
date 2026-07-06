import Phaser from "phaser";
import { Location, LocationDisplayName } from "../models/Location";
import { GameState } from "../state/GameState";
import { addBackToMapButton } from "../components/BackToMapButton";
import { addGameHud } from "../components/GameHud";
import { showFloatingText } from "../components/FloatingText";

export default class GasStationScene extends Phaser.Scene {
    private gasText!: Phaser.GameObjects.Text;
    private chancesText!: Phaser.GameObjects.Text;
    private messageText!: Phaser.GameObjects.Text;

    private activeCircle: Phaser.GameObjects.Arc | null = null;
    private wrongTargets: Phaser.GameObjects.Arc[] = [];
    private timerEvent: Phaser.Time.TimerEvent | null = null;

    private chancesRemaining = 16;
    private readonly maxGas = GameState.maxGallonsOfGas;
    private readonly roundSeconds = 1.5;
    private readonly gasCostPerGallon = 10;

    private hud!: ReturnType<typeof addGameHud>;

    constructor() {
        super("GasStationScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");
        this.hud = addGameHud(this);

        this.add.text(450, 80, LocationDisplayName[Location.GAS], {
            fontSize: "32px",
            color: "#000000",
        }).setOrigin(0.5);

    const startButton = this.add.text(450, 330, "Start Pumping Gas", {
        fontSize: "28px",
        color: "#000000",
        backgroundColor: "#eeeeee",
        padding: { x: 16, y: 8 },
    })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    startButton.on("pointerdown", () => {
        startButton.destroy();
        this.messageText.setText("Click the green target!");
        this.startRound();
    });

    this.gasText = this.add.text(450, 150, "", {
            fontSize: "28px",
            color: "#000000",
        }).setOrigin(0.5);

        this.chancesText = this.add.text(450, 190, "", {
            fontSize: "24px",
            color: "#000000",
        }).setOrigin(0.5);

        this.messageText = this.add.text(450, 245, "Click the moving gas target!", {
            fontSize: "24px",
            color: "#000000",
        }).setOrigin(0.5);

        this.updateHud();

        addBackToMapButton(this, 450, 540);
    }

    private startRound() {
        this.clearRound();

        if (GameState.gallonsOfGas >= this.maxGas) {
            this.endMiniGame("Tank full!");
            return;
        }

        if (this.chancesRemaining <= 0) {
            this.endMiniGame("Out of chances!");
            return;
        }

        const x = Phaser.Math.Between(100, 800);
        const y = Phaser.Math.Between(300, 450);

        this.activeCircle = this.add.circle(x, y, 30, 0x00aa00)
            .setInteractive({ useHandCursor: true });

        for (let i = 0; i < 3; i++) {
          const badX = Phaser.Math.Between(100, 800);
          const badY = Phaser.Math.Between(300, 450);

          const badCircle = this.add.circle(badX, badY, 25, 0xff9900)
              .setInteractive({ useHandCursor: true });

          badCircle.on("pointerdown", () => {
              this.chancesRemaining -= 1;
              this.messageText.setText("Oops! Wrong truck!");
              this.updateHud();
              this.startRound();
          });

          this.wrongTargets.push(badCircle);
        }

        this.activeCircle.on("pointerdown", () => {
            if (!this.activeCircle) {
                return;
            }

            if (GameState.money < this.gasCostPerGallon) {
                this.endMiniGame("Not enough cash for gas!");
                return;
            }

            const circleX = this.activeCircle.x;
            const circleY = this.activeCircle.y;

            GameState.money -= this.gasCostPerGallon;
            showFloatingText(
                this,
                circleX,
                circleY,
                `+1 ⛽ -$${this.gasCostPerGallon}`,
                "#161cc2"
            );
            this.hud.refresh();

            GameState.gallonsOfGas = Math.min(
                GameState.gallonsOfGas + 1,
                this.maxGas
            );

            this.chancesRemaining -= 1;
            this.messageText.setText("Nice! +1 gallon");
            this.updateHud();
            this.startRound();
        });

        this.timerEvent = this.time.delayedCall(this.roundSeconds * 1000, () => {
            this.chancesRemaining -= 1;
            this.messageText.setText("Too slow!");
            this.updateHud();
            this.startRound();
        });
    }

    private clearRound() {
        if (this.activeCircle) {
            this.activeCircle.destroy();
            this.activeCircle = null;
        }

        if (this.timerEvent) {
            this.timerEvent.remove(false);
            this.timerEvent = null;
        }

        for (const circle of this.wrongTargets) {
          circle.destroy();
        }

        this.wrongTargets = [];
    }

    private updateHud() {
        this.gasText.setText(`Gas: ${GameState.gallonsOfGas}/${this.maxGas} gal`);
        this.chancesText.setText(`Chances left: ${this.chancesRemaining}`);
    }

    private endMiniGame(message: string) {
        this.clearRound();
        this.messageText.setText(message);
    }

}