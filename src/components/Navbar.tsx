import React from 'react';
import { PackageSearch, LogOut, Plus, Search, Archive } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export const Navbar: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
                                <PackageSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-gray-900 hidden sm:block">Joud Luxury</span>
                        </Link>
                        <div className="flex gap-1 sm:gap-2 border-l border-gray-200 pl-4 sm:pl-6 h-8 items-center">
                            <Link to="/" className={`px-2 sm:px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${location.pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                <Search className="w-4 h-4" /> <span className="hidden xs:inline">Landing</span>
                            </Link>
                            <Link to="/inventory" className={`px-2 sm:px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${location.pathname === '/inventory' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                <Archive className="w-4 h-4" /> <span className="hidden xs:inline">Inventory</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onAddClick}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Item</span>
                        </button>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
