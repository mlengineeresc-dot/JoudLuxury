import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { Upload, X, MapPin, IndianRupee } from "lucide-react";
import { supabase } from "../lib/supabase";

export const ItemForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { addItem, items } = useInventory();

    // Automatically find existing categories
    const existingCategories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
    const [isCustomCategory, setIsCustomCategory] = useState(existingCategories.length === 0);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [buyingPrice, setBuyingPrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        let imageUrl = "";

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('item-images')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                alert("Failed to upload image. Make sure your Supabase Bucket 'item-images' exists and has public RLS policies.");
                setIsUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('item-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        try {
            await addItem({
                name,
                category,
                description,
                location,
                buyingPrice: parseFloat(buyingPrice) || 0,
                sellingPrice: parseFloat(sellingPrice) || 0,
                quantity: parseInt(quantity, 10) || 1,
                imageUrl
            });
            onSuccess();
        } catch (err) {
            console.error("Error adding item:", err);
            alert("Failed to add item. Check your database setup.");
        } finally {
            setIsUploading(false);
        }
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        {!isCustomCategory && existingCategories.length > 0 ? (
                            <select
                                value={category}
                                onChange={(e) => {
                                    if (e.target.value === "__NEW__") {
                                        setIsCustomCategory(true);
                                        setCategory("");
                                    } else {
                                        setCategory(e.target.value);
                                    }
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select a category...</option>
                                {existingCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="__NEW__" className="font-bold text-blue-600">+ Add New Category</option>
                            </select>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-16"
                                    placeholder="e.g. Watches, Perfumes"
                                    required
                                />
                                {existingCategories.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomCategory(false);
                                            setCategory(existingCategories[0] || "");
                                        }}
                                        className="absolute right-3 top-2.5 text-sm text-gray-400 font-semibold hover:text-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
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
                                <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-red-500" /> Buying Price</span>
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
                                <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-emerald-500" /> Estimated Selling Price</span>
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
                        <div className={`relative border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-colors ${imagePreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'} h-40`}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="object-contain h-full w-full p-2" />
                                    <button
                                        type="button"
                                        onClick={() => { setImagePreview(""); setImageFile(null); }}
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
                    disabled={isUploading}
                    className={`px-6 py-2.5 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                >
                    {isUploading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
};
