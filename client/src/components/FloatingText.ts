import Phaser from "phaser";

export function showFloatingText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    color = "#000000"
) {
    const floatingText = scene.add.text(x, y, text, {
        fontSize: "22px",
        color,
        backgroundColor: "#ffffff",
        padding: { x: 6, y: 4 },
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: floatingText,
        y: y - 40,
        alpha: 0,
        duration: 700,
        onComplete: () => floatingText.destroy(),
    });
}