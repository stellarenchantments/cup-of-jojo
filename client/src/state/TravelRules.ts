import { Location } from "../models/Location";

const GasCosts: Record<Location, Partial<Record<Location, number>>> = {
  [Location.HOME]: {
    [Location.GAS]: 1,
    [Location.GROCERY]:1,
    [Location.MARKET]: 2,
  },
  [Location.GAS]: {
    [Location.HOME]: 1,
    [Location.GROCERY]:2,
    [Location.MARKET]: 1,
  },
  [Location.GROCERY]: {
    [Location.HOME]: 1,
    [Location.GAS]: 2,
    [Location.MARKET]: 1,
  },
  [Location.MARKET]: {
    [Location.HOME]: 2,
    [Location.GROCERY]:1,
    [Location.GAS]: 1,
  },
};

export function getGasCost(from: Location, to: Location): number {
  if (from === to) {
    return 0;
  }

  return GasCosts[from][to] ?? 1;
}

export function canTravel(from: Location, to: Location, currentGas: number): boolean {
  return currentGas >= getGasCost(from, to);
}