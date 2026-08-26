import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, InventoryStats } from "../types";
interface InventoryContextType {
    items: Item[];
    addItem: (item: Omit<Item, "id" | "createdAt" | "isSold" | "actualProfit" | "initialQuantity">) => void;
    markAsSold: (id: string, amountSold: number, customSellingPrice?: number) => void;
    deleteItem: (id: string) => void;
    stats: InventoryStats;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Item[]>(() => {
        const saved = localStorage.getItem("inventory_items");
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.map((item: any) => ({
                ...item,
                quantity: item.quantity ?? (item.isSold ? 0 : 1),
                initialQuantity: item.initialQuantity ?? 1,
                actualProfit: item.actualProfit ?? 0,
            }));
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("inventory_items", JSON.stringify(items));
    }, [items]);

    const addItem = (itemData: Omit<Item, "id" | "createdAt" | "isSold" | "actualProfit" | "initialQuantity">) => {
        const newItem: Item = {
            ...itemData,
            id: crypto.randomUUID(),
            initialQuantity: itemData.quantity,
            actualProfit: 0,
            isSold: false,
            createdAt: new Date().toISOString(),
        };
        setItems((prev) => [newItem, ...prev]);
    };

    const markAsSold = (id: string, amountSold: number, customSellingPrice?: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const finalSellingPrice = customSellingPrice ?? item.sellingPrice;
                    const newQuantity = Math.max(0, item.quantity - amountSold);
                    const profitGained = (finalSellingPrice - item.buyingPrice) * amountSold;
                    return {
                        ...item,
                        quantity: newQuantity,
                        isSold: newQuantity === 0,
                        actualProfit: item.actualProfit + profitGained,
                        soldAt: new Date().toISOString(),
                    };
                }
                return item;
            })
        );
    };

    const deleteItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const stats: InventoryStats = {
        totalItems: items.length,
        soldItems: items.reduce((acc, curr) => acc + (curr.initialQuantity - curr.quantity), 0),
        availableItems: items.reduce((acc, curr) => acc + curr.quantity, 0),
        totalProfit: items.reduce((acc, curr) => acc + (curr.actualProfit || 0), 0),
    };

    return (
        <InventoryContext.Provider value={{ items, addItem, markAsSold, deleteItem, stats }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
};
