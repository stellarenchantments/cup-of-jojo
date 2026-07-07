import type { Recipe } from "../models/Recipe";

export type ActiveOrder = {
    customerEmoji: string;
    recipe: Recipe;
    isPrepared: boolean;
};

let activeOrder: ActiveOrder | null = null;

export function getActiveOrder() {
    return activeOrder;
}

export function setActiveOrder(order: ActiveOrder) {
    activeOrder = order;
}

export function markActiveOrderPrepared() {
    if (!activeOrder) return;
    activeOrder.isPrepared = true;
}

export function clearActiveOrder() {
    activeOrder = null;
}