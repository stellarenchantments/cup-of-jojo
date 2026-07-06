import Phaser from "phaser";

type ItemCardProps = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    asset: string;
    getInfoText: () => string;
    quantity?: number;
    onClick?: () => void;
};

export function addItemCard(props: ItemCardProps) {
    const { scene, x, y, asset, getInfoText, quantity = 0, onClick } = props;
    let currentQuantity = quantity;

    const item = scene.add.text(x, y, asset, {
        fontSize: "40px",
        backgroundColor: "#eeeeee",
        padding: { x: 12, y: 8 },
    })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    const quantityBadge = scene.add.container(x + 20, y - 20);

    const badgeCircle = scene.add.circle(0, 0, 12, 0x8a0e95);
    badgeCircle.setStrokeStyle(2, 0x000000);

    const badgeText = scene.add.text(0, 0, currentQuantity.toString(), {
        fontSize: "14px",
        color: "#ffffff",
    }).setOrigin(0.5);

    quantityBadge.add([badgeCircle, badgeText]);
    quantityBadge.setVisible(currentQuantity > 0).setDepth(25);

    const setQuantity = (newQuantity: number) => {
        currentQuantity = newQuantity;
        badgeText.setText(currentQuantity.toString());
        quantityBadge.setVisible(currentQuantity > 0);
    };

    const infoPopup = scene.add.text(x, y + 55, "", {
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { x: 8, y: 6 },
        align: "center",
    })
        .setOrigin(0.5)
        .setVisible(false)
        .setDepth(50);

    item.on("pointerover", () => {
        infoPopup.setText(getInfoText());
        infoPopup.setVisible(true);
    });

    item.on("pointerout", () => {
        infoPopup.setVisible(false);
    });

    item.on("pointerdown", () => {
        onClick?.();
    });

    return {
        item,
        infoPopup,
        quantityBadge,
        setQuantity,
    };
}