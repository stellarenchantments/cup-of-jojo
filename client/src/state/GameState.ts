import { Location } from "../models/Location";
import { ageInventoryOneDay } from "../services/InventoryService";
import { clearActiveOrder } from "./OrderState";

export const GameState = {
    truckLocation: Location.HOME,
    gallonsOfGas: 1,
    maxGallonsOfGas: 18,
    money: 300,
    day: 1,
    gameOver: false,
};

export function resetGameState() {
    clearActiveOrder();
    GameState.truckLocation = Location.HOME;
    GameState.gallonsOfGas = 1;
    GameState.maxGallonsOfGas = 18;
    GameState.money = 300;
    GameState.day = 1;
    GameState.gameOver = false;
}

export async function startNewDayGameState() {
    await ageInventoryOneDay();
    clearActiveOrder();

    GameState.truckLocation = Location.HOME;
    GameState.maxGallonsOfGas = 18;
    GameState.day += 1;
    GameState.gameOver = false;
}
