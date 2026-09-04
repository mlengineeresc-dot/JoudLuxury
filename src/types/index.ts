export interface Item {
    id: string;
    name: string;
    category: string;
    description?: string;
    location: string;
    buyingPrice: number;
    sellingPrice: number;
    actualProfit: number; // For actual profit
    imageUrl: string;
    quantity: number;
    initialQuantity: number;
    isSold: boolean;
    createdAt: string;
    soldAt?: string;
}

export interface InventoryStats {
    totalItems: number;
    soldItems: number;
    availableItems: number;
    totalProfit: number;
}
