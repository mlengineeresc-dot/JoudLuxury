import React, { useState } from "react";
import { Item } from "../types";
import { useInventory } from "../context/InventoryContext";
import {
    Trash2, DollarSign, MapPin, CheckCircle, Store,
    Tag, ChevronDown, ChevronUp
} from "lucide-react";


export const ItemCard: React.FC<{ item: Item }> = ({ item }) => {
    const { markAsSold, deleteItem } = useInventory();
    const [showSoldOptions, setShowSoldOptions] = useState(false);
    const [actualSoldPrice, setActualSoldPrice] = useState(item.sellingPrice.toString());
    const [amountSoldStr, setAmountSoldStr] = useState("1");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMarkAsSold = () => {
        markAsSold(item.id, parseInt(amountSoldStr, 10) || 1, parseFloat(actualSoldPrice) || item.sellingPrice);
        setShowSoldOptions(false);
        setAmountSoldStr("1");
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
            <div className="relative h-48 bg-gray-100 flex-shrink-0">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Store className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {item.isSold && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-emerald-500 text-white font-bold px-6 py-2 rounded-full shadow-lg border-2 border-white transform -rotate-12 scale-110 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> SOLD
                        </div>
                    </div>
                )}

                <button
                    onClick={() => deleteItem(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Delete product"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                {item.category && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                        {item.category}
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col items-start text-left">
                <div className="flex justify-between items-start w-full mb-2">
                    <h4 className="font-bold text-lg text-gray-900 truncate pr-2">{item.name}</h4>
                    <span className="font-black text-lg text-emerald-600">${item.sellingPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-blue-600 text-sm font-bold mb-4">
                    QTY: {item.quantity} {item.initialQuantity !== item.quantity ? `(Started with ${item.initialQuantity})` : ''}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider py-2 border-t border-gray-100 mt-auto transition-colors"
                >
                    {isExpanded ? (
                        <><ChevronUp className="w-4 h-4" /> Hide Details</>
                    ) : (
                        <><ChevronDown className="w-4 h-4" /> View Details</>
                    )}
                </button>

                {isExpanded && (
                    <div className="w-full mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                        </div>

                        {item.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                {item.description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm pt-4 border-t border-gray-100 w-full text-left">
                            <div>
                                <span className="block text-xs font-semibold text-gray-400 mb-0.5">Bought via</span>
                                <span className="font-bold text-gray-900 flex items-center">
                                    <span className="text-red-500 mr-0.5">-</span>${item.buyingPrice.toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-gray-400 mb-0.5">
                                    {item.isSold ? 'Sold for' : 'Est. Sell'}
                                </span>
                                <span className="font-bold text-gray-900 flex items-center">
                                    <span className="text-emerald-500 mr-0.5">+</span>
                                    ${(item.isSold ? item.sellingPrice : item.sellingPrice).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {item.isSold ? (
                            <div className={`p-3 rounded-xl flex justify-between items-center w-full ${item.actualProfit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                <span className="text-xs font-bold uppercase tracking-wider">Total Profit</span>
                                <span className="font-black text-lg">
                                    ${item.actualProfit.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <div className="relative space-y-2 pt-2 border-t border-gray-100 w-full">
                                {item.actualProfit !== 0 && (
                                    <div className={`p-2 rounded-xl flex justify-between items-center w-full ${item.actualProfit >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                        <span className="text-xs font-bold uppercase tracking-wider">Profit so far</span>
                                        <span className="font-black">
                                            ${item.actualProfit.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {showSoldOptions ? (
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-2 text-left">
                                        <div className="flex gap-2 mb-2">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 block mb-1">Sell Qty</label>
                                                <input
                                                    type="number"
                                                    min="1" max={item.quantity} step="1"
                                                    value={amountSoldStr}
                                                    onChange={(e) => setAmountSoldStr(e.target.value)}
                                                    className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-gray-500 block mb-1">Price/Item</label>
                                                <div className="relative">
                                                    <DollarSign className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        min="0" step="0.01"
                                                        value={actualSoldPrice}
                                                        onChange={(e) => setActualSoldPrice(e.target.value)}
                                                        className="w-full pl-6 pr-2 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleMarkAsSold}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-colors"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowSoldOptions(true)}
                                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Tag className="w-4 h-4" />
                                        Sell Item
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
