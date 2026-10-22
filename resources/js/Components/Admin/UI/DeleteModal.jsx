import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-white/40 backdrop-blur-md transition-all duration-500">
            {/* Main Flux-Style Card */}
            <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Top Banner Accent (Flux Pink) */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#e91e63] to-[#ff4081]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="p-10 pt-12 flex flex-col items-center text-center">
                    {/* Icon Circle */}
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
                        <Trash2
                            className="text-black"
                            size={32}
                            strokeWidth={1.5}
                        />
                    </div>

                    {/* Typography - Minimalist & Precise */}
                    <div className="mb-10">
                        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
                            Remove Product
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed px-4">
                            Are you sure you want to remove{" "}
                            <span className="text-black font-bold">
                                "{itemName}"
                            </span>
                            ? This will permanently delete the item from your
                            global inventory.
                        </p>
                    </div>

                    {/* Action Buttons - Nike/Flux Style */}
                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-[0.98]"
                        >
                            Confirm Deletion
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white text-gray-400 text-xs font-bold uppercase tracking-widest rounded-2xl border border-gray-100 hover:border-gray-300 hover:text-gray-900 transition-all active:scale-[0.98]"
                        >
                            Return to Products
                        </button>
                    </div>
                </div>

                {/* Subtle Branding Footer */}
                <div className="bg-gray-50/50 py-4 border-t border-gray-50 flex justify-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                        Flux Admin v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
