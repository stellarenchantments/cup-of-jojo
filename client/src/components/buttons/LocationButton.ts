import Phaser from "phaser";
import { Location, LocationDisplayName } from "../../assets/Location";
import { GameState } from "../../state/GameState";
import { canTravel, getGasCost } from "../../state/TravelRules";

export function addLocationButton(
    scene: Phaser.Scene,
    location: Location,
    x: number,
    y: number,
    sceneName: string,
    travelInfoText: Phaser.GameObjects.Text
) {
    const button = scene.add.text(x, y, LocationDisplayName[location], {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#eeeeee",
        padding: { x: 16, y: 8 },
    })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
        const cost = getGasCost(GameState.truckLocation, location);

        travelInfoText.setPosition(button.x, button.y + 45);
        travelInfoText.setText(`Travel 🚚: ${cost} gal`);
        travelInfoText.setVisible(true);
    });

    button.on("pointerout", () => {
        travelInfoText.setVisible(false);
    });

    button.on("pointerdown", () => {
        const cost = getGasCost(GameState.truckLocation, location);

        if (!canTravel(GameState.truckLocation, location, GameState.gallonsOfGas)) {
            travelInfoText.setPosition(button.x, button.y + 45);
            travelInfoText.setText("Not enough gas!");
            travelInfoText.setVisible(true);
            return;
        }

        GameState.gallonsOfGas -= cost;
        GameState.truckLocation = location;

        scene.scene.start(sceneName);
    });

    return button;
}