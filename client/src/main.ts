import "./style.css";
import Phaser from "phaser";
import MapScene from "./scenes/MapScene";
import TruckScene from "./scenes/TruckScene";
import GasStationScene from "./scenes/GasStationScene";
import GroceryStoreScene from "./scenes/GroceryStoreScene";
import HomeScene from "./scenes/HomeScene";
import MarketScene from "./scenes/MarketScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 900,
  height: 600,
  backgroundColor: "#0bac41",
  scene: [MapScene, TruckScene, GasStationScene, GroceryStoreScene, HomeScene, MarketScene],
};

new Phaser.Game(config);