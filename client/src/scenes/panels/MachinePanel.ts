import Phaser from "phaser";
import { TruckPanel } from "../../models/TruckPanel";
import { Kettle } from "../../components/machines/Kettle";

export class MachinePanel extends TruckPanel {
    readonly name = "Drink Station";

    render(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ): Phaser.GameObjects.GameObject[] {
        const objects: Phaser.GameObjects.GameObject[] = [];

        this.registerObject(
            objects,
            addActiveObject,
            scene.add.text(450, 90, `${this.name}`, {
                fontSize: "30px",
                color: "#000000",
            }).setOrigin(0.5)
        );

        new Kettle(scene, 450, 300, addActiveObject);

        return objects;
    }
}