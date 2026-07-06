import Phaser from "phaser";

export function addShelf(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    label: string
) {
    const labelText = scene.add.text(x, y - 30, label, {
        fontSize: "24px",
        color: "#000000",
    }).setOrigin(0.5);

    const shelfLine = scene.add.rectangle(x, y, width, 12, 0x8b5a2b)
        .setOrigin(0.5);

    const startX = x - width / 2 + 50;
    let nextX = startX;
    let nextY = y - 35;

    const spacing = 90;

    function getNextItemPosition() {
        const position = {
            x: nextX,
            y: nextY,
        };

        nextX += spacing;

        if (nextX > x + width / 2 - 50) {
            nextX = startX;
            nextY += 90;
        }

        return position;
    }

    return {
        labelText,
        shelfLine,
        getNextItemPosition,
    };
}