import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { PackageSearch, DollarSign, PackageCheck, LogOut, Plus, X } from "lucide-react";
import { ItemForm } from "../components/ItemForm";
import { ItemCard } from "../components/ItemCard";

export const Dashboard: React.FC = () => {
    const { stats, items } = useInventory();
    const { logout } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState<"all" | "available" | "sold">("all");

    const filteredItems = items.filter(item => {
        if (filter === "available") return !item.isSold;
        if (filter === "sold") return item.isSold;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
                                <PackageSearch className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900">SalesTracker</span>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

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
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
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
                                Inventory ({stats.availableItems})
                            </button>
                            <button
                                onClick={() => setFilter("sold")}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${filter === "sold" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sold ({stats.soldItems})
                            </button>
                        </div>

                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-gray-900/20"
                        >
                            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {showAddForm ? "Cancel" : "Add New Item"}
                        </button>
                    </div>

                    <div className="p-6 bg-gray-50/50">
                        {showAddForm && (
                            <div className="mb-8 max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300">
                                <ItemForm onSuccess={() => setShowAddForm(false)} />
                            </div>
                        )}

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
        </div>
    );
};
