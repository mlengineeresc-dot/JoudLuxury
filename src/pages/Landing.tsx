import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { PackageSearch, Search } from "lucide-react";
import { ItemCard } from "../components/ItemCard";

export const Landing: React.FC = () => {
    const { items } = useInventory();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = ["All", ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

    const filteredItems = items.filter(item => {
        if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 min-h-[500px]">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 w-full max-w-md relative">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 items-center w-full md:w-auto">
                        <span className="text-sm font-semibold text-gray-500">Category:</span>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 md:flex-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 min-w-[200px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 h-full min-h-[400px]">
                    {filteredItems.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
                            <PackageSearch className="w-16 h-16 mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                            <p>Try adjusting your search or category filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <ItemCard key={item.id} item={item} variant="library" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
