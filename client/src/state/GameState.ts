import { Location } from "../enums/Location";

export const GameState = {
    truckLocation: Location.HOME,
    gallonsOfGas: 1,
    maxGallonsOfGas: 18,
    money: 300,
    day: 1,
    time: "8:00 AM",
    gameOver: false,
};

export function resetGameState() {
    GameState.truckLocation = Location.HOME;
    GameState.gallonsOfGas = 1;
    GameState.maxGallonsOfGas = 18;
    GameState.money = 300;
    GameState.day = 1;
    GameState.time = "8:00 AM";
    GameState.gameOver = false;
}