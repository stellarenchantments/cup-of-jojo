export const ItemAssets: Record<string, string> = {
    "Coffee Beans": "🫘",
    "Coffee Grounds": "🟤", 
    "Water": "💧",
    "Cacao Powder": "🍫",
    "Whole Milk": "🥛",
    "Oat Milk": "🥛",
    "Sugar": "🧂",
    "Chocolate": "🍫",
};

export function getItemAssets(name: string): string {
    return ItemAssets[name] ?? "❔";
}