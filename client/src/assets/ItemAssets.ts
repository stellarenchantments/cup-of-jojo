export const ItemAssets: Record<string, string> = {
    "Coffee Beans": "☕",
    "Water": "💧",
    "Cacao Powder": "🍫",
    "Whole Milk": "🥛",
    "Oat Milk": "🥛",
    "Whipped Cream": "🍦",
    "Chocolate Syrup": "🍫",
};

export function getItemAssets(name: string): string {
    return ItemAssets[name] ?? "❔";
}