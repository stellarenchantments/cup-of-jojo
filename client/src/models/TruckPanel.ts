import Phaser from "phaser";

export abstract class TruckPanel {
    abstract readonly name: string;

    abstract render(
        scene: Phaser.Scene,
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void
    ): Phaser.GameObjects.GameObject[];

    protected registerObject(
        objects: Phaser.GameObjects.GameObject[],
        addActiveObject: (object: Phaser.GameObjects.GameObject) => void,
        object: Phaser.GameObjects.GameObject
    ) {
        objects.push(object);
        addActiveObject(object);
    }
}