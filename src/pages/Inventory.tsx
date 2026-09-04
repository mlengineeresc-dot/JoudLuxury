import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { PackageSearch, DollarSign, PackageCheck } from "lucide-react";
import { ItemCard } from "../components/ItemCard";

export const Inventory: React.FC = () => {
    const { stats, items } = useInventory();
    const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

    const filteredItems = items.filter(item => {
        if (selectedCategory !== "All" && item.category !== selectedCategory) return false;

        if (filter === "available") return !item.isSold;
        if (filter === "sold") return item.isSold;
        return true;
    });

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100/50 p-4 rounded-xl text-blue-600">
                        <PackageSearch className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalItems}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-emerald-100/50 p-4 rounded-xl text-emerald-600">
                        <PackageCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Items Sold</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.soldItems}</h3>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="bg-violet-100/50 p-4 rounded-xl text-violet-600">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Actual Profit</p>
                        <h3 className="text-3xl font-black text-violet-700 mt-1">${stats.totalProfit.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[500px]">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-max">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                All Items
                            </button>
                            <button
                                onClick={() => setFilter("available")}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${filter === "available" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Inventory
                            </button>
                            <button
                                onClick={() => setFilter("sold")}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${filter === "sold" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sold
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50">
                    {filteredItems.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                            <PackageSearch className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                            <p>You haven't added any items in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
