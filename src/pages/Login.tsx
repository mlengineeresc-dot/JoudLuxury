import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, LogIn } from "lucide-react";

export const Login: React.FC = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for the single user
        if (password === "admin123") {
            login();
            navigate("/");
        } else {
            setError("Incorrect password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
            <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 p-4 rounded-full inline-block mb-4 shadow-lg shadow-blue-500/30">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Sales Tracker</h2>
                    <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="Enter admin password (admin123)"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <LogIn className="w-5 h-5" />
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
