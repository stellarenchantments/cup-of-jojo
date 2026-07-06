export interface Ingredient {
    id: string;
    name: string;
    sizeOz: number;
    groceryCost: number;
    perishableDays: number | null;
}