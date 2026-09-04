import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { ItemForm } from './ItemForm';
import { X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Navbar onAddClick={() => setShowAddForm(true)} />

            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-gray-100 relative my-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-[110]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6">
                            <ItemForm onSuccess={() => setShowAddForm(false)} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};
