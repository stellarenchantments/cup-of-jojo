import Phaser from "phaser";
import { Location, LocationDisplayName } from "../models/Location";
import { addBackToMapButton } from "../components/buttons/BackToMapButton"
import { addGameHud } from "../components/GameHud";
import { getMarketSpots } from "../services/MarketService";
import { GameState } from "../state/GameState";
import { showFloatingText } from "../components/FloatingText";

export default class MarketScene extends Phaser.Scene {
  private hud!: ReturnType<typeof addGameHud>;

  constructor() {
    super("MarketScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");
    this.hud = addGameHud(this);

    this.add.text(450, 60, LocationDisplayName[Location.MARKET], {
      fontSize: "48px",
      color: "#000000",
    }).setOrigin(0.5);

    this.add.text(450, 160, "Choose a market spot for your truck.\nOnce a spot is chosen, \nyou will go inside the food truck\n and are ready to serve drinks!\nGood Luck!", {
      fontSize: "20px",
      color: "#000000",
      align: "center",
    })
      .setOrigin(0.5);

    addBackToMapButton(this, 450, 540);

    this.loadMarketSpots();
  }

  private async loadMarketSpots() {
    try {
      const spots = await getMarketSpots();

      spots.forEach((spot, index) => {
        const x = index === 0 ? 300 : 600;
        const y = 300;

        const spotButton = this.add.text(
          x,
          y,
          `🚚\n${spot.name}\nRent: $${spot.rentalCost}`,
          {
            fontSize: "28px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: { x: 20, y: 16 },
            align: "center",
          }
        )
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });

        spotButton.on("pointerdown", () => {
          if (GameState.money < spot.rentalCost) {
            showFloatingText(this, x, y, "Not enough cash!", "#cc0000");
            return;
          }

          GameState.money -= spot.rentalCost;
          this.hud.refresh();

          showFloatingText(this, x, y, `-$${spot.rentalCost}`, "#161cc2");

          this.time.delayedCall(400, () => {
            this.scene.start("TruckScene");
          });
        });
      });
    } catch (error) {
      console.error(error);

      this.add.text(450, 300, "Could not load market spots", {
        fontSize: "24px",
        color: "#cc0000",
      }).setOrigin(0.5);
    }
  }
}