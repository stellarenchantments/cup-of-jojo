import { Location } from "../enums/Location";

export const GameState = {
  truckLocation: Location.HOME,
  gallonsOfGas: 1,
  gameOver: false,
};

export function resetGameState() {
  GameState.truckLocation = Location.HOME;
  GameState.gallonsOfGas = 1;
  GameState.gameOver = false;
}