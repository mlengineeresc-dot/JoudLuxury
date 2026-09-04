import React, { createContext, useContext, useState, useEffect } from "react";
import { Item, InventoryStats } from "../types";
import { supabase } from "../lib/supabase";

interface InventoryContextType {
    items: Item[];
    addItem: (item: Omit<Item, "id" | "createdAt" | "isSold" | "actualProfit" | "initialQuantity">) => Promise<void>;
    markAsSold: (id: string, amountSold: number, customSellingPrice?: number) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    stats: InventoryStats;
    loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error("Error fetching items:", error);
        } else if (data) {
            setItems(data as Item[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const addItem = async (itemData: Omit<Item, "id" | "createdAt" | "isSold" | "actualProfit" | "initialQuantity">) => {
        const newItem = {
            name: itemData.name,
            description: itemData.description,
            location: itemData.location,
            buyingPrice: itemData.buyingPrice,
            sellingPrice: itemData.sellingPrice,
            actualProfit: 0,
            imageUrl: itemData.imageUrl,
            quantity: itemData.quantity,
            initialQuantity: itemData.quantity,
            isSold: false
        };

        const { data, error } = await supabase
            .from('items')
            .insert(newItem)
            .select()
            .single();

        if (error) {
            console.error("Error adding item:", error);
            throw error;
        }
        if (data) setItems((prev) => [data as Item, ...prev]);
    };

    const markAsSold = async (id: string, amountSold: number, customSellingPrice?: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const finalSellingPrice = customSellingPrice ?? item.sellingPrice;
        const newQuantity = Math.max(0, item.quantity - amountSold);
        const profitGained = (finalSellingPrice - item.buyingPrice) * amountSold;
        const newActualProfit = item.actualProfit + profitGained;

        const updates = {
            quantity: newQuantity,
            isSold: newQuantity === 0,
            actualProfit: newActualProfit,
            soldAt: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error marking item as sold:", error);
            throw error;
        }

        if (data) {
            setItems((prev) => prev.map((i) => i.id === id ? (data as Item) : i));
        }
    };

    const deleteItem = async (id: string) => {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const stats: InventoryStats = {
        totalItems: items.length,
        soldItems: items.reduce((acc, curr) => acc + (curr.initialQuantity - curr.quantity), 0),
        availableItems: items.reduce((acc, curr) => acc + curr.quantity, 0),
        totalProfit: items.reduce((acc, curr) => acc + (curr.actualProfit || 0), 0),
    };

    return (
        <InventoryContext.Provider value={{ items, addItem, markAsSold, deleteItem, stats, loading }}>
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
