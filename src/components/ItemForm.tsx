import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { Upload, X, MapPin, DollarSign } from "lucide-react";

export const ItemForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { addItem } = useInventory();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [buyingPrice, setBuyingPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [image, setImage] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addItem({
            name,
            description,
            location,
            buyingPrice: parseFloat(buyingPrice) || 0,
            sellingPrice: parseFloat(sellingPrice) || 0,
            quantity: parseInt(quantity, 10) || 1,
            imageBase64: image
        });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Selling Location</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. OLX, eBay, Store"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            <span className="flex items-center gap-1">Starting Quantity</span>
                        </label>
                        <input
                            type="number"
                            min="1" step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-red-500" /> Buying Price</span>
                            </label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                value={buyingPrice}
                                onChange={(e) => setBuyingPrice(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-red-600 font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-emerald-500" /> Estimated Selling Price</span>
                            </label>
                            <input
                                type="number"
                                min="0" step="0.01"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-emerald-600 font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                        <div className={`relative border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-colors ${image ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'} h-40`}>
                            {image ? (
                                <>
                                    <img src={image} alt="Preview" className="object-contain h-full w-full p-2" />
                                    <button
                                        type="button"
                                        onClick={() => setImage("")}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-semibold transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                    Save Product
                </button>
            </div>
        </form>
    );
};
