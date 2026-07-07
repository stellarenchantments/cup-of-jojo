import Phaser from "phaser";
import { addGameHud } from "../components/GameHud";
import { WindowPanel } from "./panels/WindowPanel"
import { MachinePanel } from "./panels/MachinePanel";
import { InventoryPanel } from "./panels/InventoryPanel";
import type { TruckPanel } from "../models/TruckPanel";
import { addBackToMapButton } from "../components/BackToMapButton";

export default class TruckScene extends Phaser.Scene {
    private hud!: ReturnType<typeof addGameHud>;
    private panels: TruckPanel[] = [
        new MachinePanel(),
        new WindowPanel(),
        new InventoryPanel(),
    ];
    private currentPanelIndex = 1;
    private panelRenderId = 0;
    private activeObjects: Phaser.GameObjects.GameObject[] = [];

    constructor() {
        super("TruckScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");
        this.hud = addGameHud(this);

        this.add.text(450, 50, "Market", {
            fontSize: "30px",
            color: "#000000",
        }).setOrigin(0.5);

        addBackToMapButton(this, 800, 110);

        this.addArrow(35, 100, "<", -1);
        this.addArrow(965, 100, ">", 1);

        this.showPanel();
    }

    private addArrow(x: number, y: number, label: string, direction: number) {
        const arrow = this.add.text(x, y, label, {
            fontSize: "48px",
            color: "#000000",
            backgroundColor: "#eeeeee",
            padding: { x: 12, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        arrow.on("pointerdown", () => {
            this.currentPanelIndex += direction;

            if (this.currentPanelIndex < 0) {
                this.currentPanelIndex = this.panels.length - 1;
            }

            if (this.currentPanelIndex >= this.panels.length) {
                this.currentPanelIndex = 0;
            }

            this.showPanel();
        });
    }

    private showPanel() {
        this.panelRenderId++;

        this.activeObjects.forEach((object) => object.destroy());
        this.activeObjects = [];

        const currentRenderId = this.panelRenderId;

        const addActiveObject = (object: Phaser.GameObjects.GameObject) => {
            if (currentRenderId !== this.panelRenderId) {
                object.destroy();
                return;
            }

            this.activeObjects.push(object);
        };

        const panel = this.panels[this.currentPanelIndex];

        panel.render(this, addActiveObject).forEach(addActiveObject);
    }
}