import "./style.css";
import Phaser from "phaser";
import MapScene from "./scenes/MapScene";
import TruckScene from "./scenes/TruckScene";
import GasStationScene from "./scenes/GasStationScene";
import GroceryStoreScene from "./scenes/GroceryStoreScene";
import HomeScene from "./scenes/HomeScene";
import MarketScene from "./scenes/MarketScene";
import GameOverScene from "./scenes/GameOverScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1000,
  height: 700,
  backgroundColor: "#0bac41",
  scene: [MapScene, TruckScene, GasStationScene, GroceryStoreScene, HomeScene, MarketScene, GameOverScene],
};

new Phaser.Game(config);